import { connectDB } from "@/lib/mongodb";
import products from "@/models/Product";
import mongoose from "mongoose";

export async function getProductById(productId: string) {
  await connectDB();
  const productData = await products.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategoryKey",
        foreignField: "subCategoryKey",
        as: "subcategory",
      },
    },
    { $unwind: "$subcategory" },
    {
      $lookup: {
        from: "categories",
        localField: "subcategory.parentCategoryKey",
        foreignField: "categoryKey",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        productDescription: 1,
        price: 1,
        subCategoryKey: 1,
        subCategoryName: "$subcategory.subCategoryName",
        categoryName: "$category.categoryName",
        categoryKey: "$category.categoryKey",
        productImages: 1,
      },
    },
  ]);

  const product = productData[0];
  if (!product) return null;

  return {
    _id: product._id.toString(),
    productTitle: product.productTitle,
    productDescription: product.productDescription,
    price: product.price,
    subCategoryKey: product.subCategoryKey,
    subCategoryName: product.subCategoryName,
    categoryKey: product.categoryKey,
    categoryName: product.categoryName,
    productImages: product.productImages.map((img: any) => ({
      filename: img.filename,
      thumb: `/uploads/${img.thumb}`, // Fixed path
    })),
  };
}
