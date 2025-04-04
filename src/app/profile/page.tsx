import { getCurrentUser, logoutUser } from "../actions";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Please <a href="/login">login</a>.</p>;
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
