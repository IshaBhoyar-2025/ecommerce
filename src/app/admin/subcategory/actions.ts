"use server";

import { connectDB } from "@/lib/mongodb";
import SubCategory from "@/models/SubCategory";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

// Base subcategory type
export type SubCategoryType = {
  _id: string;
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey: string;
};

// Extended type to include parent category name
export type SubCategoryWithParent = SubCategoryType & {
  parentCategoryName?: string;
};

// MongoDB aggregation result type
interface SubCategoryAggregationResult {
  _id: ObjectId;
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey: string;
  parentCategoryName?: string;
}

export async function addSubCategory(formData: FormData) {
  await connectDB();

  const subCategoryName = formData.get("subCategoryName")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();
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
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error adding subcategory:", err.message || error);
    return { error: "Failed to add subcategory." };
  }
}

export async function getAllSubCategories(): Promise<SubCategoryWithParent[]> {
  await connectDB();

  const subcategories = await SubCategory.aggregate<SubCategoryAggregationResult>([
    {
      $lookup: {
        from: "categories",
        localField: "parentCategoryKey",
        foreignField: "categoryKey",
        as: "parentCategory",
      },
    },
    {
      $unwind: {
        path: "$parentCategory",
        preserveNullAndEmptyArrays: true,
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

  return subcategories.map((item) => ({
    _id: item._id.toString(),
    subCategoryName: item.subCategoryName,
    subCategoryKey: item.subCategoryKey,
    parentCategoryKey: item.parentCategoryKey,
    parentCategoryName: item.parentCategoryName || undefined,
  }));
}

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
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error updating subcategory:", err.message || error);
    return { error: "Failed to update subcategory." };
  }
}

export async function deleteSubCategoryById(id: string) {
  await connectDB();

  try {
    await SubCategory.findByIdAndDelete(new ObjectId(id));
    revalidatePath("/admin/subcategory");
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error deleting subcategory:", err.message || error);
    throw new Error("Failed to delete subcategory.");
  }
}
