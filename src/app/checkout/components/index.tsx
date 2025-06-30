"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartProductsByIds } from "@/app/cart/actions";
import { createOrder, updateOrderStatus } from "@/app/checkout/actions";
import Header from "@/app/components/Header";
import { ProductType } from "@/app/types";
import Image from "next/image";

interface CheckoutPageProps {
  address: {
    fullName: string;
    phone: string;
    address: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayPaymentFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

// Minimal Razorpay options interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  [key: string]: unknown;
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayPaymentFailedResponse) => void): void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export function CheckoutPage({ address }: CheckoutPageProps) {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<(ProductType & { quantity: number })[]>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    async function fetchCartProducts() {
      const storedCart: string[] = JSON.parse(localStorage.getItem("cart") || "[]");
      if (storedCart.length === 0) return setCartProducts([]);

      try {
        const products = await getCartProductsByIds(storedCart);
        const productMap: Record<string, number> = {};
        storedCart.forEach((id) => (productMap[id] = (productMap[id] || 0) + 1));
        const withQuantities = products.map((p) => ({ ...p, quantity: productMap[p._id] || 1 }));
        setCartProducts(withQuantities);
      } catch (err) {
        console.error("Error fetching cart products:", err);
        setCartProducts([]);
      }
    }

    fetchCartProducts();
  }, []);

  const updateLocalStorageCart = (items: (ProductType & { quantity: number })[]) => {
    setCartProducts(items);
    const flat = items.flatMap((i) => Array(i.quantity).fill(i._id));
    localStorage.setItem("cart", JSON.stringify(flat));
  };

  const handleQuantityChange = (productId: string, type: "increase" | "decrease") => {
    const updated = cartProducts.map((p) =>
      p._id === productId
        ? { ...p, quantity: Math.max(1, p.quantity + (type === "increase" ? 1 : -1)) }
        : p
    );
    updateLocalStorageCart(updated);
  };

  const handlePlaceOrder = async () => {
    const cartId = localStorage.getItem("cartId");
    const shippingAddressId = localStorage.getItem("shippingAddressId");

    if (!cartId || !shippingAddressId) {
      console.error("Missing cart or shippingAddress ID");
      return;
    }

    try {
      const { order, dbOrderId } = await createOrder(cartId, shippingAddressId);

      const options: RazorpayOptions = {
        key: "rzp_test_gfa6K0r0FJpuRd",
        amount: Number(order.amount) * 100,
        currency: "INR",
        name: "Shoporia",
        description: "Test Payment",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            await updateOrderStatus({
              orderId: dbOrderId,
              paymentId: response.razorpay_payment_id,
              status: "completed",
            });

            localStorage.removeItem("cart");
            localStorage.removeItem("cartId");
            localStorage.removeItem("shippingAddressId");

            router.push("/order-success");
          } catch (error) {
            console.error("Order status update failed:", error);
            alert("Payment success, but order status update failed.");
          }
        },
        prefill: {
          name: "Isha Bhoyar",
          email: "bhoyarisha8@gmail.com",
          contact: "7038441214",
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: RazorpayPaymentFailedResponse) {
        console.error("Payment failed:", response.error);
        alert("Oops! Something went wrong.\nPayment Failed");
      });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order creation failed");
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
              {cartProducts.map((product) => (
                <div key={product._id} className="flex gap-4 border-b pb-4">
                  <Image
                    src={`/uploads/${product.productImages?.[0]?.thumb || ""}`}
                    alt={product.productTitle}
                    width={128}
                    height={128}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.productTitle}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleQuantityChange(product._id, "decrease")}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        −
                      </button>
                      <span className="text-lg font-medium">{product.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product._id, "increase")}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-2 text-blue-600 font-bold text-md">
                      ₹{product.price * product.quantity}
                    </p>
                  </div>
                </div>
              ))}

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

        <div className="w-full border rounded-lg p-6 bg-white shadow-sm h-fit">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">PRICE DETAILS</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Price ({cartProducts.length} item{cartProducts.length > 1 ? "s" : ""})</span>
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
          <p className="text-green-600 mt-2 text-sm">
            You will save ₹40 on this order
          </p>
        </div>
      </div>
    </>
  );
}
