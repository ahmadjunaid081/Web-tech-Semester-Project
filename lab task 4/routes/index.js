const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home Page
router.get('/', async (req, res) => {
    try {
        const productsForHer = await Product.find({ gender: 'for-her', featured: true }).limit(8);
        const productsForHim = await Product.find({ gender: 'for-him', featured: true }).limit(8);

        res.render('index', {
            title: 'BeShop - Home',
            currentPage: 'home',
            productsForHer,
            productsForHim
        });
    } catch (error) {
        console.error('Home page error:', error);
        res.render('index', {
            title: 'BeShop - Home',
            currentPage: 'home',
            productsForHer: [],
            productsForHim: []
        });
    }
});

module.exports = router;
