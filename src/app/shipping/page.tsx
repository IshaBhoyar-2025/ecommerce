import { getCurrentUser } from "../actions";
import { getShippingAddress } from "./actions";
import ShippingForm from "./components/ShippingForm";
import Header from "@/app/components/Header";

export default async function ShippingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-6 text-red-600 font-semibold">User not logged in.</div>;
  }

  const shipping = await getShippingAddress(user._id.toString());

  // ✅ Ensure shipping is never null
  const safeShipping = shipping || { fullName: "", phone: "", address: "" };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Header />
     
      <ShippingForm shipping={safeShipping} />
    </main>
  );
}
