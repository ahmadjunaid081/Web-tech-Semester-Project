const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Sample product data matching the original BeShop website
const products = [
    // Products for HER
    {
        name: 'Woo Album #1',
        price: 9.00,
        originalPrice: null,
        category: 'accessories',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product1-800x800.jpg',
        description: 'Beautiful album accessory for her collection.',
        featured: true
    },
    {
        name: 'Woo Logo',
        price: 15.00,
        originalPrice: null,
        category: 'accessories',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product2-800x800.jpg',
        description: 'Stylish logo accessory.',
        featured: true
    },
    {
        name: 'Woo Ninja',
        price: 15.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2015/03/home_store_product3-800x800.jpg',
        description: 'Trendy ninja-themed clothing.',
        featured: true
    },
    {
        name: 'Premium Quality',
        price: 12.00,
        originalPrice: 15.00,
        category: 'clothing',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product4-800x800.jpg',
        description: 'Premium quality clothing on sale.',
        featured: true
    },
    {
        name: 'Flying Ninja',
        price: 12.00,
        originalPrice: 15.00,
        category: 'clothing',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product5-800x800.jpg',
        description: 'Flying ninja design clothing.',
        featured: true
    },
    {
        name: 'Ship Your Idea',
        price: 15.00,
        originalPrice: null,
        category: 'accessories',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product6-800x800.jpg',
        description: 'Creative accessory for expressing ideas.',
        featured: true
    },
    {
        name: 'Woo Logo Deluxe',
        price: 35.00,
        originalPrice: null,
        category: 'accessories',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product7-800x800.jpg',
        description: 'Deluxe version of the Woo Logo.',
        featured: true
    },
    {
        name: 'Ninja Silhouette',
        price: 35.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product8-800x800.jpg',
        description: 'Elegant ninja silhouette design.',
        featured: true
    },
    // Additional for-her products
    {
        name: 'Summer Dress',
        price: 45.00,
        originalPrice: 55.00,
        category: 'clothing',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product1-800x800.jpg',
        description: 'Beautiful summer dress for any occasion.',
        featured: false
    },
    {
        name: 'Leather Handbag',
        price: 89.00,
        originalPrice: null,
        category: 'accessories',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product2-800x800.jpg',
        description: 'Premium leather handbag.',
        featured: false
    },
    {
        name: 'High Heels',
        price: 65.00,
        originalPrice: 75.00,
        category: 'shoes',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2015/04/home_shop_slider_pic.png',
        description: 'Elegant high heels for special occasions.',
        featured: false
    },
    {
        name: 'Ballet Flats',
        price: 40.00,
        originalPrice: null,
        category: 'shoes',
        gender: 'for-her',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product4-800x800.jpg',
        description: 'Comfortable ballet flats.',
        featured: false
    },

    // Products for HIM
    {
        name: 'Woo Logo Shirt',
        price: 18.00,
        originalPrice: 20.00,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product18-800x800.jpg',
        description: 'Classic Woo Logo shirt on sale.',
        featured: true
    },
    {
        name: 'Premium Quality Shirt',
        price: 20.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product17-800x800.jpg',
        description: 'Premium quality mens shirt.',
        featured: true
    },
    {
        name: 'Ship Your Idea Jacket',
        price: 20.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product16-800x800.jpg',
        description: 'Stylish jacket with creative design.',
        featured: true
    },
    {
        name: 'Ninja Silhouette Shirt',
        price: 20.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product15-800x800.jpg',
        description: 'Cool ninja silhouette print shirt.',
        featured: true
    },
    {
        name: 'Woo Ninja Tee',
        price: 20.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product14-800x800.jpg',
        description: 'Casual Woo Ninja t-shirt.',
        featured: true
    },
    {
        name: 'Happy Ninja',
        price: 18.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product13-800x800.jpg',
        description: 'Fun happy ninja design shirt.',
        featured: true
    },
    {
        name: 'Patient Ninja',
        price: 35.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product10-800x800.jpg',
        description: 'Patient ninja themed premium shirt.',
        featured: true
    },
    {
        name: 'Happy Ninja Premium',
        price: 35.00,
        originalPrice: null,
        category: 'clothing',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product9-800x800.jpg',
        description: 'Premium happy ninja design.',
        featured: true
    },
    // Additional for-him products
    {
        name: 'Leather Belt',
        price: 25.00,
        originalPrice: null,
        category: 'accessories',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product10-800x800.jpg',
        description: 'Classic leather belt.',
        featured: false
    },
    {
        name: 'Sports Watch',
        price: 95.00,
        originalPrice: 120.00,
        category: 'accessories',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product9-800x800.jpg',
        description: 'Durable sports watch.',
        featured: false
    },
    {
        name: 'Running Shoes',
        price: 75.00,
        originalPrice: null,
        category: 'shoes',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product14-800x800.jpg',
        description: 'Comfortable running shoes.',
        featured: false
    },
    {
        name: 'Business Loafers',
        price: 85.00,
        originalPrice: 100.00,
        category: 'shoes',
        gender: 'for-him',
        image: 'https://themes.muffingroup.com/be/shop/wp-content/uploads/2013/06/home_store_product15-800x800.jpg',
        description: 'Elegant business loafers.',
        featured: false
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beshop';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert new products
        const insertedProducts = await Product.insertMany(products);
        console.log(`✅ Inserted ${insertedProducts.length} products`);

        // Display summary
        const forHerCount = insertedProducts.filter(p => p.gender === 'for-her').length;
        const forHimCount = insertedProducts.filter(p => p.gender === 'for-him').length;
        console.log(`   - For Her: ${forHerCount} products`);
        console.log(`   - For Him: ${forHimCount} products`);

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
