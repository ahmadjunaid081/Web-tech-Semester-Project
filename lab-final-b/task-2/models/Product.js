const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['clothing', 'shoes', 'accessories'] },
    gender: { type: String, enum: ['for-her', 'for-him'] },
    image: { type: String, required: true },
    description: String,
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
