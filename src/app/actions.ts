"use server";

import { connectDB } from "@/lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Product from "@/models/Product";
import Category from "@/models/Categories";
import { CategoryType } from "./admin/categories/actions";
import SubCategory from "@/models/SubCategory";


// Register User
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return { success: "User registered successfully. Please login." };
}

// Login User
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: "Invalid email or password" };
  }

  (await cookies()).set("user", JSON.stringify({ id: user._id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/");
}

// Get Current User
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) return null;

  const user = JSON.parse(cookie.value);
  await connectDB();
  const currentUser = await User.findById(user.id);
  if (!currentUser) return null;
  return {
    _id: currentUser._id.toString(),
    name: currentUser.name,
    email: currentUser.email,
  };
}

// Logout User
export async function logoutUser() {
  (await cookies()).delete("user");
  redirect("/login");
}

// Update Profile
export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  await connectDB();
  await User.findByIdAndUpdate(user._id, { name, email });

  return { success: "Profile updated successfully" };
}

export const getAllProducts = async () => {
  await connectDB();

  const products = await Product.aggregate([
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subCategoryKey',
        foreignField: 'subCategoryKey',
        as: 'subCategory',
      },
    },
    { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
  
    {
      $lookup: {
        from: 'categories',
        localField: 'subCategory.parentCategoryKey',
        foreignField: 'categoryKey',
        as: 'category',
      },
    },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  
   {
      $project: {
        _id: 1,
        productTitle: 1,
        productDescription: 1,
        subCategoryName: '$subCategory.subCategoryName',
        categoryName: '$category.categoryName',
        price: 1,
      },
    },
  ]);

  return products;
};

export async function getAllCategories(): Promise<CategoryType[]> {
  try {
    await connectDB();
    const categories = await Category.find();
    return categories.map((category) => ({
      _id: category._id.toString(),
      categoryName: category.categoryName,
      categoryKey: category.categoryKey,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}




export const getSubCategoriesByCategoryKey = async (categoryKey: string) => {
  await connectDB();
  return await SubCategory.find({ parentCategoryKey: categoryKey });
};


export const getProductsByCategoryKey = async (categoryKey: string) => {
  await connectDB();

  return await Product.aggregate([
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subCategoryKey',
        foreignField: 'subCategoryKey',
        as: 'subCategory',
      },
    },
    { $unwind: '$subCategory' },
    {
      $match: {
        'subCategory.parentCategoryKey': categoryKey,
      },
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        productDescription: 1,
        price: 1,
        subCategoryName: '$subCategory.subCategoryName',
      },
    },
  ]);
};
export const getProductsBySubCategoryKey = async (subCategoryKey: string) => {
  await connectDB();

  return await Product.find({ subCategoryKey });
};

export async function getSubcategoriesByCategoryKey(categoryKey: string) {
  try {
    await connectDB();

    const subcategories = await SubCategory.find({ parentCategoryKey: categoryKey });

    return subcategories.map((sub) => ({
      _id: sub._id.toString(),
      subCategoryName: sub.subCategoryName,
      subCategoryKey: sub.subCategoryKey,
    }));
  } catch (error) {
    console.error("Failed to get subcategories:", error);
    return [];
  }
}

