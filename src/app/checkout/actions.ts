"use server";

import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import ShippingAddress from "@/models/ShippingAddress";
import { getCurrentUser } from "@/app/actions";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(cartId: string, shippingAddressId: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("User not logged in");

  // ✅ Validate IDs to avoid BSONError
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw new Error("Invalid cartId format");
  }
  if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
    throw new Error("Invalid shippingAddressId format");
  }

  const cart = await Cart.findById(cartId).populate("items.productId");
  if (!cart) throw new Error("Cart not found");

  const shippingAddress = await ShippingAddress.findById(shippingAddressId);
  if (!shippingAddress) throw new Error("Shipping address not found");

  type Product = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  };

 const products: Product[] = cart.items.map((item: any) => ({
  productId: item.productId._id.toString(),
  name: item.productId.productTitle,
  price: item.productId.price,
  quantity: item.quantity,
}));

  const productTotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = 3;
  const totalAmount = productTotal + platformFee;

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // Razorpay works in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  });

  // Save order to MongoDB

// ✅ Save products to the order
const newOrder = await Order.create({
  cartId,
  shippingAddressId,
  userId: user._id,
  products, // <-- this must not be empty
  amount: totalAmount,
  status: "pending",
});

  return {
    order: razorpayOrder,
    dbOrderId: newOrder._id.toString(),
  };
}

export async function updateOrderStatus({
  orderId,
  paymentId,
  status,
}: {
  orderId: string;
  paymentId: string;
  status: string;
}) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid orderId format");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentId,
      status,
    },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found or update failed");
  }

  // ✅ Delete the cart after successful payment
  if (status === "completed" && updatedOrder.cartId) {
    await Cart.findByIdAndDelete(updatedOrder.cartId);
  }

  return { success: true };
}

