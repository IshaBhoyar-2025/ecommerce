"use server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import type { IProduct } from "@/models/Product";
import "@/models/User";
import "@/models/ShippingAddress";
import { Types } from "mongoose";
import { ReactNode } from "react";

// -- Type for returned order structure --
export type DisplayOrder = {
  amount: ReactNode;
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
  products: {
    price: ReactNode;
    productId: string;
    quantity: number;
    title?: string;
  }[];
};

interface RawOrderType {
  _id: Types.ObjectId;
  paymentId?: string;
  status?: string;
  createdAt?: Date;
  amount?: number;
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
  products: { productId: string; quantity: number }[];
}

export async function getAllOrders(status: string): Promise<DisplayOrder[]> {
  await connectDB();

  const query: Record<string, string> = {};
  if (status !== "all") query.status = status;

  const rawOrders = await Order.find(query)
    .populate("userId", "name email")
    .populate("shippingAddressId")
    .lean();

  const orders: DisplayOrder[] = await Promise.all(
    rawOrders.map(async (rawOrder) => {
      const order = rawOrder as unknown as RawOrderType;

      const updatedProducts = await Promise.all(
        (order.products ?? []).map(async (product) => {
          const productDoc = await Product.findById(product.productId).lean<IProduct | null>();
          return {
            ...product,
            price: productDoc?.price ?? 0,
            title: productDoc?.productTitle || "Unknown",
          };
        })
      );

      return {
        amount: order.amount ?? 0,
        _id: order._id,
        paymentId: order.paymentId,
        status: order.status,
        createdAt: order.createdAt?.toISOString(),
        userId: order.userId,
        shippingAddressId: order.shippingAddressId,
        products: updatedProducts,
      };
    })
  );

  return orders;
}

export async function getOrderById(id: string): Promise<DisplayOrder | null> {
  await connectDB();

  const rawOrder = await Order.findById(id)
    .populate("userId", "name email")
    .populate("shippingAddressId")
    .lean();

  if (!rawOrder) return null;

  const order = rawOrder as unknown as RawOrderType;

  const updatedProducts = await Promise.all(
    (order.products ?? []).map(async (product) => {
      const productDoc = await Product.findById(product.productId).lean<IProduct | null>();
      return {
        ...product,
        price: productDoc?.price ?? 0,
        title: productDoc?.productTitle || "Unknown",
      };
    })
  );

  return {
    amount: order.amount ?? 0,
    _id: order._id,
    paymentId: order.paymentId,
    status: order.status,
    createdAt: order.createdAt?.toISOString(),
    userId: order.userId,
    shippingAddressId: order.shippingAddressId,
    products: updatedProducts,
  };
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

    // Update paymentId
    await Order.findByIdAndUpdate(orderId, { paymentId });

    // Update shipping address
    await ShippingAddress.findByIdAndUpdate(order.shippingAddressId, {
      fullName,
      phone,
      address,
    });

    return { success: "Order updated successfully" };
  } catch (err) {
    console.error("Update error:", err);
    return { error: "Something went wrong" };
  }
}
