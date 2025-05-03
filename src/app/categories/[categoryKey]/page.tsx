import {
    getProductsByCategoryKey,
    getSubcategoriesByCategoryKey,
  } from "@/app/actions";
  import Link from "next/link";
  import Header from "@/app/components/Header";  
  
  export default async function CategoryPage({
    params,
  }: {
    params: Promise<{ categoryKey: string }>;
  }) {
    const { categoryKey } = await params;
    const products = await getProductsByCategoryKey(categoryKey);
    const subcategories = await getSubcategoriesByCategoryKey(categoryKey);
  
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
  
        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 py-8 pt-28">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg sm:text-xl font-semibold capitalize mb-4">
              {categoryKey}
            </h2>
  
            <ul className="space-y-3 mb-6">
              {subcategories.map((sub) => (
                <li key={sub.subCategoryKey}>
                  <Link
                    href={`/subcategory/${sub.subCategoryKey}`}
                    className="block text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    {sub.subCategoryName}
                  </Link>
                </li>
              ))}
            </ul>
  
            {/* Price Filter */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-2">Price Range</h4>
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
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {product.productTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.productDescription}
                  </p>
                  <p className="text-xl font-bold text-blue-600">₹10</p>
                </div>
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
  