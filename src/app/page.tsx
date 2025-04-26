"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Sample categories
const categories = ["All", "Electronics", "Fashion", "Home", "Books", "Accessories"];

// Sample products with price, ratings, and description
const products = [
  {
    id: 1,
    title: "Stylish Headphones",
    description: "High-quality sound with a sleek design.",
    price: 3999,
    category: "Electronics",
    rating: 4.5,
    image: "/product1.jpg",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Track fitness and stay connected.",
    price: 5499,
    category: "Electronics",
    rating: 4.7,
    image: "/product2.jpg",
  },
  {
    id: 3,
    title: "Modern Backpack",
    description: "Perfect for work and travel.",
    price: 2299,
    category: "Accessories",
    rating: 4.2,
    image: "/product3.jpg",
  },
  {
    id: 4,
    title: "Vintage Leather Jacket",
    description: "A timeless classic for your wardrobe.",
    price: 7499,
    category: "Fashion",
    rating: 4.8,
    image: "/product4.jpg",
  },
  {
    id: 5,
    title: "Portable Bluetooth Speaker",
    description: "Take your music everywhere.",
    price: 3999,
    category: "Electronics",
    rating: 4.6,
    image: "/product5.jpg",
  },
  {
    id: 6,
    title: "Cozy Throw Blanket",
    description: "Warm and stylish for your living room.",
    price: 1199,
    category: "Home",
    rating: 4.3,
    image: "/product6.jpg",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on category, price, and search
  const filteredProducts = products
    .filter((product) => (selectedCategory === "All" ? true : product.category === selectedCategory))
    .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
    .filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Add product to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Handle "Buy Now" (simulate with an alert)
  const buyNow = (product) => {
    alert(`You are buying: ${product.title}`);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-800">
      {/* Sticky Navbar */}
      <header className="bg-white shadow-md py-4 px-6 fixed w-full z-10 top-0 left-0 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">E-Shop</h1>
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
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

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-16 mt-20">
        <h2 className="text-4xl font-semibold">Welcome to E-Shop</h2>
        <p className="mt-4 text-lg">Find the best deals on electronics, fashion, and more!</p>
        <Link
          href="#products"
          className="mt-6 inline-block bg-yellow-500 text-black py-2 px-6 rounded-md text-lg hover:bg-yellow-600 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Main Layout with Sidebar and Products */}
      <div className="flex px-6 py-8 gap-8 mt-8">
        {/* Sidebar with Filters */}
        <aside className="w-64 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-lg py-2 px-4 rounded-md transition duration-300 hover:bg-blue-100 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {cat}
                </button>
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
            <p className="text-sm text-gray-500 mt-2">₹{priceRange[0]} - ₹{priceRange[1]}</p>
          </div>
        </aside>

        {/* Product Listings */}
        <main className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="products">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
            >
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={300}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {/* Star Ratings */}
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className={`text-xl ${index < product.rating ? "fas fa-star" : "far fa-star"}`}></span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">({product.rating} ratings)</p>
                </div>
                <p className="text-xl font-bold text-blue-600 mt-2">₹{product.price}</p>
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-green-600 transition duration-300"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-yellow-600 transition duration-300"
                    onClick={() => buyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
