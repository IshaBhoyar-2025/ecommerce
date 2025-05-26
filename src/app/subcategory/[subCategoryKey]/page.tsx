import {
  getProductsBySubCategoryKey,
  getSubcategoriesByCategoryKey,
  getSubCategoriesByCategoryKey,
} from "@/app/actions";

import Header from "@/app/components/Header";
import Link from "next/link";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ subCategoryKey: string }>;
}) {
  const { subCategoryKey } = await params;

  const products = await getProductsBySubCategoryKey(subCategoryKey);
  const categoryKeyArray = await getSubCategoriesByCategoryKey(subCategoryKey);
  const categoryKey =
    Array.isArray(categoryKeyArray) && categoryKeyArray.length > 0
      ? categoryKeyArray[0]
      : "";

  const subcategories = await getSubcategoriesByCategoryKey(categoryKey);

  return (
    <div className="bg-gray-100 min-h-screen mt-20">
      <Header />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 py-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold capitalize mb-4">{categoryKey}</h3>
          <ul className="space-y-3 mb-6">
            {subcategories.map((sub) => (
              <li key={sub.subCategoryKey}>
                <a
                  href={`/subcategory/${sub.subCategoryKey}`}
                  className={`block text-gray-700 hover:text-blue-600 transition font-medium ${sub.subCategoryKey === subCategoryKey
                    ? "text-blue-600 font-bold"
                    : ""
                    }`}
                >
                  {sub.subCategoryName}
                </a>
              </li>
            ))}
          </ul>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-2">
              Price Range
            </h4>
            <input
              type="range"
              min="0"
              max="10000"
              defaultValue="10000"
              className="w-full accent-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">₹0 - ₹10000</p>
          </div>
        </aside>

        {/* Product Cards */}
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <Link href={`/items/${product._id}`}>
                <div>
                  <img
                    src={`/uploads/${product.productImages?.[0]?.thumb || "no-image.jpg"}`}
                    alt={product.productTitle}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {product.productTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.productDescription.length > 30
                      ? product.productDescription.slice(0, 30) + "..."
                      : product.productDescription}
                  </p>

                  <p className="text-xl font-bold text-blue-600">
                    ₹{product.price}
                  </p>
                </div>
              </Link>

              <div className="mt-4 flex gap-2">
                <button className="w-1/2 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-md font-semibold">
                  Add to Cart
                </button>
                <button className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm py-2 rounded-md font-semibold">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
