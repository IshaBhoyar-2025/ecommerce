// File: app/admin/orders/OrderInlineEditor.tsx
"use client";

import { useTransition } from "react";
import { updateOrder } from "./actions";

type Props = {
  id: string;
  initialStatus: string;
  initialPaymentId: string;
};

export default function OrderInlineEditor({ id, initialStatus, initialPaymentId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: "status" | "paymentId", value: string) => {
    const formData = new FormData();
    formData.set(field, value);

    startTransition(() => {
      updateOrder(id, formData);
    });
  };

  return (
    <div className="space-y-2">
      <select
        defaultValue={initialStatus}
        onChange={(e) => handleChange("status", e.target.value)}
        disabled={isPending}
        className="border px-2 py-1 rounded text-sm w-full"
      >
        {["pending", "paid", "shipped", "delivered", "returned"].map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="text"
        defaultValue={initialPaymentId}
        onBlur={(e) => handleChange("paymentId", e.target.value)}
        placeholder="Enter Payment ID"
        className="border px-2 py-1 rounded text-sm w-full"
      />

      {isPending && <p className="text-xs text-gray-500">Saving...</p>}
    </div>
  );
}
