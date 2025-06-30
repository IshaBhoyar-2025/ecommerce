"use server";

import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import ShippingAddress from "@/models/ShippingAddress";
import { getCurrentUser } from "@/app/actions";
import mongoose from "mongoose";

// Setup Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Product type to be saved in the order
type Product = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

// Type for a single cart item after population
interface PopulatedCartItem {
  productId: {
    _id: mongoose.Types.ObjectId;
    productTitle: string;
    price: number;
  };
  quantity: number;
}

export async function createOrder(cartId: string, shippingAddressId: string) {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) throw new Error("User not logged in");

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

  const products: Product[] = (cart.items as PopulatedCartItem[]).map((item) => ({
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
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  });

  // Save order in DB
  const newOrder = await Order.create({
    cartId,
    shippingAddressId,
    userId: user._id,
    products,
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

  // Delete cart if payment is successful
  if (status === "completed" && updatedOrder.cartId) {
    await Cart.findByIdAndDelete(updatedOrder.cartId);
  }

  return { success: true };
}
