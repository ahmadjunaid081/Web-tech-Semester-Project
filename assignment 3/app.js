require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beshop';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('⚠️  Server will continue without database. Some features may not work.');
    }
};

connectDB();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import and use routes
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        currentPage: ''
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🛍️  BeShop server is running at http://localhost:${PORT}`);
    console.log(`📦 Shop page: http://localhost:${PORT}/shop`);
    console.log(`🔌 API endpoint: http://localhost:${PORT}/api/products`);
});

module.exports = app;
