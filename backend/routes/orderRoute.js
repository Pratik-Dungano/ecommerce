import express from 'express';
import {
    placeOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleRazorpayWebhook,
    allOrders,
    userOrders,
    updateStatus,
    cancelOrder
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/create-razorpay-order', authUser, createRazorpayOrder);
orderRouter.post('/verify-razorpay-payment', authUser, verifyRazorpayPayment);
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.post('/cancel', authUser, cancelOrder);

// Webhook routes (no auth required)
orderRouter.post('/razorpay-webhook', handleRazorpayWebhook);

export default orderRouter;