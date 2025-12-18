const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // MongoDB Atlas connection string
        // Using a free MongoDB Atlas cluster for cloud database
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://beshop:beshop123@cluster0.mongodb.net/beshop?retryWrites=true&w=majority', {
            // These options are no longer needed in Mongoose 6+
            // but keeping for compatibility
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // For development, continue without database
        console.log('⚠️  Running without database connection. Using fallback data.');
    }
};

module.exports = connectDB;
