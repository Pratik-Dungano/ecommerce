import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModels.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// Create Stripe Session
const createStripeCheckoutSession = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body;

        if (!userId || !items || !address || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Create line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.productId.name,
                    description: item.productId.description || '',
                    images: [item.productId.image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Create pending order
        const order = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "STRIPE",
            payment: false,
            status: "Pending",
            date: Date.now()
        });
        await order.save();

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/orders?success=true&orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=true`,
            customer_email: address.email,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString()
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'IN'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'inr',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 5 },
                            maximum: { unit: 'business_day', value: 7 },
                        },
                    },
                },
            ],
        });

        res.status(200).json({
            success: true,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating payment session'
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
    createStripeCheckoutSession,
    handleStripeWebhook,
    allOrders,
    userOrders,
    updateStatus
};