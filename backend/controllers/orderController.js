import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModels.js";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

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

                await orderModel.findByIdAndUpdate(orderId, {
                    payment: true,
                    status: 'Order Placed',
                    paymentDetails: {
                        paymentId: session.payment_intent,
                        paymentStatus: session.payment_status,
                        paymentMethod: 'STRIPE',
                    }
                });

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

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('items.productId', 'name image price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

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

export {
    placeOrder,
    createRazorpayOrder,
    handleStripeWebhook,
    allOrders,
    userOrders,
    updateStatus
};