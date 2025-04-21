"use server";

import { connectDB } from "@/lib/mongodb";
import SubCategory from "@/models/SubCategory"; // Make sure the filename is SubCategory.ts
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export type SubCategoryType = {
  _id: string;
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey: string;
};

// Add new subcategory
export async function addSubCategory(formData: FormData) {
  await connectDB();

  const subCategoryName = formData.get("subCategoryName")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString(); // Fixed typo
  const parentCategoryKey = formData.get("parentCategoryKey")?.toString();

  if (!subCategoryName || !subCategoryKey || !parentCategoryKey) {
    return { error: "All fields are required." };
  }

  try {
    const newSubCategory = new SubCategory({
      subCategoryName,
      subCategoryKey,
      parentCategoryKey,
    });

    await newSubCategory.save();
    revalidatePath("/admin/subcategory");
    return { success: "Subcategory added successfully." };
  } catch (error: any) {
    console.error("Error adding subcategory:", error.message || error);
    return { error: "Failed to add subcategory." };
  }
}

// Get all subcategories
export async function getAllSubCategories(): Promise<(SubCategoryType & { parentCategoryName?: string })[]> {
  await connectDB();

  const subcategories = await SubCategory.aggregate([
    {
      $lookup: {
        from: "categories", // This should be the actual MongoDB collection name
        localField: "parentCategoryKey",
        foreignField: "categoryKey",
        as: "parentCategory",
      },
    },
    {
      $unwind: {
        path: "$parentCategory",
        preserveNullAndEmptyArrays: true, // In case no match is found
      },
    },
    {
      $project: {
        subCategoryName: 1,
        subCategoryKey: 1,
        parentCategoryKey: 1,
        parentCategoryName: "$parentCategory.categoryName",
      },
    },
  ]);

  return subcategories.map((item: any) => ({
    _id: item._id.toString(),
    subCategoryName: item.subCategoryName,
    subCategoryKey: item.subCategoryKey,
    parentCategoryKey: item.parentCategoryKey,
    parentCategoryName: item.parentCategoryName,
  }));
}

// Get subcategory by ID
export async function getSubCategoryById(id: string): Promise<SubCategoryType | null> {
  await connectDB();

  const subcategory = await SubCategory.findById(id).lean() as SubCategoryType | null;
  if (!subcategory) return null;

  return {
    _id: subcategory._id.toString(),
    subCategoryName: subcategory.subCategoryName,
    subCategoryKey: subcategory.subCategoryKey,
    parentCategoryKey: subcategory.parentCategoryKey,
  };
}

// Update subcategory
export async function updateSubCategory(formData: FormData) {
  await connectDB();

  const id = formData.get("id")?.toString();
  const subCategoryName = formData.get("subCategoryName")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();
  const parentCategoryKey = formData.get("parentCategoryKey")?.toString();

  if (!id || !subCategoryName || !subCategoryKey || !parentCategoryKey) {
    return { error: "All fields are required." };
  }

  try {
    await SubCategory.findByIdAndUpdate(id, {
      subCategoryName,
      subCategoryKey,
      parentCategoryKey,
    });

    revalidatePath("/admin/subcategory");
    return { success: "Subcategory updated successfully." };
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return { error: "Failed to update subcategory." };
  }
}

// Delete subcategory
export async function deleteSubCategoryById(id: string) {
  await connectDB();

  try {
    await SubCategory.findByIdAndDelete(new ObjectId(id));
    revalidatePath("/admin/subcategory");
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw new Error("Failed to delete subcategory.");
  }
}
