// src/app/admin/orders/actions.ts
"use server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import type { IProduct } from "@/models/Product";
import "@/models/User";
import "@/models/ShippingAddress";
import { Types } from "mongoose";

// -- Type for a populated order --
type PopulatedOrderType = {
  _id: Types.ObjectId;
  paymentId?: string;
  status?: string;
  createdAt?: string;
  userId?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
  shippingAddressId?: {
    _id: Types.ObjectId;
    fullName: string;
    phone: string;
    address: string;
  };
  products?: {
    productId: string;
    quantity: number;
    title?: string;
  }[];
};

export async function getAllOrders(status: string) {
  await connectDB();
  const query: any = {};
  if (status !== "all") query.status = status;

  let orders = await Order.find(query)
    .populate("userId", "name email")
    .populate("shippingAddressId")
    .lean();

  orders = await Promise.all(
    orders.map(async (order: any) => {
      const updatedProducts = await Promise.all(
        order.products.map(async (product: any) => {
          const productDoc = await Product.findById(product.productId).lean() as IProduct | null;
          return {
            ...product,
            title: productDoc?.productTitle || "Unknown",
          };
        })
      );

      return {
        ...order,
        products: updatedProducts,
      };
    })
  );

  return orders;
}

export async function getOrderById(id: string): Promise<PopulatedOrderType | null> {
  await connectDB();
  const order = await Order.findById(id)
    .populate("userId", "name email")
    .populate("shippingAddressId")
    .lean();

  return order as PopulatedOrderType | null;
}

export async function updateOrderStatus(orderId: string, status: string) {
  await connectDB();
  await Order.findByIdAndUpdate(orderId, { status });
}

export async function updateOrder(id: string, formData: FormData) {
  await connectDB();
  const status = formData.get("status")?.toString() || "pending";
  const paymentId = formData.get("paymentId")?.toString() || "";

  await Order.findByIdAndUpdate(id, {
    status,
    paymentId,
  });
}

export async function updateOrderFields(orderId: string, formData: FormData): Promise<{ success?: string; error?: string }> {
  await connectDB();

  try {
    const paymentId = formData.get("paymentId")?.toString() || "";
    const fullName = formData.get("fullName")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const address = formData.get("address")?.toString() || "";

    const order = await Order.findById(orderId);
    if (!order || !order.shippingAddressId) {
      return { error: "Order not found or missing shipping info" };
    }

    const ShippingAddress = (await import("@/models/ShippingAddress")).default;

    // Update order's paymentId
    await Order.findByIdAndUpdate(orderId, { paymentId });

    // Update shipping address
    await ShippingAddress.findByIdAndUpdate(order.shippingAddressId, {
      fullName,
      phone,
      address,
    });

    return { success: "Order updated successfully" };
  } catch (err: any) {
    console.error("Update error:", err);
    return { error: "Something went wrong" };
  }
}
