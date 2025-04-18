"use server";

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import mongodb from "mongodb";


export type AdminType = {
  id: string;
  name: string;
  email: string;
};

// =======================
// Delete Admin
// =======================
export async function deleteAdminById(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await connectDB();
  await Admin.findByIdAndDelete(id);
  revalidatePath("/admin/dashboard");
}


// =======================
// Register Admin
// =======================
export async function addAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check if the required fields are provided
  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    // Connect to the database
    await connectDB();

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return { error: "Admin already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();

    // Return success message
    return { success: "Admin Added successfully" };
  } catch (error) {
    console.error("Error during admin aadition:", error);
    return { error: "An error occurred during added. Please try again." };
  }
}

// =======================
// Login Admin
// =======================
export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    console.log("Email or password not provided");
    return { error: "All fields are required" };
  }

  await connectDB();
  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log("Admin not found");
    return { error: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    console.log("Password does not match");
    return { error: "Invalid email or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("Admin", JSON.stringify({ id: admin._id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/admin/dashboard");
  
}

// =======================
// Get Current Admin
// =======================
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
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
    };
  } catch {
    return null;
  }
}

// =======================
// Logout Admin
// =======================
export async function logoutAdmin() {
  const cookieStore = cookies();
  (await cookieStore).set("Admin", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  redirect("/admin/login");
}

// =======================
// Update Current Admin Profile
// =======================
export async function updateAdminProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) return { error: "Not authenticated" };

  await connectDB();
  await Admin.findByIdAndUpdate(currentAdmin.id, { name, email });

  return { success: "Profile updated successfully" };
}

// =======================
// Get All Admins
// =======================
// actions.ts
export async function getAllAdmins() {
  await connectDB();
  const admins = await Admin.find({}, "name email"); // Add _id if missing
  return admins.map((admin) => ({
    id: admin._id.toString(), // ✅ This must be "id", not "_id"
    name: admin.name,
    email: admin.email,
  }));
}


// =======================
// Get a Single Admin
// =======================
export async function getAdminById(id: string) {
  await connectDB();
  const admin = await Admin.findById(id).lean() as { _id: mongodb.ObjectId; name: string; email: string } | null;
  if (!admin) return null;

  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
  };
}

// =======================
// Update Admin by ID
// =======================
export async function updateAdminById(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await connectDB();

  const updateFields: {name: string, email: string, password?: string} = { name, email };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateFields.password = hashedPassword;
  }

  await Admin.findByIdAndUpdate(id, updateFields);
  revalidatePath("/admin/dashboard");

  return { success: "Admin updated successfully" };
}

