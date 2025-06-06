"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve cart data from localStorage if any
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  return (
    <header className="bg-white shadow-md py-4 px-6 fixed w-full z-10 top-0 left-0 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-3xl font-bold text-blue-600 hover:opacity-80 transition">
        E-Shop
      </Link>

      <div className="flex items-center space-x-6">
        <input
          type="text"
          placeholder="Search for products"
          className="p-2 border rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="text-gray-700 hover:text-blue-600">
            Register
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-blue-600">
            Cart ({cart.length})
          </Link>
        </div>
      </div>
    </header>
  );
}
