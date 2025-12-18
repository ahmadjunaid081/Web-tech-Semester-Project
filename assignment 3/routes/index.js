const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home Page Route - with products from MongoDB
router.get('/', async (req, res) => {
    try {
        // Fetch featured products for her (limit 8)
        const productsForHer = await Product.find({
            gender: 'for-her',
            featured: true
        }).limit(8);

        // Fetch featured products for him (limit 8)
        const productsForHim = await Product.find({
            gender: 'for-him',
            featured: true
        }).limit(8);

        res.render('index', {
            title: 'BeShop - Home',
            currentPage: 'home',
            productsForHer,
            productsForHim
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.render('index', {
            title: 'BeShop - Home',
            currentPage: 'home',
            productsForHer: [],
            productsForHim: []
        });
    }
});

// Shop Page Route - with pagination and filters
router.get('/shop', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 8,
            category,
            gender,
            minPrice,
            maxPrice,
            sort = 'newest'
        } = req.query;

        // Build filter object
        const filter = {};
        if (category && category !== 'all') {
            filter.category = category.toLowerCase();
        }
        if (gender && gender !== 'all') {
            filter.gender = gender.toLowerCase();
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Build sort object
        let sortOption = {};
        switch (sort) {
            case 'price_asc':
                sortOption = { price: 1 };
                break;
            case 'price_desc':
                sortOption = { price: -1 };
                break;
            case 'name':
                sortOption = { name: 1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);

        // Get categories for filter
        const categories = await Product.distinct('category');

        res.render('shop', {
            title: 'Shop - BeShop',
            currentPage: 'shop',
            products,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalProducts,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
                limit: limitNum
            },
            filters: {
                category: category || 'all',
                gender: gender || 'all',
                minPrice: minPrice || '',
                maxPrice: maxPrice || '',
                sort
            },
            categories
        });
    } catch (error) {
        console.error('Error loading shop page:', error);
        res.render('shop', {
            title: 'Shop - BeShop',
            currentPage: 'shop',
            products: [],
            pagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
            filters: { category: 'all', gender: 'all', minPrice: '', maxPrice: '', sort: 'newest' },
            categories: []
        });
    }
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
