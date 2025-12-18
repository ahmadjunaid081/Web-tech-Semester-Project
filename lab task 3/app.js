const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import and use routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// 404 Error Handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🛍️  BeShop server is running at http://localhost:${PORT}`);
});

module.exports = app;
