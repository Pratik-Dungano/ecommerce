import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

export const addReview = async (req, res) => {
    try {
        const { productId, orderId, rating, text, images, userId } = req.body;  // userId comes from auth middleware

        // Check if user has already reviewed this product (regardless of order)
        const product = await productModel.findById(productId);
        const existingReview = product.reviews.find(
            review => review.userId.toString() === userId.toString()
        );

        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product" });
        }

        // Check if order exists and is delivered
        const order = await orderModel.findById(orderId);
        if (!order || order.status !== 'Delivered') {
            return res.status(400).json({ success: false, message: "You can only review delivered products" });
        }

        // Add the review
        const review = {
            userId,
            orderId,
            rating,
            text,
            images: images || [],
            date: new Date()
        };

        product.reviews.push(review);
        
        // Update average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.averageRating = totalRating / product.reviews.length;
        product.totalReviews = product.reviews.length;

        await product.save();
        res.status(200).json({ success: true, message: "Review added successfully", review });
    } catch (error) {
        console.error("Error in addReview:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId)
            .populate('reviews.userId', 'name') // Populate user details
            .select('reviews averageRating totalReviews');
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews,
            averageRating: product.averageRating,
            totalReviews: product.totalReviews
        });
    } catch (error) {
        
        console.error("Error in getProductReviews:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};