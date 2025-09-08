export const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        });
    }

    if (!email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    next();
};

export const validateRegisterInput = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    if (!email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    next();
};

export const validatePlaceOrderInput = (req, res, next) => {
    const { userId, items, amount, address } = req.body;
    if (!userId || !Array.isArray(items) || items.length === 0 || !amount || !address) {
        return res.status(400).json({ success: false, message: 'Invalid order payload' });
    }
    for (const item of items) {
        if (!item.productId || !item.size || typeof item.quantity !== 'number') {
            return res.status(400).json({ success: false, message: 'Invalid order item' });
        }
    }
    next();
};

export const validateCreateRazorpayOrderInput = (req, res, next) => {
    const { userId, items, address, amount } = req.body;
    if (!userId || !Array.isArray(items) || items.length === 0 || !address || !amount) {
        return res.status(400).json({ success: false, message: 'Invalid Razorpay order payload' });
    }
    next();
};

export const validateVerifyRazorpayPaymentInput = (req, res, next) => {
    const { orderId, razorpayOrderId, razorpay_order_id, paymentId, signature } = req.body;
    if (!orderId || !(razorpayOrderId || razorpay_order_id) || !paymentId || !signature) {
        return res.status(400).json({ success: false, message: 'Missing required payment verification fields' });
    }
    next();
};

export const validateAddReviewInput = (req, res, next) => {
    const { productId, rating, text } = req.body;
    if (!productId || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid review payload' });
    }
    if (text && typeof text !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid review text' });
    }
    next();
};

export const validateReturnRequestInput = (req, res, next) => {
    const { orderId, type, reason, photos, codRefundDetails } = req.body;
    if (!orderId || !['return','replacement'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid return request payload' });
    }
    if (reason && typeof reason !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid reason' });
    }
    if (photos && !Array.isArray(photos)) {
        return res.status(400).json({ success: false, message: 'Invalid photos array' });
    }
    // If COD refund details provided, validate shape (UPI or basic bank fields)
    if (codRefundDetails) {
        const upi = codRefundDetails.upiId && typeof codRefundDetails.upiId === 'string';
        const bank = codRefundDetails.accountNumber && codRefundDetails.ifsc && codRefundDetails.accountName;
        if (!upi && !bank) {
            return res.status(400).json({ success: false, message: 'Invalid COD refund details' });
        }
    }
    next();
};

export const validateHandleReturnInput = (req, res, next) => {
    const { orderId, action, adminNote } = req.body;
    const allowed = ['approve','pickup_scheduled','picked','received','refunded','reject','process'];
    if (!orderId || !allowed.includes(action)) {
        return res.status(400).json({ success: false, message: 'Invalid handle return payload' });
    }
    if (adminNote && typeof adminNote !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid admin note' });
    }
    next();
};