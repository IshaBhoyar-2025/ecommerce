'use server';

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Categories";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongodb from "mongodb";

// Define the CategoryType returned from the DB
export type CategoryType = {
  _id: string; // Converted to string for frontend compatibility
  categoryName: string;
  categoryKey: string;
  createdAt?: string;
  updatedAt?: string;
};

// Internal Mongoose model type with possible Date types
type CategoryDocType = {
  _id: mongodb.ObjectId;
  categoryName: string;
  categoryKey: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// 🔄 Get category by ID
export async function getCategoryById(id: string) {
  await connectDB();
  try {
    return await Category.findById(id);
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}

// ✅ Update category by ID
export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const categoryName = formData.get("categoryName") as string;
  const categoryKey = formData.get("categoryKey") as string;

  if (!id || !categoryName || !categoryKey) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return { error: "Category not found." };
    }

    existingCategory.categoryName = categoryName;
    existingCategory.categoryKey = categoryKey;

    await existingCategory.save();

    return { success: "Category updated successfully." };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category." };
  }
}

// ➕ Add a new category
export async function addCategories(formData: FormData) {
  try {
    const categoryName = formData.get("categoryName")?.toString();
    const categoryKey = formData.get("categoryKey")?.toString();

    if (!categoryName || !categoryKey) {
      return { error: "All fields are required." };
    }

    await connectDB();

    // Optional: check if category already exists
    const exists = await Category.findOne({ categoryKey });
    if (exists) {
      return { error: "Category with this key already exists." };
    }

    const newCategory = new Category({ categoryName, categoryKey });
    await newCategory.save();

    return { success: "Category added successfully." };
  } catch (error) {
    console.error("Add category error:", error);
    return { error: "Failed to add category." };
  }
}

// ❌ Delete category by ID
export async function deleteCategoryById(id: string) {
  try {
    await connectDB();
    await Category.findByIdAndDelete(id);
    revalidatePath("/admin/categories");
    redirect("/admin/categories");
    return { success: "Category deleted successfully." };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category." };
  }
}

// 📦 Get all categories
export async function getAllCategories(): Promise<CategoryType[]> {
  await connectDB();
  const categories = await Category.find({}).lean<CategoryDocType[]>();

  return categories.map((category) => ({
    _id: category._id.toString(),
    categoryName: category.categoryName,
    categoryKey: category.categoryKey,
    createdAt: category.createdAt?.toISOString(),
    updatedAt: category.updatedAt?.toISOString(),
  }));
}
