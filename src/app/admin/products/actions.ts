"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "@/lib/s3";
import mongoose from "mongoose";

// Interfaces
export interface ProductImage {
  filename: string;
  thumb: string;
}

export interface ProductType {
  _id: string;
  productTitle: string;
  productDescription: string;
  price: number;
  subCategoryKey: string;
  subCategoryName?: string;
  categoryName?: string;
  categoryKey?: string;
  productImages: ProductImage[];
}

// ➕ Add Product
export async function addProduct(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const price = formData.get("price")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();
  const files = formData.getAll("productImages") as File[];

  if (!productTitle || !productDescription || !subCategoryKey || !price) {
    return { error: "All fields are required." };
  }

  const images: ProductImage[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uniqueName = `${uuidv4()}.webp`;

    const fullImage = await sharp(buffer).resize(800).webp().toBuffer();
    const thumbImage = await sharp(buffer).resize(300).webp().toBuffer();

    await uploadToS3(fullImage, uniqueName, "image/webp");
    await uploadToS3(thumbImage, `thumb-${uniqueName}`, "image/webp");

    images.push({
      filename: uniqueName,
      thumb: `thumb-${uniqueName}`,
    });
  }

  try {
    await connectDB();
    await Product.create({
      productTitle,
      productDescription,
      subCategoryKey,
      price: Number(price),
      productImages: images,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error("Add Product Error:", err);
    return { error: "Failed to add product." };
  }
}

// ✏️ Update Product
export async function updateProduct(
  productId: string,
  formData: FormData,
  existingImages: ProductImage[] = []
): Promise<{ success?: boolean; error?: string }> {
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const price = formData.get("price")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();
  const files = formData.getAll("productImages") as File[];

  if (!productTitle || !productDescription || !price || !subCategoryKey) {
    return { error: "All fields are required." };
  }

  await connectDB();

  const updatedImages: ProductImage[] = [...existingImages];

  if (files.length > 0 && files[0].size > 0) {
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uniqueName = `${uuidv4()}.webp`;

      const fullImage = await sharp(buffer).resize(800).webp().toBuffer();
      const thumbImage = await sharp(buffer).resize(300).webp().toBuffer();

      await uploadToS3(fullImage, uniqueName, "image/webp");
      await uploadToS3(thumbImage, `thumb-${uniqueName}`, "image/webp");

      updatedImages.push({
        filename: uniqueName,
        thumb: `thumb-${uniqueName}`,
      });
    }
  }

  try {
    await Product.findByIdAndUpdate(productId, {
      productTitle,
      productDescription,
      price: Number(price),
      subCategoryKey,
      productImages: updatedImages,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error("Update Product Error:", err);
    return { error: "Failed to update product." };
  }
}

// ❌ Delete Product
export async function deleteProductById(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error("Delete Product Error:", err);
    return { error: "Failed to delete product." };
  }
}

// 📦 Get All Products
export async function getAllProducts(): Promise<ProductType[]> {
  try {
    await connectDB();

const products: (Omit<ProductType, "_id"> & { _id: mongoose.Types.ObjectId })[] =
      await Product.aggregate([
        {
          $lookup: {
            from: "subcategories",
            localField: "subCategoryKey",
            foreignField: "subCategoryKey",
            as: "subCategory",
          },
        },
        { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "categories",
            localField: "subCategory.parentCategoryKey",
            foreignField: "categoryKey",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            productTitle: 1,
            productDescription: 1,
            price: 1,
            subCategoryKey: 1,
            productImages: 1,
            subCategoryName: "$subCategory.subCategoryName",
            categoryName: "$category.categoryName",
            categoryKey: "$category.categoryKey",
          },
        },
      ]);

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));
  } catch (err) {
    console.error("Get All Products Error:", err);
    return [];
  }
}

// 🔍 Get Product By ID
export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const product = (await Product.findById(id).lean()) as ProductType | null;
    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
    };
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    return null;
  }
}

// 🔍 Get SubCategory by Key
export async function getSubCategoryByKey(
  subCategoryKey: string
): Promise<{
  _id: string;
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey: string;
} | null> {
  try {
    await connectDB();

    const subCategory = (await SubCategory.findOne({ subCategoryKey }).lean()) as
      | {
          _id: mongoose.Types.ObjectId;
          subCategoryName: string;
          subCategoryKey: string;
          parentCategoryKey: string;
        }
      | null;

    if (!subCategory) return null;

    return {
      ...subCategory,
      _id: subCategory._id.toString(),
    };
  } catch (err) {
    console.error("Get SubCategory Error:", err);
    return null;
  }
}
