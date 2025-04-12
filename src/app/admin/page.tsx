// app/admin/page.tsx
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "./actions";

export default async function AdminPage() {
 const Admin = await getCurrentAdmin();

  if (!Admin) {
   redirect("/admin/login");
  } 
  else {
    redirect("/admin/dashboard");
  }
}
