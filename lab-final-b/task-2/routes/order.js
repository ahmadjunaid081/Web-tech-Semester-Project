const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const applyDiscount = require('../middleware/applyDiscount');

// Order Preview - GET /order/preview
// Uses applyDiscount middleware to apply SAVE10 coupon
router.get('/preview', applyDiscount, (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    // Get coupon from query for display
    const coupon = req.query.coupon || '';

    res.render('order-preview', {
        title: 'Order Preview',
        cart,
        coupon,
        discount: req.discount  // From middleware
    });
});

// Apply Coupon - POST /order/apply-coupon
router.post('/apply-coupon', (req, res) => {
    const coupon = req.body.coupon || '';
    res.redirect(`/order/preview?coupon=${coupon}`);
});

// Confirm Order - POST /order/confirm
// Uses applyDiscount middleware before saving
router.post('/confirm', applyDiscount, async (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    try {
        // Create order with discounted total (from middleware)
        const order = new Order({
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalAmount: req.discount.total,  // Discounted total
            subtotal: req.discount.subtotal,
            discountApplied: req.discount.applied,
            discountCode: req.discount.code,
            discountAmount: req.discount.amount,
            status: 'Placed'
        });

        await order.save();

        // Clear cart session
        req.session.cart = [];

        res.redirect(`/order/success/${order._id}`);

    } catch (error) {
        console.error('Order error:', error);
        res.redirect('/order/preview');
    }
});

// Order Success - GET /order/success/:id
router.get('/success/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.redirect('/');

        res.render('order-success', { title: 'Order Placed!', order });
    } catch (error) {
        res.redirect('/');
    }
});

module.exports = router;
