import { getProductById } from "@/app/items/[itemId]/actions";
import { Item } from "@/app/items/[itemId]/components";
import ReviewSection from "@/app/items/[itemId]/components/ReviewSection";
import Header from "@/app/components/Header";

export default async function ItemDetailPage({
  params,
}: {
  params: { itemId: string };
}) {
  const product = await getProductById(params.itemId);

  if (!product) {
    return (
      <div className="mt-20 text-center text-red-600 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-24">
      <Header />

      <main className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {product.productTitle}
        </h1>
        <p className="text-gray-600 mb-4">{product.productDescription}</p>
        <p className="text-xl text-blue-600 font-semibold mb-4">
          ₹{product.price}
        </p>

        <Item
          productId={product._id}
          productImages={product.productImages}
        />

        <ReviewSection productId={product._id} />
      </main>
    </div>
  );
}
