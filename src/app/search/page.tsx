import { searchProducts } from "@/app/actions";
import Link from "next/link";
import SecureImage from "../components/SecureImage";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query?.toLowerCase() || "";
  const results = await searchProducts(query);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">
        Search results for: “{query}”
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="border rounded p-4 shadow hover:shadow-md transition"
            >
              {product.productImages?.[0] && (
                <SecureImage
                  src={product.productImages[0].thumb}
                  alt={product.productTitle}
                  width={150}
                  height={150}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <h2 className="font-semibold text-lg mb-2">
                {product.productTitle}
              </h2>
              <p className="text-sm text-gray-600 mb-2">₹{product.price}</p>
              <p className="text-sm text-gray-500">
                {product.productDescription?.slice(0, 80)}...
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
