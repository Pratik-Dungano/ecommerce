import userModel from "../models/userModel.js";
import wishListModel from "../models/wishListModels.js";
import mongoose from "mongoose";

// Add to WishList
const addToWishList = async (req, res) => {
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

    // Check if wishList exists, or create a new one
    let wishList = await wishListModel.findOne({ userId });
    if (!wishList) {
      wishList = new wishListModel({ userId, items: [] });
    }

    
    // Check if item exists in wishList
    const existingItemIndex = wishList.items.findIndex(
        (item) => item.itemId === itemId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Increment quantity if item exists
        wishList.items[existingItemIndex].quantity += 1;
    } else {
      // Add new item to wishList
      wishList.items.push({ itemId, size, quantity: 1 });
    }

    // Save the wishList
    await wishList.save();

     res.status(200).json({ success: true, message: "Item added to wishList", wishList });
  } catch (error) {
    console.error("Error in addToWishList:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Update WishList
const updateWishList = async (req, res) => {
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

    // Find wishList by userId
    const wishList = await wishListModel.findOne({ userId });
    if (!wishList) {
      return res.status(404).json({ success: false, message: "WishList not found" });
    }

    // Check if item exists in wishList
    const existingItemIndex = wishList.items.findIndex(
      (item) => item.itemId === itemId && item.size === size
    );

    if (existingItemIndex > -1) {
      if (quantity > 0) {
        // Update quantity if greater than 0
        wishList.items[existingItemIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0
        wishList.items.splice(existingItemIndex, 1);
      }
    } else {
      return res.status(400).json({ success: false, message: "Item not found in wishList" });
    }

    
    // Save the updated wishList
    await wishList.save();

    res.status(200).json({ success: true, message: "WishList updated successfully", wishList });
  } catch (error) {
    console.error("Error in updateWishList:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Get User WishList
const getUserWishList = async (req, res) => {
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

    // Find wishList and populate user details
    const wishList = await wishListModel
      .findOne({ userId })
      .populate("userId", "name email");

    if (!wishList) {
      return res.status(404).json({ success: false, message: "WishList not found" });
    }

        res.status(200).json({ success: true, message: "WishList retrieved successfully", wishList });
  } catch (error) {
    console.error("Error in getUserWishList:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export { addToWishList, updateWishList, getUserWishList };
