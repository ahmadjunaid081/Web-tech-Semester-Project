document.addEventListener('DOMContentLoaded', () => {
    
    const getCart = () => JSON.parse(localStorage.getItem('beShopCart')) || [];
    const saveCart = (cart) => localStorage.setItem('beShopCart', JSON.stringify(cart));

    const updateHeaderCart = () => {
        const cart = getCart();
        const cartCountEl = document.getElementById('cart-count');
        const cartTotalEl = document.getElementById('cart-total');

        if (cartCountEl && cartTotalEl) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartCountEl.textContent = totalItems;
            cartTotalEl.textContent = `£${subtotal.toFixed(2)}`;
        }
    };

    const miniCartDropdown = document.getElementById('mini-cart-dropdown');
    
    const renderMiniCart = () => {
        const cart = getCart();
        if (!miniCartDropdown) return;

        if (cart.length === 0) {
            miniCartDropdown.innerHTML = '<p class="text-center m-0">Your cart is empty.</p>';
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemsHTML = cart.map(item => `
            <div class="mini-cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="mini-cart-item-info">
                    <span class="fw-bold">${item.name}</span>
                    <span>${item.quantity} x £${item.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');

        miniCartDropdown.innerHTML = `
            <div class="mini-cart-items">${itemsHTML}</div>
            <div class="mini-cart-subtotal">
                <span>Subtotal:</span>
                <span>£${subtotal.toFixed(2)}</span>
            </div>
            <div class="mini-cart-actions">
                <a href="cart.html" class="btn btn-secondary">View Cart</a>
                <a href="checkout.html" class="btn btn-primary">Checkout</a>
            </div>
        `;
    };

    const toggleMiniCart = (show) => {
        if (!miniCartDropdown) return;
        if (show) {
            renderMiniCart();
            miniCartDropdown.classList.add('show');
        } else {
            miniCartDropdown.classList.remove('show');
        }
    };

    document.getElementById('header-cart-icon')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderMiniCart();
        miniCartDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-cart-wrapper')) {
            toggleMiniCart(false);
        }
    });

    const addToCart = (productCard) => {
        const id = productCard.dataset.id;
        const name = productCard.dataset.name;
        const price = parseFloat(productCard.dataset.price);
        const image = productCard.dataset.image;

        let cart = getCart();
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        saveCart(cart);
        updateHeaderCart();
        toggleMiniCart(true); 
    };

    const bodyId = document.body.id;

    if (bodyId === 'home-page') {
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                addToCart(e.target.closest('.product-card'));
            });
        });
    }

    if (bodyId === 'cart-page') {
        const cartContainer = document.getElementById('cart-container');
        let cart = getCart();
        
        const renderCart = () => {
            if (cart.length === 0) {
                cartContainer.innerHTML = `<div class="col-12 text-center"><p class="fs-4">Your cart is empty.</p><a href="index.html" class="btn btn-primary">Continue Shopping</a></div>`;
                return;
            }

            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const cartItemsHTML = cart.map(item => `
                <tr class="cart-item-row" data-id="${item.id}">
                    <td><div class="cart-product-info"><img src="${item.image}" alt="${item.name}"><span>${item.name}</span></div></td>
                    <td>£${item.price.toFixed(2)}</td>
                    <td><input type="number" class="form-control quantity-input" value="${item.quantity}" min="1"></td>
                    <td>£${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="remove-btn">&times;</button></td>
                </tr>
            `).join('');

            cartContainer.innerHTML = `
                <div class="col-lg-8"><table class="cart-table">
                    <thead><tr><th>PRODUCT</th><th>PRICE</th><th>QUANTITY</th><th>SUBTOTAL</th><th></th></tr></thead>
                    <tbody>${cartItemsHTML}</tbody>
                </table></div>
                <div class="col-lg-4"><div class="cart-totals">
                    <h4 class="mb-3">Cart totals</h4>
                    <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>£${subtotal.toFixed(2)}</span></div>
                    <div class="d-flex justify-content-between fw-bold border-top pt-2"><span>Total</span><span>£${subtotal.toFixed(2)}</span></div>
                    <a href="checkout.html" class="btn btn-primary w-100 mt-3">Proceed to checkout</a>
                </div></div>`;
            
            cartContainer.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const id = e.target.closest('.cart-item-row').dataset.id;
                    const newQuantity = parseInt(e.target.value);
                    const item = cart.find(item => item.id === id);
                    if (item && newQuantity > 0) {
                        item.quantity = newQuantity;
                        saveCart(cart);
                        renderCart(); updateHeaderCart();
                    }
                });
            });

            cartContainer.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.closest('.cart-item-row').dataset.id;
                    cart = cart.filter(item => item.id !== id);
                    saveCart(cart);
                    renderCart(); updateHeaderCart();
                });
            });
        };
        renderCart();
    }

    if (bodyId === 'checkout-page') {
        const orderSummaryEl = document.getElementById('checkout-order-summary');
        const cart = getCart();

        if (cart.length === 0 && orderSummaryEl) {
             window.location.href = 'index.html'; return;
        }

        if (orderSummaryEl) {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shipping = 5.00;
            const total = subtotal + shipping;

            const itemsHTML = cart.map(item => `<li class="list-group-item d-flex justify-content-between lh-sm"><div><h6 class="my-0">${item.name} (x${item.quantity})</h6></div><span class="text-muted">£${(item.price * item.quantity).toFixed(2)}</span></li>`).join('');

            orderSummaryEl.innerHTML = `${itemsHTML}<li class="list-group-item d-flex justify-content-between"><span>Subtotal</span><strong>£${subtotal.toFixed(2)}</strong></li><li class="list-group-item d-flex justify-content-between"><span>Shipping</span><strong>£${shipping.toFixed(2)}</strong></li><li class="list-group-item d-flex justify-content-between bg-light"><span class="fw-bold">Total (GBP)</span><strong class="fw-bold">£${total.toFixed(2)}</strong></li>`;
        }
    }

    updateHeaderCart();
});