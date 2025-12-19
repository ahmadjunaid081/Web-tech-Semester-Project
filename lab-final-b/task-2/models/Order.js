const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String
});

const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discountApplied: { type: Boolean, default: false },
    discountCode: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Placed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
