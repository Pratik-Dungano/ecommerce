import express from 'express';
import {
  placeOrder,
  placeOrderRazorpay,
  
  allOrders,
  userOrders,
  updateStatus,
} from '../controllers/orderController.js';

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders); // Fetch all orders (admin only)
orderRouter.post('/status', adminAuth, updateStatus); // Update order status (admin only)

// User routes
orderRouter.post('/place', authUser, placeOrder); // Place an order (Cash on Delivery)
// Place an order with Stripe
orderRouter.post('/razorpay', authUser, placeOrderRazorpay); // Place an order with Razorpay
orderRouter.post('/userorders', authUser, userOrders); // Fetch user's orders

export default orderRouter;
