import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModels.js";

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user's cart after placing the order
        await cartModel.findOneAndDelete({ userId });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Prepare Razorpay order details
        const razorpayOrder = {
            amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
            currency: "INR",
            receipt: `order_${Date.now()}`,
        };

        // Create order using Razorpay API (assume Razorpay instance is configured)
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpayInstance.orders.create(razorpayOrder);

        if (!order) {
            return res.status(500).json({ success: false, message: "Failed to create Razorpay order." });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const allOrders = async (req, res) => {
    try {
      // Fetch orders and populate product details
      const orders = await orderModel
        .find({})
        .populate('items.productId', 'name image'); // Populate product name and image
  
      res.json({ success: true, orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

const userOrders = async (req, res) => {
    try {
      const { userId } = req.body;
      const orders = await orderModel
        .find({ userId })
        .populate("items.productId", "name image"); // Populate product details
      res.json({ success: true, orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  const updateStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
  
      if (!orderId || !status) {
        return res.status(400).json({
          success: false,
          message: "Order ID and status are required.",
        });
      }
  
      const validStatuses = [
        "Order Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];
  
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value.",
        });
      }
  
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }
  
      res.json({
        success: true,
        message: "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  

export { placeOrder,placeOrderRazorpay, allOrders, userOrders, updateStatus };
