import express from 'express';
import {
    placeOrder,
    createStripeCheckoutSession,
    handleStripeWebhook,
    allOrders,
    userOrders,
    updateStatus,
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Stripe webhook (needs raw body)
orderRouter.post(
    '/stripe-webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/create-stripe-session', authUser, createStripeCheckoutSession);
orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;