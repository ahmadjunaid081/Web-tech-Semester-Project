const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home page - Product listing
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { title: 'BeShop - Home', products });
    } catch (error) {
        res.render('index', { title: 'BeShop - Home', products: [] });
    }
});

// Add to cart
router.post('/cart/add', async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.redirect('/');

        if (!req.session.cart) req.session.cart = [];

        const existingItem = req.session.cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += parseInt(quantity) || 1;
        } else {
            req.session.cart.push({
                productId: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: parseInt(quantity) || 1,
                image: product.image
            });
        }

        res.redirect('/cart');
    } catch (error) {
        res.redirect('/');
    }
});

// View cart
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('cart', { title: 'Your Cart', cart, total });
});

// Update cart
router.post('/cart/update', (req, res) => {
    const { productId, quantity } = req.body;

    if (req.session.cart) {
        const item = req.session.cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                req.session.cart = req.session.cart.filter(i => i.productId !== productId);
            }
        }
    }

    res.redirect('/cart');
});

// Remove from cart
router.post('/cart/remove', (req, res) => {
    const { productId } = req.body;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    res.redirect('/cart');
});

module.exports = router;
