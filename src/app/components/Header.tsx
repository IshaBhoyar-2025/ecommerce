"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../actions"; // Adjust paths as necessary
import { FaShoppingCart, FaUserCircle, FaSearch } from "react-icons/fa";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    }
    checkUser();

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  return (
    <header className="bg-white border-b shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-wide hover:opacity-90 transition">
          Shoporia
        </Link>

        {/* Search */}
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon */}
          <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-blue-600 transition">
            <FaShoppingCart size={20} />
            <span className="ml-1 text-sm font-medium">Cart ({cart.length})</span>
          </Link>

          {/* User Actions */}
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-blue-600 transition">
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition focus:outline-none"
              >
                <FaUserCircle size={20} className="mr-1" />
                <span className="text-sm font-medium">Account</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-md py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <form action={logoutUser}>
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
