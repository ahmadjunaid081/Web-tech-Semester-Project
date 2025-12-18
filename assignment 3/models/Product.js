const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0,
        default: null  // Original price for sale items
    },
    category: {
        type: String,
        required: true,
        enum: ['clothing', 'shoes', 'accessories'],
        lowercase: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['for-her', 'for-him'],
        lowercase: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    inStock: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

// Create index for efficient filtering
productSchema.index({ category: 1, gender: 1, price: 1 });

// Virtual for checking if product is on sale
productSchema.virtual('isOnSale').get(function () {
    return this.originalPrice && this.originalPrice > this.price;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
