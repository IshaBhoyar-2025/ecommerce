import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ShippingPage() {
  const cookieStore = cookies();
  const user = (await cookieStore).get("user");

  if (!user) {
    redirect("/login?redirect=/shipping"); // 👈 redirect to login
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Shipping Page</h1>
      <p>This is a protected page only visible after login.</p>
    </main>
  );
}
