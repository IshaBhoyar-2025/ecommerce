// src/app/admin/orders/page.tsx

import Link from "next/link";
import { getAllOrders, DisplayOrder } from "./actions";
import OrderStatusSelector from "./OrderStatusSelector";

export const dynamic = "force-dynamic";

export default async function ManageOrdersPage({
  searchParams,
}: {
  searchParams: Promise< { status?: string }>;
}) {
  const statusFilter = (await searchParams).status || "all";
  const orders = await getAllOrders(statusFilter);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        <Link href="/admin/dashboard">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Go To Dashboard
          </button>
        </Link>
        <div className="space-x-2">
          {["all", "pending", "paid", "shipped", "delivered", "returned"].map(
            (status) => (
              <Link key={status} href={`/admin/orders?status=${status}`}>
                <button
                  className={`px-4 py-2 border rounded ${
                    statusFilter === status ? "bg-black text-white" : "bg-gray-100"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              </Link>
            )
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-[1300px] w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Order ID</th>
              <th className="border px-3 py-2">User</th>
              <th className="border px-3 py-2 w-[420px]">Products</th>
              <th className="border px-3 py-2">Amount</th>
              <th className="border px-3 py-2">Payment ID</th>
              <th className="border px-3 py-2">Shipping</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: DisplayOrder) => (
              <tr key={order._id.toString()}>
                <td className="border px-3 py-2">{order._id.toString()}</td>
                <td className="border px-3 py-2">
                  {order.userId?.name || "Unknown"}
                  <br />
                  <small>{order.userId?.email}</small>
                </td>
                <td className="border px-3 py-2 w-[420px] space-y-2">
                  {order.products.map((p, idx) => (
                    <div key={idx} className="border p-2 rounded bg-gray-50">
                      <p>
                        <strong>Product Name:</strong> {p.title}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{p.price}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {p.quantity}
                      </p>
                      <p>
                        <strong>Subtotal:</strong> ₹{Number(p.price || 0) * p.quantity}
                      </p>
                    </div>
                  ))}
                </td>
                <td className="border px-3 py-2">₹{order.amount}</td>
                <td className="border px-3 py-2">
                  {order.paymentId || "Pending"}
                </td>
                <td className="border px-3 py-2">
                  {order.shippingAddressId?.fullName || "N/A"}
                  <br />
                  {order.shippingAddressId?.phone}
                  <br />
                  {order.shippingAddressId?.address}
                </td>
                <td className="border px-3 py-2">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="border px-3 py-2">
                  <OrderStatusSelector
                    orderId={order._id.toString()}
                    currentStatus={order.status || "pending"}
                  />
                </td>
                <td className="border px-3 py-2">
                  <Link href={`/admin/orders/edit/${order._id}`}>
                    <button className="bg-blue-600 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
