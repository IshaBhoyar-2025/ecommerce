'use server';

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function createOrder(data: any) {
  try {
    await connectDB(); // Ensure DB is connected

    const newOrder = await Order.create({
      userId: data.userId,
      items: data.items,
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      status: data.paymentId ? "paid" : "pending",
      paymentId: data.paymentId,
    });

    return { success: true, orderId: newOrder._id };
  } catch (error) {
    console.error("createOrder error:", error);
    return { success: false, error: "Order creation failed" };
  }
}
