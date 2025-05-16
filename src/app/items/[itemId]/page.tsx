import {Item} from "@/app/items/[itemId]/components/";
import { getProductById } from "@/app/items/[itemId]/actions";

export default async function ItemDetailPage({
  params,
}: {
  params: { itemId: string };
}) {
  type Product = {
    _id: any;
    productTitle: any;
    productDescription: any;
    price: any;
    subCategoryKey: any;
    subCategoryName: any;
    image?: string;
  };

  const product: Product | null = await getProductById(params.itemId);

  if (!product) {
    return (
      <div className="mt-20 text-center text-red-600 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen mt-20">
      {/* TODO: Add your actual header component here, e.g. <Header /> or remove this line if not needed */}

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.productTitle}</h1>
        <p className="text-gray-600 mb-4">{product.productDescription}</p>

        <p className="text-xl text-blue-600 font-semibold mb-4">{product.price}</p>

        {product.image && (
          <img
            src={product.image}
            alt={product.productTitle}
            className="w-full max-h-[400px] object-cover mb-4 rounded"
          />
        )}

        <Item productId={product._id.toString()} />
      </div>
    </div>
  );
}
