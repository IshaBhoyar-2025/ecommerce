import { getAdminById, updateAdminById } from "@/app/admin/actions";
import EditAdminForm from "./EditAdminForm";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/admin/actions";

export default async function EditAdminPage({ params }: { params: { id: string } }) {
  //redirect("/admin/login");
  // Check if the user is authenticated as an admin
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = params;

  // Check if id is a valid ObjectId to avoid crash
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <div className="text-center mt-10 text-red-600">Invalid Admin ID.</div>;
  }

  const adminUser = await getAdminById(id);

  if (!adminUser) {
    return <div className="text-center mt-10 text-red-600">Admin not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Admin</h1>
        <EditAdminForm admin={admin} updateAdmin={updateAdminById} />
      </div>
    </div>
  );
}
