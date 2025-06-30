'use server';

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// Define a type-safe input structure
interface CreateOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentId?: string;
}

export async function createOrder(data: CreateOrderInput) {
  try {
    await connectDB(); // Ensure DB is connected

    const newOrder = await Order.create({
      userId: data.userId,
      products: data.items,
      amount: data.totalAmount,
      shippingAddressId: data.shippingAddress,
      status: data.paymentId ? "paid" : "pending",
      paymentId: data.paymentId || "",
    });

    return { success: true, orderId: newOrder._id };
  } catch (error) {
    console.error("createOrder error:", error);
    return { success: false, error: "Order creation failed" };
  }
}
