'use client';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Get cart items from localStorage
    const localCart: string[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const productCountMap: Record<string, number> = {};
    localCart.forEach((productId) => {
      productCountMap[productId] = (productCountMap[productId] || 0) + 1;
    });

    const cartItems = JSON.parse(JSON.stringify(Object.entries(productCountMap).map(([productId, quantity]) => ({
      productId,
      quantity,
    }))))

    console.log("Cart items to save:", cartItems);

    // 1. Save cart
    const cart = await saveCartItems(cartItems) as CartResponse;
    if (!cart?._id) throw new Error("Cart creation failed");
    localStorage.setItem("cartId", cart._id);

    console.log("Cart saved successfully:", cart);
    console.log("Shipping data to save:", formData);

    // 2. Save shipping
    const savedShipping = await saveShippingAddress(formData) as ShippingAddressResponse;
    if (!savedShipping?._id) throw new Error("Shipping address creation failed");
    localStorage.setItem("shippingAddressId", savedShipping._id);
    console.log("Shipping address saved successfully:", savedShipping);

    // 3. Redirect
    router.push("/checkout");
  } catch (error) {
    console.error("Error saving shipping data:", error);
    alert("Failed to save shipping info. Check console for details.");
  }
};


  return (
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
  );
}
