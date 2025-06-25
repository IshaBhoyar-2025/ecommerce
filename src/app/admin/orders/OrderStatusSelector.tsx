// src/app/admin/orders/OrderStatusSelector.tsx
"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "./actions";

export default function OrderStatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(() => {
          updateOrderStatus(orderId, newStatus);
        });
      }}
      className="border p-1 rounded text-sm"
      disabled={isPending}
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="returned">Returned</option>
    </select>
  );
}
