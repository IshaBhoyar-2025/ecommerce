"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductType } from "../types";
import Header from "@/app/components/Header";
import Image from "next/image";
import { CategoryType } from "../admin/categories/actions";
import SecureImage from "../components/SecureImage";

interface Props {
  products: ProductType[];
  categories: CategoryType[];
}

export function Home({ products, categories }: Props) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const router = useRouter();

  const addToCart = (product: ProductType) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Add product ID to cart; here you might want to allow duplicates or increase quantity, but this keeps unique IDs
    const updatedCart = [...cart.filter((item: string) => item !== product._id), product._id];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  const filteredProducts = products.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800">
      <Header />

      <section className="bg-white mt-20 py-20 px-6 md:px-12 shadow-sm rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
              Your Daily <span className="text-indigo-600">Shopping</span> Hub
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover top deals on fashion, electronics, and essentials — all in one place.
            </p>
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-indigo-700 transition"
            >
              🛍 Start Shopping
            </a>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-6 w-full max-w-md">
            {[
              { name: "⚡ Electronics", key: "electronics" },
              { name: "👗 Fashion", key: "fashion" },
              { name: "💍 Accessories", key: "accessories" },
              { name: "📚 Books", key: "books" },
            ].map((cat, index) => (
              <Link
                key={index}
                href={`/categories/${cat.key}`}
                className="bg-gradient-to-tr from-white via-blue-50 to-white p-6 rounded-3xl border border-gray-100 shadow hover:shadow-md hover:-translate-y-1 transition block"
              >
                <p className="text-xl font-semibold text-gray-800">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="flex px-6 py-12 gap-10 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 rounded-2xl shadow-md sticky top-24 h-fit">
          <h3 className="text-xl font-bold mb-4">Categories</h3>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/categories/${cat.categoryKey}`}
                  className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
                >
                  {cat.categoryName}
                </Link>
              </li>
            ))}
          </ul>

          {/* Price Range Filter */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Filter by Price</h3>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-indigo-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </p>
          </div>
        </aside>

        {/* Products Grid */}
        <main id="products" className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col"
              >
                <Link href={`/items/${product._id}`} className="block">
                  <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
                    <SecureImage
                      src={product.productImages?.[0]?.thumb}
                      alt={product.productTitle}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.productTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.productDescription.slice(0, 50)}...
                    </p>
                    <p className="text-indigo-600 text-xl font-bold">₹{product.price}</p>
                  </div>
                </Link>

                <div className="p-4 mt-auto border-t border-gray-100">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-full font-medium shadow-sm transition"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
