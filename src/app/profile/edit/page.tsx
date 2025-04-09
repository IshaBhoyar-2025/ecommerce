// app/profile/edit/page.tsx
import EditProfilePageClient from "./EditProfileClient";
import { getCurrentUser } from "@/app/actions";

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Please <a href="/login">login</a>.</p>;
  }

  return <EditProfilePageClient user={user} />;
}
