"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import {
  getProductsByCategoryKey,
  getSubcategoriesByCategoryKey,
} from "@/app/actions";

export default function CategoryPage({ params }: { params: { categoryKey: string } }) {
  const router = useRouter();
  const { categoryKey } = params;

  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedProducts, fetchedSubcategories] = await Promise.all([
        getProductsByCategoryKey(categoryKey),
        getSubcategoriesByCategoryKey(categoryKey),
      ]);
      setProducts(fetchedProducts);
      setSubcategories(fetchedSubcategories);
    };
    fetchData();
  }, [categoryKey]);

  const addToCart = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...existingCart, product._id];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 py-10 pt-28">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-md sticky top-28 self-start h-fit">
          <h2 className="text-xl font-bold capitalize text-gray-900 mb-6 border-b pb-2">
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
            <h4 className="text-md font-semibold text-gray-800 mb-2">
              Filter by Price
            </h4>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              defaultValue="10000"
              className="w-full accent-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">₹0 - ₹10000</p>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <Link href={`/items/${product._id}`} className="block">
                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={`/uploads/${product.productImages?.[0]?.thumb || "no-image.jpg"}`}
                    alt={product.productTitle}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.productTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.productDescription.length > 40
                      ? product.productDescription.slice(0, 40) + "..."
                      : product.productDescription}
                  </p>
                  <p className="text-xl font-bold text-blue-600">₹{product.price}</p>
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
  );
}
