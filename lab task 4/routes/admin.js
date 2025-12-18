const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Admin Dashboard
router.get('/', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const forHerCount = await Product.countDocuments({ gender: 'for-her' });
        const forHimCount = await Product.countDocuments({ gender: 'for-him' });
        const clothingCount = await Product.countDocuments({ category: 'clothing' });
        const shoesCount = await Product.countDocuments({ category: 'shoes' });
        const accessoriesCount = await Product.countDocuments({ category: 'accessories' });
        const featuredCount = await Product.countDocuments({ featured: true });
        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                totalProducts,
                forHerCount,
                forHimCount,
                clothingCount,
                shoesCount,
                accessoriesCount,
                featuredCount
            },
            recentProducts,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {},
            recentProducts: [],
            error: 'Error loading dashboard'
        });
    }
});

// List All Products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/products', {
            title: 'Manage Products',
            products,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Products list error:', error);
        res.render('admin/products', {
            title: 'Manage Products',
            products: [],
            error: 'Error loading products'
        });
    }
});

// Add Product Form (GET)
router.get('/products/add', (req, res) => {
    res.render('admin/product-add', {
        title: 'Add New Product',
        error: null
    });
});

// Add Product (POST) - CREATE
router.post('/products/add', async (req, res) => {
    try {
        const { name, price, originalPrice, category, gender, image, description, featured } = req.body;

        const product = new Product({
            name,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            category,
            gender,
            image,
            description,
            featured: featured === 'on'
        });

        await product.save();
        res.redirect('/admin/products?success=Product added successfully');
    } catch (error) {
        console.error('Add product error:', error);
        res.render('admin/product-add', {
            title: 'Add New Product',
            error: error.message
        });
    }
});

// Edit Product Form (GET)
router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.redirect('/admin/products?error=Product not found');
        }
        res.render('admin/product-edit', {
            title: 'Edit Product',
            product,
            error: null
        });
    } catch (error) {
        console.error('Edit form error:', error);
        res.redirect('/admin/products?error=Error loading product');
    }
});

// Update Product (POST) - UPDATE
router.post('/products/edit/:id', async (req, res) => {
    try {
        const { name, price, originalPrice, category, gender, image, description, featured, inStock } = req.body;

        const updateData = {
            name,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            category,
            gender,
            image,
            description,
            featured: featured === 'on',
            inStock: inStock === 'on'
        };

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin/products?success=Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        const product = await Product.findById(req.params.id);
        res.render('admin/product-edit', {
            title: 'Edit Product',
            product,
            error: error.message
        });
    }
});

// Delete Product (POST) - DELETE
router.post('/products/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products?success=Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error);
        res.redirect('/admin/products?error=Error deleting product');
    }
});

module.exports = router;
