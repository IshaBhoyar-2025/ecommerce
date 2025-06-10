'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { saveShippingAddress } from "./actions";
import { saveCartItems } from "../shipping/actions";

export default function ShippingPage({ shipping, currentUser }: any) {
  const [formData, setFormData] = useState({
    fullName: shipping?.fullName || "",
    phone: shipping?.phone || "",
    address: shipping?.address || "",
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Get cart from localStorage
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const cartItems = localCart.map((item: any) => ({
      productId: item?._id?.toString(),
      quantity: item.quantity || 1,
    }));

    // Save cart items to DB
    await saveCartItems(cartItems);

    // Save shipping address
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);

    await saveShippingAddress(data);

    router.push("/checkout");
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4 mt-12">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </main>
  );
}
