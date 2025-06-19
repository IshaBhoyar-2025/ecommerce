import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cartId: String,
  shippingAddressId: String,
  products: Array,
  amount: Number,
  status: { type: String, default: "pending" },
  paymentId: String,
}, { timestamps: true });


export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
