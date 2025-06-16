'use client';

import { createOrder, getCurrentUser } from "../actions";
import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCartProductsByIds } from '@/app/cart/actions';
import { ProductType } from '@/app/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutPageProps {
  address: {
    fullName: string;
    phone: string;
    address: string;
  };
}

export function CheckoutPage({ address }: CheckoutPageProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartProducts, setCartProducts] = useState<(ProductType & { quantity: number })[]>([]);
  const [savedForLater, setSavedForLater] = useState<ProductType[]>([]);

  useEffect(() => {
    async function checkLogin() {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    }

    async function fetchCartProducts() {
      const storedCart: string[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const storedSaved: ProductType[] = JSON.parse(localStorage.getItem("savedForLater") || "[]");

      setSavedForLater(storedSaved);

      if (storedCart.length === 0) {
        setCartProducts([]);
        return;
      }

      try {
        const products = await getCartProductsByIds(storedCart);

        const productMap: Record<string, number> = {};
        storedCart.forEach(id => {
          productMap[id] = (productMap[id] || 0) + 1;
        });

        const withQuantities = products.map((product: ProductType) => ({
          ...product,
          quantity: productMap[product._id] || 1,
        }));

        setCartProducts(withQuantities);
      } catch (err) {
        console.error("Error fetching products:", err);
        setCartProducts([]);
      }
    }

    checkLogin();
    fetchCartProducts();
  }, []);

  const updateLocalStorageCart = (items: (ProductType & { quantity: number })[]) => {
    setCartProducts(items);
    const flat = items.flatMap(i => Array(i.quantity).fill(i._id));
    localStorage.setItem("cart", JSON.stringify(flat));
  };

  const handleQuantityChange = (productId: string, type: 'increase' | 'decrease') => {
    const updated = cartProducts.map(p =>
      p._id === productId
        ? { ...p, quantity: Math.max(1, p.quantity + (type === "increase" ? 1 : -1)) }
        : p
    );
    updateLocalStorageCart(updated);
  };

  const handleSaveForLater = (productId: string) => {
    const product = cartProducts.find(p => p._id === productId);
    if (!product) return;
    updateLocalStorageCart(cartProducts.filter(p => p._id !== productId));
    const updatedSaved = [...savedForLater, product];
    setSavedForLater(updatedSaved);
    localStorage.setItem("savedForLater", JSON.stringify(updatedSaved));
  };

  const handleMoveToCart = (productId: string) => {
    const product = savedForLater.find(p => p._id === productId);
    if (!product) return;
    const updatedSaved = savedForLater.filter(p => p._id !== productId);
    setSavedForLater(updatedSaved);
    localStorage.setItem("savedForLater", JSON.stringify(updatedSaved));
    const updatedCart = [...cartProducts, { ...product, quantity: 1 }];
    updateLocalStorageCart(updatedCart);
  };

  const handleRemoveSaved = (productId: string) => {
    const updatedSaved = savedForLater.filter(p => p._id !== productId);
    setSavedForLater(updatedSaved);
    localStorage.setItem("savedForLater", JSON.stringify(updatedSaved));
  };

  const handlePlaceOrder = async () => {
    const cartId = localStorage.getItem("cartId");
    const shippingAddressId = localStorage.getItem("shippingAddressId");
    if (!cartId || !shippingAddressId) return alert("Missing cart or shipping address.");
    try {
      await createOrder(cartId, shippingAddressId);
      alert("Order placed successfully!");
      router.push("/order-success"); // or any order confirmation route
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  const totalAmount = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalWithPlatformFee = totalAmount + 3;

  return (
    <>
      <Header />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6 bg-gray-50 p-4 rounded shadow-sm">
          <div className="bg-white p-4 border rounded">
            <div className="flex justify-between mb-2">
              <h2 className="text-lg font-semibold">Delivery Address</h2>
              <a href="/shipping" className="text-blue-600">Change</a>
            </div>
            <p className="font-semibold">{address.fullName}</p>
            <p>{address.address}</p>
            <p>{address.phone}</p>
          </div>

          {cartProducts.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-6">
                {cartProducts.map((product) => (
                  <div key={product._id} className="flex flex-col md:flex-row gap-4 border-b pb-4">
                    <img
                      src={`/uploads/${product.productImages?.[0]?.thumb || ''}`}
                      alt={product.productTitle}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => handleQuantityChange(product._id, 'decrease')} className="px-2 py-1 bg-gray-200 rounded">−</button>
                        <span className="text-lg font-medium">{product.quantity}</span>
                        <button onClick={() => handleQuantityChange(product._id, 'increase')} className="px-2 py-1 bg-gray-200 rounded">+</button>
                      </div>
                      <div className="flex items-center gap-6 mt-3">
                        <button onClick={() => handleSaveForLater(product._id)} className="text-blue-600">SAVE FOR LATER</button>
                        <button onClick={() => updateLocalStorageCart(cartProducts.filter(p => p._id !== product._id))} className="text-blue-600">REMOVE</button>
                      </div>
                      <p className="mt-2 text-blue-600 font-bold text-md">₹{product.price * product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {savedForLater.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold mb-4">Saved For Later ({savedForLater.length})</h2>
                  {savedForLater.map(product => (
                    <div key={product._id} className="flex gap-4 border p-4 bg-white rounded">
                      <img
                        src={`/uploads/${product.productImages?.[0]?.thumb || ''}`}
                        alt={product.productTitle}
                        className="w-28 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                        <div className="flex items-center gap-4 mt-4">
                          <button onClick={() => handleMoveToCart(product._id)} className="text-blue-600">MOVE TO CART</button>
                          <button onClick={() => handleRemoveSaved(product._id)} className="text-blue-600">REMOVE</button>
                        </div>
                        <p className="mt-2 text-blue-600 font-bold text-md">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-right mt-8">
                <button
                  onClick={handlePlaceOrder}
                  className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
                >
                  PLACE ORDER
                </button>
              </div>
            </>
          )}
        </div>

        {/* Price Summary */}
        <div className="w-full border rounded-lg p-6 bg-white shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">PRICE DETAILS</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Price ({cartProducts.length} item{cartProducts.length > 1 ? 's' : ''})</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹3</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600 line-through">₹40</span>
              <span className="text-green-600 ml-1">Free</span>
            </div>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span className="text-green-600">₹{totalWithPlatformFee}</span>
          </div>
          <p className="text-green-600 mt-2 text-sm">You will save ₹40 on this order</p>
        </div>
      </div>
    </>
  );
}
