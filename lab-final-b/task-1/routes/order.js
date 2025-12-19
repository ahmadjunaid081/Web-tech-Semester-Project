const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Order Preview - GET /order/preview
router.get('/preview', (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('order-preview', {
        title: 'Order Preview',
        cart,
        total
    });
});

// Confirm Order - POST /order/confirm
router.post('/confirm', async (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order in MongoDB
        const order = new Order({
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalAmount: total,
            status: 'Placed'  // Order status = Placed
        });

        await order.save();

        // Clear cart session
        req.session.cart = [];

        // Redirect to success page with order ID
        res.redirect(`/order/success/${order._id}`);

    } catch (error) {
        console.error('Order error:', error);
        res.render('order-preview', {
            title: 'Order Preview',
            cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            error: 'Failed to place order. Please try again.'
        });
    }
});

// Order Success - GET /order/success/:id
router.get('/success/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.redirect('/');
        }

        res.render('order-success', {
            title: 'Order Placed!',
            order
        });
    } catch (error) {
        res.redirect('/');
    }
});

module.exports = router;
