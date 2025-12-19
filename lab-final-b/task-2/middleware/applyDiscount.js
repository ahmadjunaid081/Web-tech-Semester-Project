/**
 * applyDiscount Middleware
 * Applies 10% discount if coupon code SAVE10 is provided
 * Works with both query params (?coupon=SAVE10) and form input
 */

const applyDiscount = (req, res, next) => {
    // Get coupon from query params or request body
    const couponCode = req.query.coupon || req.body.coupon || '';

    // Initialize discount info
    req.discount = {
        applied: false,
        code: null,
        percentage: 0,
        amount: 0
    };

    // Check if valid coupon code
    if (couponCode.toUpperCase() === 'SAVE10') {
        // Calculate cart total
        const cart = req.session.cart || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Apply 10% discount
        const discountAmount = subtotal * 0.10;

        req.discount = {
            applied: true,
            code: 'SAVE10',
            percentage: 10,
            amount: discountAmount,
            subtotal: subtotal,
            total: subtotal - discountAmount
        };
    } else {
        // No discount - calculate normal total
        const cart = req.session.cart || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        req.discount.subtotal = subtotal;
        req.discount.total = subtotal;
    }

    // Make discount available in views
    res.locals.discount = req.discount;

    next();
};

module.exports = applyDiscount;
