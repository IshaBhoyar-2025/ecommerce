// updateOrderStatus.ts
"use server";

import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";

export async function updateOrderStatus(orderId: string, status: string) {
  await connectDB();
  await Order.findByIdAndUpdate(orderId, { status });
}
