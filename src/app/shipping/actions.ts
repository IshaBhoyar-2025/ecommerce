// src/app/shipping/actions.ts
"use server";

import { connectDB } from "@/lib/mongodb";
import ShippingAddress from "@/models/ShippingAddress";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions";

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

  redirect("/payment"); // or any other route
}

export async function getShippingAddress(userId: string) {
  await connectDB();
  if (!userId) {
    throw new Error("User ID is required to fetch shipping address");
  }
    const address = await ShippingAddress.findOne({
    userId: userId,
  });

    return {
        fullName: address?.fullName?? "",
        phone: address?.phone?? "",
        address: address?.address?? "",
    };

    
}

