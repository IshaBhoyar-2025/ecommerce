// src/app/checkout/actions.ts
"use server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUser } from "@/app/actions";
import Cart from "@/models/Cart";
import ShippingAddress from "@/models/ShippingAddress";
import { ObjectId } from "mongodb";

export async function createOrder(cartId: string, shippingAddressId: string) {
  await connectDB();
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const cart = await Cart.findOne({ _id: new ObjectId(cartId), userId: user._id });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty or not found");
  }

  const shippingAddress = await ShippingAddress.findOne({
    _id: new ObjectId(shippingAddressId),
    userId: user._id,
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found");
  }

  const newOrder = new Order({
    cartId: cartId,
    shippingAddressId: shippingAddressId,
    userId: user._id,
    status: "pending",
    createdAt: new Date(),
  });

  await newOrder.save();

  return { success: true, orderId: newOrder._id.toString() };
}
export { getCurrentUser };

