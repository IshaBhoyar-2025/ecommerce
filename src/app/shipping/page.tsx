// src/app/shipping/page.t
import { redirect } from "next/navigation";
import { saveShippingAddress } from "./actions";
import Header from "@/app/components/Header";
import { getCurrentUser } from "../actions";
import { getShippingAddress } from "./actions";


export default async function ShippingPage() {
  const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/login");

  const shipping =  await getShippingAddress(currentUser._id);



  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4 mt-15">Shipping Address</h1>

      <form action={saveShippingAddress} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            defaultValue={shipping?.fullName || ""}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            defaultValue={shipping?.phone || ""}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            defaultValue={shipping?.address || ""}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </main>
  );
}


