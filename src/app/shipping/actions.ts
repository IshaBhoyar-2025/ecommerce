// src/app/shipping/actions.ts
"use server";

import { connectDB } from "@/lib/mongodb";
import ShippingAddress, { ShippingAddressType } from "@/models/ShippingAddress";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions";
import Cart from "@/models/Cart";




interface CartItem {
  productId: string;
  quantity: number;
}

export async function saveShippingAddress(formData: FormData): Promise<void> {
// Replace this with your actual user fetching logic, e.g. import { getCurrentUser } from "@/lib/auth";
const user = await getCurrentUser();

  if (!user) throw new Error("Not authenticated");

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  await connectDB();

  // Update if already exists, otherwise insert new
  await ShippingAddress.findOneAndUpdate(
    { userId: user._id },
    { fullName, phone, address },
    { upsert: true, new: true }
  );
 redirect("/checkout");

}

export async function getShippingAddress(userId: string) {
  await connectDB();
  if (!userId) {
    throw new Error("User ID is required to fetch shipping address");
  }
    const address = await ShippingAddress.findOne<ShippingAddressType>({
    userId: userId,
  });

    return {
        fullName: address?.fullName?? "",
        phone: address?.phone?? "",
        address: address?.address?? "",
    };

    
}

export async function saveCartItems(items: CartItem[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  await connectDB();

  // Upsert cart data
  await Cart.findOneAndUpdate(
    { userId: user._id },
    { items },
    { upsert: true, new: true }
  );
}