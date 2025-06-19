'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';

type Product = {
  name: string;
  price: number;
  quantity: number;
  thumb?: string;
};

type Order = {
  _id: string;
  amount: number;
  status: string;
  products: Product[];
  createdAt: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    }

    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You have not placed any orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="border p-4 rounded mb-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order ID: {order._id}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-2">
                    <img
                      src={`/uploads/${product.thumb}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      <p className="text-sm text-gray-600">₹{product.price * product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 font-semibold text-right">
                Total: ₹{order.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
