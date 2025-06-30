"use server";

import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function getAllReviewsWithProduct() {
  await connectDB();

  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: { $toString: "$_id" },
        productId: { $toString: "$product._id" },
        productName: "$product.productTitle",
        userName: "$user.name",
        rating: 1,
        text: 1,
      },
    },
  ]);

  return reviews;
}

export async function updateReview(reviewId: string, text: string, rating: number) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(reviewId)) throw new Error("Invalid review ID");

  await Review.findByIdAndUpdate(reviewId, { text, rating });
}

export async function deleteReviewByAdmin(reviewId: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(reviewId)) return;
  await Review.findByIdAndDelete(reviewId);
}
