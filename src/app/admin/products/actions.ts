"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import { revalidatePath } from "next/cache"




// Add Product
export async function addProduct(formData: FormData) {
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();

  if (!productTitle || !productDescription || !subCategoryKey) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();
    await Product.create({ productTitle, productDescription, subCategoryKey });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to add product. " + error.message };
  }
}

// actions/products.ts

export async function updateProduct(
  productId: string,
  title: string,
  description: string,
  categoryKey: string,
  subCategoryKey: string
) {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        productTitle: title,
        productDescription: description,
        categoryKey,
        subCategoryKey,
      },
      { new: true }
    );
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error: any) {
    return { error: "Failed to update product. " + error.message };
  }
}



// Delete Product
export async function deleteProductById(id: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to delete product. " + error.message };
  }
}

// Get All Products
export async function getAllProducts() {
  await connectDB();
  const products = await Product.find({}).lean();

  return products.map((product: any) => ({
    ...product,
    _id: product._id.toString(),
    categoryId: product.categoryId?.toString(), // if exists
    subCategoryId: product.subCategoryId?.toString(), // if exists
    createdAt: product.createdAt?.toISOString?.(),
    updatedAt: product.updatedAt?.toISOString?.(),
  }));
}




// Get Product By ID
export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id);
    return product;
  } catch (error: any) {
    return null;
  }
}

export async function getSubCategoryByKey(subCategoryKey: string) {
  try {
    await connectDB();
    const subCategory = await SubCategory.findOne({ subCategoryKey });
    return subCategory;
  }
  catch (error: any) {
    return null;
  }
}
