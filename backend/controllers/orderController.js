import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModels.js";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { checkProductStock, decreaseProductQuantity, increaseProductQuantity } from './productController.js';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place Order (COD)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required." 
            });
        }

        // Validate stock availability for all items before placing order
        for (const item of items) {
            const stockCheck = await checkProductStock(item.productId, item.quantity);
            if (!stockCheck.success) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${stockCheck.message}`
                });
            }
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Reduce stock quantity for all items after successful order creation
        for (const item of items) {
            const stockReduction = await decreaseProductQuantity(item.productId, item.quantity);
            if (!stockReduction.success) {
                console.error(`Failed to reduce stock for product ${item.productId}:`, stockReduction.message);
                // Note: In production, you might want to implement a rollback mechanism here
            }
        }

        // Clear user's cart
        await cartModel.findOneAndDelete({ userId });

        res.json({ 
            success: true, 
            message: "Order Placed Successfully",
            order: newOrder 
        });
    } catch (error) {
        console.error("Place Order Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body;

        if (!userId || !items || !address || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Validate stock availability for all items before creating Razorpay order
        for (const item of items) {
            const stockCheck = await checkProductStock(item.productId, item.quantity);
            if (!stockCheck.success) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${stockCheck.message}`
                });
            }
        }

        // Create pending order
        const order = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            status: "Order Placed",
            date: Date.now()
        });
        await order.save();

        // Create Razorpay order
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: order._id.toString(),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            order
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating Razorpay order'
        });
    }
};

// Verify Razorpay Payment and Complete Order
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment verification fields"
            });
        }

        // Verify payment signature
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (signature !== expectedSignature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if order is already processed
        if (order.payment) {
            return res.status(400).json({
                success: false,
                message: "Order already processed"
            });
        }

        // Update order with payment details
        order.payment = true;
        order.paymentDetails = {
            paymentId: paymentId,
            paymentDate: new Date(),
            paymentMethod: 'Razorpay'
        };
        await order.save();

        // Reduce stock quantity for all items after successful payment
        for (const item of order.items) {
            const stockReduction = await decreaseProductQuantity(item.productId, item.quantity);
            if (!stockReduction.success) {
                console.error(`Failed to reduce stock for product ${item.productId}:`, stockReduction.message);
                // Note: In production, you might want to implement a rollback mechanism here
            }
        }

        // Clear user's cart
        await cartModel.findOneAndDelete({ userId: order.userId });

        res.json({
            success: true,
            message: "Payment verified and order completed successfully",
            order
        });
    } catch (error) {
        console.error('Razorpay Payment Verification Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error verifying payment'
        });
    }
};

// Handle Stripe Webhook
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { orderId, userId } = session.metadata;

                const order = await orderModel.findById(orderId);
                if (order) {
                    await orderModel.findByIdAndUpdate(orderId, {
                        payment: true,
                        status: 'Order Placed',
                        paymentDetails: {
                            paymentId: session.payment_intent,
                            paymentStatus: session.payment_status,
                            paymentMethod: 'STRIPE',
                        }
                    });

                    // Reduce stock quantity for all items after successful payment
                    for (const item of order.items) {
                        const stockReduction = await decreaseProductQuantity(item.productId, item.quantity);
                        if (!stockReduction.success) {
                            console.error(`Failed to reduce stock for product ${item.productId}:`, stockReduction.message);
                        }
                    }
                }

                await cartModel.findOneAndDelete({ userId });
                break;
            }

            case 'payment_intent.payment_failed': {
                const session = event.data.object;
                const { orderId } = session.metadata;

                await orderModel.findByIdAndUpdate(orderId, {
                    status: 'Payment Failed',
                    paymentDetails: {
                        paymentId: session.payment_intent,
                        paymentStatus: 'failed',
                        paymentMethod: 'STRIPE',
                    }
                });
                break;
            }
        }

        res.json({ success: true, received: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return res.status(400).json({
            success: false,
            message: `Webhook Error: ${error.message}`
        });
    }
};

// Get All Orders (Admin)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate('userId', 'name email')
            .populate('items.productId', 'name image price')
            .sort({ date: -1 });

        res.json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error("All Orders Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get User Orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const orders = await orderModel
            .find({ userId })
            .populate('items.productId', 'name image price')
            .sort({ date: -1 });

        res.json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error("User Orders Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Order Status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required"
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Prevent changes to user-cancelled orders
        if (order.cancelledBy === "user") {
            return res.status(400).json({
                success: false,
                message: "Cannot modify an order cancelled by user"
            });
        }

        const validStatuses = [
            "Order Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        order.status = status;
        if (status === "Cancelled") {
            order.cancelledBy = "admin";
            
            // Restore stock quantity for all items when order is cancelled by admin
            for (const item of order.items) {
                const stockRestoration = await increaseProductQuantity(item.productId, item.quantity);
                if (!stockRestoration.success) {
                    console.error(`Failed to restore stock for product ${item.productId}:`, stockRestoration.message);
                }
            }
        }
        
        await order.save();

        res.json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const { orderId, userId } = req.body;

        if (!orderId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Order ID and User ID are required"
            });
        }

        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if order belongs to user
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to cancel this order"
            });
        }

        // Check if order can be cancelled (not delivered)
        if (order.status === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel delivered order"
            });
        }

        // Update order status to cancelled and mark as cancelled by user
        order.status = "Cancelled";
        order.cancelledBy = "user";
        await order.save();

        // Restore stock quantity for all items after order cancellation
        for (const item of order.items) {
            const stockRestoration = await increaseProductQuantity(item.productId, item.quantity);
            if (!stockRestoration.success) {
                console.error(`Failed to restore stock for product ${item.productId}:`, stockRestoration.message);
            }
        }

        res.json({
            success: true,
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    placeOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleStripeWebhook,
    allOrders,
    userOrders,
    updateStatus,
    cancelOrder
};