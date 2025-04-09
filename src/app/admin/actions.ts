 "use server";

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Register Admin
export async function addAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  await connectDB();
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return { error: "Admin already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({ name, email, password: hashedPassword });
  await newAdmin.save();

  return { success: "Admin registered successfully. Please login." };
}

// Login Admin
export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  await connectDB();
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return { error: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return { error: "Invalid email or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("Admin", JSON.stringify({
    id: admin._id,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("admin/profile");
}

// Get Current Admin
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("Admin");
  if (!cookie) return null;

  try {
    const parsed = JSON.parse(cookie.value);

    await connectDB();
    const admin = await Admin.findById(parsed.id);
    if (!admin) return null;

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };
  } catch {
    return null;
  }
}

// Logout Admin
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("Admin");
  redirect("admin/login");
}

// ✅ Update Admin Profile (fixed)
export async function updateAdminProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) return { error: "Not authenticated" };

  await connectDB();
  const updatedAdmin = await Admin.findByIdAndUpdate(
    currentAdmin.id,
    { name, email },
    { new: true }
  );

    return { success: "Profile updated successfully" };
  }
  