"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderFields } from "@/app/admin/orders/actions"; // Adjust the import path as necessary

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
}

interface Order {
  paymentId?: string;
  shippingAddressId?: ShippingAddress;
}

interface Props {
  id: string;
  order: Order | null;
}

export default function EditOrderForm({ id, order }: Props) {
  const [paymentId, setPaymentId] = useState(order?.paymentId || "");
  const [fullName, setFullName] = useState(order?.shippingAddressId?.fullName || "");
  const [phone, setPhone] = useState(order?.shippingAddressId?.phone || "");
  const [address, setAddress] = useState(order?.shippingAddressId?.address || "");
  const [message, setMessage] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("paymentId", paymentId);
    formData.set("fullName", fullName);
    formData.set("phone", phone);
    formData.set("address", address);

    const result = await updateOrderFields(id, formData);
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
          <label className="block font-semibold mb-1">Shipping Address</label>
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
