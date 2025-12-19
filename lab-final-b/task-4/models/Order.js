const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String
});

// Order statuses in lifecycle order
const ORDER_STATUSES = ['Placed', 'Processing', 'Delivered'];

const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discountApplied: { type: Boolean, default: false },
    discountCode: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    customerEmail: { type: String, required: true },
    status: {
        type: String,
        enum: ORDER_STATUSES,
        default: 'Placed'
    }
}, { timestamps: true });

// Static method to get next valid status
orderSchema.statics.getNextStatus = function (currentStatus) {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === ORDER_STATUSES.length - 1) {
        return null; // Invalid or already at final status
    }
    return ORDER_STATUSES[currentIndex + 1];
};

// Static method to check if status transition is valid
orderSchema.statics.isValidTransition = function (currentStatus, newStatus) {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
    const newIndex = ORDER_STATUSES.indexOf(newStatus);

    // Can only move to the next status (no skipping)
    return newIndex === currentIndex + 1;
};

// Instance method to advance to next status
orderSchema.methods.advanceStatus = function () {
    const nextStatus = this.constructor.getNextStatus(this.status);
    if (nextStatus) {
        this.status = nextStatus;
        return true;
    }
    return false;
};

// Export statuses for use in routes
orderSchema.statics.ORDER_STATUSES = ORDER_STATUSES;

module.exports = mongoose.model('Order', orderSchema);
