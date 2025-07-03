"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveShippingAddress, saveCartItems } from "../actions";

// Response types
interface ShippingAddressResponse {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
}

interface CartResponse {
  _id: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

interface ShippingFormProps {
  shipping?: {
    fullName?: string;
    phone?: string;
    address?: string;
  };
}

export default function ShippingForm({ shipping }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    fullName: shipping?.fullName || "",
    phone: shipping?.phone || "",
    address: shipping?.address || "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const localCart: string[] = JSON.parse(localStorage.getItem("cart") || "[]");

      const productCountMap: Record<string, number> = {};
      localCart.forEach((productId) => {
        productCountMap[productId] = (productCountMap[productId] || 0) + 1;
      });

      const cartItems = Object.entries(productCountMap).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

      const cart = (await saveCartItems(cartItems)) as CartResponse;
      if (!cart?._id) throw new Error("Cart creation failed");
      localStorage.setItem("cartId", cart._id);

      const savedShipping = (await saveShippingAddress(formData)) as ShippingAddressResponse;
      if (!savedShipping?._id) throw new Error("Shipping address creation failed");
      localStorage.setItem("shippingAddressId", savedShipping._id);

      router.push("/checkout");
    } catch (error) {
      console.error("Error saving shipping data:", error);
      alert("Failed to save shipping info. Check console for details.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-12">
      {/* Main heading */}
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        🚚 Shipping Address
      </h1>

      {/* Subheading */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-lg shadow border"
      >
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
