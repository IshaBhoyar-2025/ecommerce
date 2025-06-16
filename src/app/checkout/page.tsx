// page.tsx
import { getShippingAddress } from "../shipping/actions";
// Update the import path below if the actual path is different
// Update the import path below if the actual path is different
// Update the import path below to the correct location of CheckoutPage
import { CheckoutPage } from './components';

import { getCurrentUser } from "../actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const address = await getShippingAddress(user._id.toString());
  if (!address) {
    // You can redirect or render an error/fallback here
    redirect("/shipping"); // or any appropriate route
    return null;
  }
  return <CheckoutPage address={address} />;
}
