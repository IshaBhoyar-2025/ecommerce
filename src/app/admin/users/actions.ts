"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongodb from "mongodb";

export type UserType = {
  _id: mongodb.ObjectId;
  name: string;
  email: string;
};

// 🔄 Get user by ID
export async function getUserById(id: string) {
  await connectDB();
  try {
    return await User.findById(id);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

// ✅ Update user by ID
export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!id || !name || !email) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return { error: "User not found." };
    }

    existingUser.name = name;
    existingUser.email = email;

    if (password) {
      existingUser.password = await bcrypt.hash(password, 10);
    }

    await existingUser.save();
    return { success: "User updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user." };
  }
}

// ➕ Register a new user
export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    return { success: "User added successfully." };
  } catch (error) {
    console.error("Error adding  user:", error);
    return { error: "Add failed." };
  }
}

// ❌ Delete user by ID
export async function deleteUserById(id: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(id);
    revalidatePath("/admin/users");
    redirect("/admin/users");
    return { success: "User deleted successfully." };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user." };
  }
}

// 📦 Get all users
export async function getAllUsers(): Promise<UserType[]> {
  try {
    await connectDB();
    const users = await User.find();
    return users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
