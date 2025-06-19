"use client";

import { updateOrderStatus } from "./actions";

export async function handleOrderStatusUpdate({
  orderId,
  paymentId,
}: {
  orderId: string;
  paymentId: string;
}) {
  try {
    await updateOrderStatus({
      orderId,
      paymentId,
      status: "completed",
    });

    // ✅ Clear cartId so frontend doesn't re-fetch old cart
    localStorage.removeItem("cartId");

    // ✅ Optional: refresh the page or redirect
    window.location.href = "/order/success"; // or homepage
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
}
