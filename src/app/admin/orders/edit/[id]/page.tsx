// src/app/admin/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderById, updateOrderFields } from "../../actions";

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const [paymentId, setPaymentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

useEffect(() => {
  async function fetchOrder() {
    const order = await getOrderById(params.id);
    if (order) {
      setPaymentId(order.paymentId || "");
      setFullName(order.shippingAddressId?.fullName || "");
      setPhone(order.shippingAddressId?.phone || "");
      setAddress(order.shippingAddressId?.address || "");
    }
  }
  fetchOrder();
}, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("paymentId", paymentId);
    formData.set("fullName", fullName);
    formData.set("phone", phone);
    formData.set("address", address);

    const result = await updateOrderFields(params.id, formData);
    if (result?.error) {
      setMessage(result.error);
    } else {
      router.push("/admin/orders");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Order</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Payment ID</label>
          <input
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Shipping Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1"> Shipping Address</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {message && <p className="text-red-500 text-sm">{message}</p>}

        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
