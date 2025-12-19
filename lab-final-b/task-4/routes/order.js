const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const applyDiscount = require('../middleware/applyDiscount');

// Order Preview
router.get('/preview', applyDiscount, (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/cart');
    res.render('order-preview', {
        title: 'Order Preview',
        cart,
        coupon: req.query.coupon || '',
        discount: req.discount
    });
});

// Apply Coupon
router.post('/apply-coupon', (req, res) => {
    res.redirect(`/order/preview?coupon=${req.body.coupon || ''}`);
});

// Confirm Order
router.post('/confirm', applyDiscount, async (req, res) => {
    const cart = req.session.cart || [];
    const email = req.body.email || '';
    if (cart.length === 0) return res.redirect('/cart');
    if (!email) return res.redirect('/order/preview?error=Email required');

    try {
        const order = new Order({
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: req.discount.subtotal,
            totalAmount: req.discount.total,
            discountApplied: req.discount.applied,
            discountCode: req.discount.code,
            discountAmount: req.discount.amount,
            customerEmail: email.toLowerCase(),
            status: 'Placed'  // Initial status
        });
        await order.save();
        req.session.cart = [];
        res.redirect(`/order/success/${order._id}`);
    } catch (error) {
        res.redirect('/order/preview');
    }
});

// Order Success
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
