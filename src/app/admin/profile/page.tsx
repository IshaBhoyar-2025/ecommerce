import { getCurrentAdmin, logoutAdmin } from"../actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const Admin = await getCurrentAdmin();

  if (!Admin) {
   redirect("/admin/login");
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {Admin.name}</p>
      <p>Email: {Admin.email}</p>
      <form action={logoutAdmin}>
        <button type="submit">Logout</button>
      </form>
      <a href="/admin/profile/edit">Edit Profile</a>
    </div>
  );
}
