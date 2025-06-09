// src/app/checkout/actions.ts
"use server";

import { connectDB } from "@/lib/mongodb";
import ShippingAddress, { ShippingAddressType } from "@/models/ShippingAddress";
import { getCurrentUser } from "@/app/actions";

export async function getShippingAddress() {
  await connectDB();



  const user = await getCurrentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

  const address = await ShippingAddress.findOne<ShippingAddressType>({ userId: user._id });

  return {

      fullName: address?.fullName ?? "",
        phone: address?.phone ?? "",
        address: address?.address ?? "",  
}


}
export { getCurrentUser };

