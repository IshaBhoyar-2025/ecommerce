"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import mongoose from "mongoose";

// Interfaces
interface ProductImage {
  filename: string;
  thumb: string;
}

interface ProductResult {
  _id: string;
  productTitle: string;
  productDescription: string;
  price: number;
  subCategoryKey: string;
  subCategoryName?: string;
  categoryKey?: string;
  categoryName?: string;
  productImages: ProductImage[];
}

interface ReviewResult {
  _id: string;
  productId: string;
  userId: string;
  text: string;
  rating: number;
  userName: string;
}

// ✅ Get product details by ID
export async function getProductById(productId: string): Promise<ProductResult | null> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(productId)) return null;

  const productData = await Product.aggregate([
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
    { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "categories",
        localField: "subcategory.parentCategoryKey",
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
    productImages: product.productImages.map((img: ProductImage) => ({
      filename: img.filename,
      thumb:img.thumb,
    })),
  };
}

// ✅ Get all reviews for a product with username
export async function getReviews(productId: string): Promise<ReviewResult[]> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(productId)) return [];

  const reviews = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: { $toString: "$_id" },
        productId: { $toString: "$productId" },
        userId: { $toString: "$userId" },
        text: 1,
        rating: 1,
        userName: {
          $ifNull: ["$user.name", "Anonymous"], // adjust to "username" if needed
        },
      },
    },
  ]);

  return reviews;
}

// ✅ Submit a new review (ensure plain object returned)
export async function submitReview({
  productId,
  userId,
  text,
  rating,
}: {
  productId: string;
  userId: string;
  text: string;
  rating: number;
}): Promise<Omit<ReviewResult, "userName">> {
  await connectDB();

  const existing = await Review.findOne({ productId, userId });
  if (existing) {
    throw new Error("You already reviewed this product.");
  }

  const review = new Review({ productId, userId, text, rating });
  await review.save();

  return {
    _id: review._id.toString(),
    productId: review.productId.toString(),
    userId: review.userId.toString(),
    text: review.text,
    rating: review.rating,
  };
}

// ✅ Delete a review
export async function deleteReview(reviewId: string): Promise<void> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(reviewId)) return;
  await Review.findByIdAndDelete(reviewId);
}
