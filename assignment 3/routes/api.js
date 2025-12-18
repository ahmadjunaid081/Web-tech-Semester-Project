const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * GET /api/products
 * Fetch products with pagination and filtering
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 8)
 * - category: Filter by category (clothing, shoes, accessories)
 * - gender: Filter by gender (for-her, for-him)
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - sort: Sort order (price_asc, price_desc, newest, name)
 * - featured: Filter featured products only (true/false)
 */
router.get('/products', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 8,
            category,
            gender,
            minPrice,
            maxPrice,
            sort = 'newest',
            featured
        } = req.query;

        // Build filter object
        const filter = {};

        if (category) {
            filter.category = category.toLowerCase();
        }

        if (gender) {
            filter.gender = gender.toLowerCase();
        }

        if (featured === 'true') {
            filter.featured = true;
        }

        // Price range filter
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
            case 'newest':
            default:
                sortOption = { createdAt: -1 };
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination info
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.json({
            success: true,
            data: products,
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
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
                sort
            }
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

/**
 * GET /api/categories
 * Get all unique categories
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
});

/**
 * GET /api/products/stats
 * Get product statistics for filters
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    totalProducts: { $sum: 1 }
                }
            }
        ]);

        const categoryCount = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const genderCount = await Product.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                priceRange: stats[0] || { minPrice: 0, maxPrice: 100 },
                categories: categoryCount,
                genders: genderCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats'
        });
    }
});

module.exports = router;
