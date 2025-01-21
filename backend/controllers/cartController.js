import userModel from "../models/userModel.js";
import cartModel from "../models/cartModels.js";
import mongoose from "mongoose";

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Validate request fields
    if (!userId || !itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    // Ensure user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if cart exists, or create a new one
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    // Check if item exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.itemId === itemId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Increment quantity if item exists
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.items.push({ itemId, size, quantity: 1 });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Update Cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    // Validate request fields
    if (!userId || !itemId || !size || quantity == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    // Find cart by userId
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Check if item exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.itemId === itemId && item.size === size
    );

    if (existingItemIndex > -1) {
      if (quantity > 0) {
        // Update quantity if greater than 0
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0
        cart.items.splice(existingItemIndex, 1);
      }
    } else {
      return res.status(400).json({ success: false, message: "Item not found in cart" });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in updateCart:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Get User Cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate request fields
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    // Find cart and populate user details
    const cart = await cartModel
      .findOne({ userId })
      .populate("userId", "name email");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, message: "Cart retrieved successfully", cart });
  } catch (error) {
    console.error("Error in getUserCart:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
