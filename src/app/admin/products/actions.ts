"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// ➕ Add Product with Images
export async function addProduct(formData: FormData) {
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const price = formData.get("price")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();
  const files = formData.getAll("productImages") as File[];

  if (!productTitle || !productDescription || !subCategoryKey || !price) {
    return { error: "All fields are required." };
  }

  const images = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uniqueName = `${uuidv4()}.webp`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const fullPath = path.join(uploadsDir, uniqueName);
    const thumbPath = path.join(uploadsDir, `thumb-${uniqueName}`);

    fs.mkdirSync(uploadsDir, { recursive: true });

    await sharp(buffer).resize(800).toFormat("webp").toFile(fullPath);
    await sharp(buffer).resize(300).toFormat("webp").toFile(thumbPath);

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
      price,
      productImages: images,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { error: "Failed to add product. " + errorMessage };
  }
}

// ✏️ Update Product
export async function updateProduct(
  productId: string,
  formData: FormData,
  images: { filename: string; thumb: string }[] = []
) {
  const title = formData.get("productTitle")?.toString();
  const description = formData.get("productDescription")?.toString();
  const price = formData.get("price")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();
  const files = formData.getAll("productImages") as File[];

  if (!title || !description || !price || !subCategoryKey) {
    return { error: "All fields are required." };
  }

  await connectDB();
  const updatedImages = images || [];

  if (files.length > 0 && files[0].size > 0) {
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uniqueName = `${uuidv4()}.webp`;

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const fullPath = path.join(uploadsDir, uniqueName);
      const thumbPath = path.join(uploadsDir, `thumb-${uniqueName}`);

      fs.mkdirSync(uploadsDir, { recursive: true });

      await sharp(buffer).resize(800).toFormat("webp").toFile(fullPath);
      await sharp(buffer).resize(300).toFormat("webp").toFile(thumbPath);

      updatedImages.push({
        filename: uniqueName,
        thumb: `thumb-${uniqueName}`,
      });
    }
  }

  try {
    await Product.findByIdAndUpdate(productId, {
      productTitle: title,
      productDescription: description,
      price,
      subCategoryKey,
      productImages: updatedImages,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { error: "Failed to update product. " + errorMessage };
  }
}

// ❌ Delete Product
export async function deleteProductById(id: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { error: "Failed to delete product. " + errorMessage };
  }
}

// 📦 Get All Products
export async function getAllProducts() {

  try{
  await connectDB();



  const products = await Product.aggregate([
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
        subCategoryName: "$subCategory.subCategoryName",
        categoryName: "$category.categoryName",
        price: 1,
        productImages: 1,
        subCategoryKey: 1,
        categoryKey: 1,
      },
    },
  ]); 

  return products.map((product) => ({
    _id: product._id.toString(),
    productTitle: product.productTitle,
    productDescription: product.productDescription,
    price: product.price,
    subCategoryKey: product.subCategoryKey,
    categoryKey: product.categoryKey,
    categoryName: product.categoryName,
    subCategoryName: product.subCategoryName,
    productImages: product.productImages,
  }));
} catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

// 🔍 Get Product By ID
export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id);
    return product;
  } catch {
    return null;
  }
}

// 🔍 Get SubCategory by Key
export async function getSubCategoryByKey(subCategoryKey: string) {
  try {
    await connectDB();
    const subCategory = await SubCategory.findOne({ subCategoryKey });
    return subCategory;
  } catch {
    return null;
  }
}
