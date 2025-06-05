'use client';
import { getCartProductsByIds } from "@/app/cart/actions";
import { ProductType } from "@/app/types";          
import { use, useEffect, useState } from "react";

export function Cart() {
  const [cartProducts, setCartProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      const storedCart: string[] = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log("Stored Cart IDs:", storedCart);
      if (storedCart.length === 0) {
        setCartProducts([]);
        return;
      }

      try {
        console.log("Fetching products for IDs:", storedCart);
        const products = await getCartProductsByIds(storedCart);
        console.log("Fetched products:", products);
        setCartProducts(products);
      } catch (error) {
        console.error("Failed to fetch products by IDs:", error);
        setCartProducts([]);
      }
    };

    fetchCartProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cartProducts.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartProducts.map((product, index) => (
            <div key={index} className="border rounded p-4 shadow">
              <h3 className="text-lg font-semibold">{product.productTitle}</h3>
              <p className="text-sm text-gray-600">{product.productDescription}</p>

              {product.productImages?.[0]?.thumb ? (
                <img
                  src={`/uploads/${product.productImages[0].thumb}`}
                  alt={product.productTitle}
                  className="my-3 w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="my-3 w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  No Image
                </div>
              )}

              <p className="text-blue-600 font-bold text-lg">
                ₹{product.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}