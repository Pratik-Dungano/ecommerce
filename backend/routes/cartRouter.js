import express from "express";
import { addToCart, getUserCart, updateCart } from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

// Route to get the user's cart
cartRouter.post("/get", authUser, getUserCart);

// Route to add an item to the cart
cartRouter.post("/add", authUser, addToCart);

// Route to update the cart
cartRouter.post("/update", authUser, updateCart);

export default cartRouter;
