import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to the user
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }, // Reference to product
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Price at the time of order
    },
  ],
  amount: { type: Number, required: true },
  address: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed',
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'admin'],
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Stripe', 'Razorpay'],
    required: true,
  },
  payment: { type: Boolean, required: true, default: false },
  paymentDetails: {
    paymentId: { type: String }, // Payment ID for Stripe/Razorpay
    paymentDate: { type: Date },
  },
  date: { type: Date, default: Date.now },
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
