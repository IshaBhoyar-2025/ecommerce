"use server";

import { connectDB } from "@/lib/mongodb";
import ShippingAddress, { ShippingAddressType } from "@/models/ShippingAddress";
import { getCurrentUser } from "../actions";
import Cart from "@/models/Cart";

interface CartItem {
  productId: string;
  quantity: number;
}

type FormDataType = {
  fullName: string;
  phone: string;
  address: string;
};

export async function saveShippingAddress({
  fullName,
  phone,
  address,
}: FormDataType ): Promise<ShippingAddressType> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  if (!fullName || !phone || !address) {
    throw new Error("All fields are required");
  }

  await connectDB();

  const shipping = await ShippingAddress.findOneAndUpdate(
    { userId: user._id },
    { fullName, phone, address, userId: user._id },
    { upsert: true, new: true }
  );

  return JSON.parse(JSON.stringify(shipping)); // Convert Mongoose document to plain object
}
export async function getShippingAddress(userId: string) {
  await connectDB();
  if (!userId) {
    throw new Error("User ID is required to fetch shipping address");
  }

  const address = await ShippingAddress.findOne<ShippingAddressType>({
    userId: userId,
  }).lean(); // ✅ This returns a plain JS object instead of a Mongoose document

  if (!address) return null;

  return {
    fullName: address.fullName ?? "",
    phone: address.phone ?? "",
    address: address.address ?? "",
  };
}


export async function saveCartItems(items: CartItem[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  await connectDB();

  const cart = await Cart.findOneAndUpdate(
    { userId: user._id },
    { items, userId: user._id },
    { upsert: true, new: true }
  );

  return JSON.parse(JSON.stringify(cart)); // Convert Mongoose document to plain object
}
