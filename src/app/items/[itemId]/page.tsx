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

      <main className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 ">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Images + Add to Cart */}
          <Item
            productId={product._id}
            productImages={product.productImages}
          />

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-6 justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.productTitle}
              </h1>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {product.productDescription}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.categoryName && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    Category: {product.categoryName}
                  </span>
                )}
                {product.subCategoryName && (
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    Subcategory: {product.subCategoryName}
                  </span>
                )}
              </div>

              <p className="text-2xl text-green-600 font-semibold mt-2">
                ₹{product.price}
              </p>
            </div>

            {/* Reviews */}
            <div className="pt-4 border-t border-gray-200">
              <ReviewSection productId={product._id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
