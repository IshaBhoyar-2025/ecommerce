"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import { revalidatePath } from "next/cache"




// Add Product
export async function addProduct(formData: FormData) {
  const productTitle = formData.get("productTitle")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const price = formData.get("price")?.toString();
  const subCategoryKey = formData.get("subCategoryKey")?.toString();

  if (!productTitle || !productDescription || !subCategoryKey || !price) {
    return { error: "All fields are required." };
  }

  try {
    await connectDB();
    await Product.create({ productTitle, productDescription, subCategoryKey, price });
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
  price: string,
  categoryKey: string,
  subCategoryKey: string
) {
  console.log("Updating product with price:", price);
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        productTitle: title,
        productDescription: description,
        price,
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
    }
  ]);


  return products.map((product: any) => ({
    _id: product._id.toString(),
    productTitle: product.productTitle,
    productDescription: product.productDescription,
    price: product.price,
    subCategoryKey: product.subCategoryKey,
    categoryKey: product.categoryKey,
    categoryName: product.categoryName,
    subCategoryName: product.subCategoryName,
}
  ));
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
