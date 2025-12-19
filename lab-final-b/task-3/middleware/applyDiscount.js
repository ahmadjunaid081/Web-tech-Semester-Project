/**
 * applyDiscount Middleware
 * Applies 10% discount if coupon code SAVE10 is provided
 * Works with both query params (?coupon=SAVE10) and form input
 */

const applyDiscount = (req, res, next) => {
    // Safely get coupon from query params or request body
    const couponCode = (req.query && req.query.coupon) || (req.body && req.body.coupon) || '';

    // Get cart and calculate subtotal
    const cart = (req.session && req.session.cart) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Initialize discount info with defaults
    req.discount = {
        applied: false,
        code: null,
        percentage: 0,
        amount: 0,
        subtotal: subtotal,
        total: subtotal
    };

    // Check if valid coupon code SAVE10
    if (couponCode && couponCode.toUpperCase() === 'SAVE10') {
        const discountAmount = subtotal * 0.10;  // 10% discount

        req.discount = {
            applied: true,
            code: 'SAVE10',
            percentage: 10,
            amount: discountAmount,
            subtotal: subtotal,
            total: subtotal - discountAmount
        };
    }

    // Make discount available in views
    res.locals.discount = req.discount;

    next();
};

module.exports = applyDiscount;
