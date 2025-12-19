const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Admin Dashboard - List all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('admin/orders', {
            title: 'Admin - Order Management',
            orders,
            ORDER_STATUSES: Order.ORDER_STATUSES,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        res.render('admin/orders', {
            title: 'Admin - Order Management',
            orders: [],
            ORDER_STATUSES: Order.ORDER_STATUSES,
            error: 'Failed to load orders'
        });
    }
});

// View single order details
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.redirect('/admin?error=Order not found');
        }

        const nextStatus = Order.getNextStatus(order.status);

        res.render('admin/order-detail', {
            title: 'Order Details',
            order,
            nextStatus,
            ORDER_STATUSES: Order.ORDER_STATUSES
        });
    } catch (error) {
        res.redirect('/admin?error=Failed to load order');
    }
});

// Update order status - Step by step only
router.post('/orders/:id/advance-status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.redirect('/admin?error=Order not found');
        }

        const currentStatus = order.status;
        const nextStatus = Order.getNextStatus(currentStatus);

        if (!nextStatus) {
            return res.redirect(`/admin/orders/${order._id}?error=Order is already at final status (${currentStatus})`);
        }

        // Advance to next status
        order.status = nextStatus;
        await order.save();

        res.redirect(`/admin/orders/${order._id}?success=Status updated from ${currentStatus} to ${nextStatus}`);
    } catch (error) {
        res.redirect('/admin?error=Failed to update status');
    }
});

// Attempt to set specific status (will validate no skipping)
router.post('/orders/:id/set-status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.redirect('/admin?error=Order not found');
        }

        const newStatus = req.body.status;
        const currentStatus = order.status;

        // Check if transition is valid (no skipping)
        if (!Order.isValidTransition(currentStatus, newStatus)) {
            return res.redirect(`/admin/orders/${order._id}?error=Cannot skip from ${currentStatus} to ${newStatus}. Must go step-by-step.`);
        }

        order.status = newStatus;
        await order.save();

        res.redirect(`/admin/orders/${order._id}?success=Status updated to ${newStatus}`);
    } catch (error) {
        res.redirect('/admin?error=Failed to update status');
    }
});

module.exports = router;
