// app/profile/edit/page.tsx
import EditProfilePageClient from "./EditProfileClient";
import { getCurrentUser } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  const user = await getCurrentUser();
   
  if (!user) {
    redirect("/login");
  }
  return <EditProfilePageClient user={user} />;
}
