import { getCurrentAdmin } from "@/app/admin/actions";
import { getUserById, updateUser } from "../../actions";
import EditUserForm from "./EditUserForm"
import { redirect } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const user = await getUserById(id);

  if (!user)
    return <div className="text-center mt-10 text-red-600">User not found.</div>;
   
  

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit User</h1>
      <EditUserForm
        user={{
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }}
        updateUser={updateUser}
      />
    </div>
  );
}