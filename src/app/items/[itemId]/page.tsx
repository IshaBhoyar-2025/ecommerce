import { Item } from "@/app/items/[itemId]/components/";
import { getProductById } from "@/app/items/[itemId]/actions";
import Link from "next/link";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  type Product = {
    _id: string;
    productTitle: string;
    productDescription: string;
    price: string | number;
    subCategoryKey: string;
    subCategoryName: string;
    productImages: { filename: string; thumb: string }[];
  };

  const product: Product | null = await getProductById((await params).itemId);

  if (!product) {
    return (
      <div className="mt-20 text-center text-red-600 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-24">
      <header className="bg-white shadow-md py-4 px-6 fixed w-full z-10 top-0 left-0 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-blue-600 hover:opacity-80 transition">
          E-Shop
        </Link>
        <div className="flex items-center space-x-6">
          {/* Use a disabled input or separate this to a client component if it should be editable */}
          <input
            type="text"
            placeholder="Search for products"
            className="p-2 border rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"

            readOnly
          />
          <div className="flex space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600">Cart (0)</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.productTitle}</h1>
        <p className="text-gray-600 mb-4">{product.productDescription}</p>
       <p className="text-xl text-blue-600 font-semibold mb-4">₹{product.price}</p>
         
       


        <Item productId={product._id.toString()} productImages={product.productImages} />
      </main>
    </div>
  );
}
