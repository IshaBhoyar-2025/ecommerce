import { getCurrentUser, logoutUser } from "../actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
   redirect("/login");
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <form action={logoutUser}>
        <button type="submit">Logout</button>
      </form>
      <a href="/profile/edit">Edit Profile</a>
    </div>
  );
}
