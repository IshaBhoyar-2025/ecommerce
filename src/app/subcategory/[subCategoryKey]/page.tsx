import {
  getProductsBySubCategoryKey,
  getSubcategoriesByCategoryKey,
  getSubCategoryByKey,
  getCategoryByKey,
} from "@/app/actions";

import Header from "@/app/components/Header";
import Link from "next/link";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ subCategoryKey: string }>;
}) {
  const { subCategoryKey } = await params;

  // Get products
  const products = await getProductsBySubCategoryKey(subCategoryKey);

  // Get current subcategory (contains parentCategoryKey)
  const currentSubcategory = await getSubCategoryByKey(subCategoryKey);

  // Get parent category
  const parentCategory = currentSubcategory
    ? await getCategoryByKey(currentSubcategory.parentCategoryKey)
    : null;

  // Get all subcategories under this category
  const subcategories = currentSubcategory?.parentCategoryKey
    ? await getSubcategoriesByCategoryKey(currentSubcategory.parentCategoryKey)
    : [];
     
    
  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 py-10 pt-28">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-md sticky top-28 self-start h-fit">
          {/* Parent Category Title */}
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">
            {parentCategory?.categoryName || "Category"}
          </h3>

          {/* Subcategories List */}
          <ul className="space-y-2">
            {subcategories.map((sub) => (
              <li key={sub.subCategoryKey}>
                <Link
                  href={`/subcategory/${sub.subCategoryKey}`}
                  className={`block px-3 py-2 rounded-md transition font-medium ${
                    sub.subCategoryKey === subCategoryKey
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-800 hover:bg-blue-50"
                  }`}
                >
                  {sub.subCategoryName}
                </Link>
              </li>
            ))}
          </ul>

          {/* Current Subcategory Name */}
          {currentSubcategory?.subCategoryName && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">
                Current Subcategory:
              </h4>
              <p className="text-blue-600 font-medium">
                {currentSubcategory.subCategoryName}
              </p>
            </div>
          )}

          {/* Price Filter */}
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Filter by Price
            </h4>
            <input
              type="range"
              min="0"
              max="10000"
              defaultValue="10000"
              className="w-full accent-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">₹0 - ₹10000</p>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <Link href={`/items/${product._id}`} className="block">
                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={`/uploads/${
                      product.productImages?.[0]?.thumb || "no-image.jpg"
                    }`}
                    alt={product.productTitle}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {product.productTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.productDescription.length > 40
                      ? product.productDescription.slice(0, 40) + "..."
                      : product.productDescription}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
              <div className="p-4 mt-auto border-t border-gray-100">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-full font-medium shadow-sm transition">
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
