import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cartId: String,
    shippingAddressId: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingAddress" },
 products: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: Number,
    quantity: Number,
  },
],

    amount: Number,
    status: { type: String, default: "pending" },
    paymentId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
