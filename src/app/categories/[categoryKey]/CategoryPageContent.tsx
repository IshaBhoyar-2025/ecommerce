"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { ProductType } from "@/app/types";
import SecureImage from "@/app/components/SecureImage";

interface SubCategoryType {
  _id: string;
  subCategoryKey: string;
  subCategoryName: string;
}

interface Props {
  categoryKey: string;
  products: ProductType[];
  subcategories: SubCategoryType[];
}

export default function CategoryPageContent({
  categoryKey,
  products,
  subcategories,
}: Props) {
  const router = useRouter();
  const [maxPrice, setMaxPrice] = useState(10000);

  const addToCart = (product: ProductType) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...existingCart, product._id];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  const filteredProducts = products.filter((product) => product.price <= maxPrice);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 pt-28 mt-12">
        {/* Sidebar + Product grid wrapper */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white p-4 md:p-6 rounded-2xl shadow-md sticky md:top-28 self-start h-fit">
            <h2 className="text-xl font-bold capitalize text-gray-900 mb-4 border-b pb-2">
              {categoryKey.replace(/-/g, " ")}
            </h2>

            <ul className="space-y-3">
              {subcategories.map((sub) => (
                <li key={sub.subCategoryKey}>
                  <Link
                    href={`/subcategory/${sub.subCategoryKey}`}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition font-medium"
                  >
                    {sub.subCategoryName}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Price Filter */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Filter by Price</h3>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-sm text-gray-600 mt-2">
                ₹0 - ₹{maxPrice}
              </p>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                <Link href={`/items/${product._id}`} className="block">
                  <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
                    <SecureImage
                      src={product.productImages?.[0]?.thumb || "/placeholder.jpg"}
                      alt={product.productTitle || "Product"}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {product.productTitle}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.productDescription.length > 40
                        ? product.productDescription.slice(0, 40) + "..."
                        : product.productDescription}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">
                      ₹{product.price}
                    </p>
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
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
