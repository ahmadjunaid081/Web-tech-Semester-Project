const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        default: null
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['clothing', 'shoes', 'accessories'],
        lowercase: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['for-her', 'for-him'],
        lowercase: true
    },
    image: {
        type: String,
        required: [true, 'Image URL is required']
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
    timestamps: true
});

// Virtual for checking if product is on sale
productSchema.virtual('isOnSale').get(function () {
    return this.originalPrice && this.originalPrice > this.price;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
