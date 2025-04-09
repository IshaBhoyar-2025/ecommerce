import { getCurrentAdmin, logoutAdmin } from"../actions";

export default async function ProfilePage() {
  const Admin = await getCurrentAdmin();

  console.log("Admin", Admin);

  if (!Admin) {
    return <p>Please <a href="admin/login">login</a>.</p>;
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
