import express from 'express';
import {
    placeOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleRazorpayWebhook,
    allOrders,
    userOrders,
    updateStatus,
    cancelOrder,
    requestReturn,
    handleReturn
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
import { validateReturnRequestInput, validateHandleReturnInput } from '../middleware/validationMiddleware.js';
import { validatePlaceOrderInput, validateCreateRazorpayOrderInput, validateVerifyRazorpayPaymentInput } from '../middleware/validationMiddleware.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User routes
orderRouter.post('/place', authUser, validatePlaceOrderInput, placeOrder);
orderRouter.post('/create-razorpay-order', authUser, validateCreateRazorpayOrderInput, createRazorpayOrder);
orderRouter.post('/verify-razorpay-payment', authUser, validateVerifyRazorpayPaymentInput, verifyRazorpayPayment);
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.post('/cancel', authUser, cancelOrder);
orderRouter.post('/request-return', authUser, validateReturnRequestInput, requestReturn);

// Webhook routes (no auth required)
orderRouter.post('/razorpay-webhook', handleRazorpayWebhook);

// Admin return handling
orderRouter.post('/handle-return', adminAuth, validateHandleReturnInput, handleReturn);

export default orderRouter;