"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoryType, ProductType } from "../types";
import { FaThumbsDown } from "react-icons/fa";

type Props = {
  products: ProductType[];
  categories: CategoryType[];
};

export function Home({ products, categories }: Props) {
  const [cartCount, setCartCount] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(storedCart.length);
  }, []);

  const addToCart = (product: ProductType) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Avoid duplicates
    const updatedCart = [
      ...cart.filter((item: string) => item !== product._id),
      product._id,
    ];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
  };

  const buyNow = (product: ProductType) => {
    alert(`You are buying: ${product.productTitle}`);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-800">
      {/* Sticky Navbar */}
      <header className="bg-white shadow-md py-4 px-6 fixed w-full z-10 top-0 left-0 flex justify-between items-center">
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
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600">
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-16 mt-20">
        <h2 className="text-4xl font-semibold">Welcome to E-Shop</h2>
        <p className="mt-4 text-lg">Find the best deals on electronics, fashion, and more!</p>
        <a href="#products" className="mt-6 inline-block bg-yellow-500 text-black py-2 px-6 rounded-md text-lg hover:bg-yellow-600 transition">
          Shop Now
        </a>
      </section>

      {/* Layout */}
      <div className="flex px-6 py-8 gap-8 mt-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`categories/${cat.categoryKey}`}
                  className="w-full text-left text-lg py-2 px-4 rounded-md hover:bg-blue-100"
                >
                  {cat.categoryName}
                </Link>
              </li>
            ))}
          </ul>

          {/* Price Filter */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-blue-100 rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">₹{priceRange[0]} - ₹{priceRange[1]}</p>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="products">
          {products.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                <div className="p-4">
                  <Link href={`/items/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800">{product.productTitle}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.productDescription.length > 30
                        ? product.productDescription.slice(0, 30) + "..."
                        : product.productDescription}
                    </p>
                    {product.productImages?.[0]?.thumb && (
                      <img
                        src={`/uploads/${product.productImages?.[0]?.thumb}`}
                        alt={product.productTitle}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                  </Link>
                  <p className="text-xl font-bold text-blue-600">₹{product.price}</p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md text-sm hover:bg-green-600"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md text-sm hover:bg-yellow-600"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
