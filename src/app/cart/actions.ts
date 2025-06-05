"use server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ObjectId } from "mongodb";

export async function getCartProductsByIds(idArray: string[]) {
  await connectDB();

  const objectIds = idArray.map(id => new ObjectId(id));
  const products = await Product.find({ _id: { $in: objectIds } }).lean();

  console.log("Fetched products:", products);

  const result = products.map((product) => ({
    _id: product._id as string,
    productTitle: product.productTitle,
    productDescription: product.productDescription,
    price: product.price,
    productImages: product.productImages,
  }));

  console.log("Mapped products:", result);
  return result;
}
