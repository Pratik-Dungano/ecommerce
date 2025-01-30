import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        itemId: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const wishListModel = mongoose.models.wishList || mongoose.model("wishList", wishListSchema);

export default wishListModel;
