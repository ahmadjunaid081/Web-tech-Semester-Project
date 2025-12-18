const express = require('express');
const router = express.Router();

// Home Page Route
router.get('/', (req, res) => {
    res.render('index', {
        title: 'BeShop - Home',
        currentPage: 'home'
    });
});

// Cart Page Route
router.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Cart - BeShop',
        currentPage: 'cart'
    });
});

// Checkout Page Route
router.get('/checkout', (req, res) => {
    res.render('checkout', {
        title: 'Checkout - BeShop',
        currentPage: 'checkout'
    });
});

module.exports = router;
