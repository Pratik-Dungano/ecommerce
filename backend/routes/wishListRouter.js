import express from "express";
import { addToWishList, getUserWishList, updateWishList } from "../controllers/wishListController.js";
import authUser from "../middleware/auth.js";

const wishListRouter = express.Router();

// Route to get the user's cart
wishListRouter.post("/get", authUser, getUserWishList);

// Route to add an item to the cart
wishListRouter.post("/add", authUser, addToWishList);

// Route to update the cart
wishListRouter.post("/update", authUser, updateWishList);

export default wishListRouter;
