"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache"

// Add Product
export async function addProduct(formData: FormData) {
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();

  if (!productTitle || !productDescription) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();
    await Product.create({ productTitle, productDescription });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to add product. " + error.message };
  }
}

// Update Product
export async function updateProduct(formData: FormData) {
  const id = formData.get("id")?.toString();
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();

  if (!id || !productTitle || !productDescription) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();
    await Product.findByIdAndUpdate(id, { productTitle, productDescription });
    revalidatePath("/admin/products");
    return { success: true };
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
  try {
    await connectDB();
    const products = await Product.find();
    return products;
  } catch (error: any) {
    return [];
  }
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
export { Product };

