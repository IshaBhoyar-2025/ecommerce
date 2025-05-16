import { connectDB } from "@/lib/mongodb";
import products from "@/models/Product";

export async function getProductById(productId: string) {
   await connectDB(); // Ensure connectDB returns MongoClient
   const productData = await products.findById(productId);
   if (!productData) {
      throw new Error("Product not found");
   }



   return {
      _id: productData._id.toString(),
      productTitle: productData.productTitle,
      productDescription: productData.productDescription,
      price: productData.price,
      subCategoryKey: productData.subCategoryKey,
      subCategoryName: productData.subCategoryName,
   };

}
