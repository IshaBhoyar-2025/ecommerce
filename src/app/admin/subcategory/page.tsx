import { getAllSubCategories } from "./actions";
import Link from "next/link";
import { SubCategoryType } from "./actions";
import { DeleteSubCategoryButton } from "./components/DeleteSubcategoriesButton"; // Ensure import is correct

export default async function SubCategoryPage() {
  const subcategories: SubCategoryType[] = await getAllSubCategories();

  return (
    <div className="p-8">
     <h1 className="text-2xl font-bold mb-4">Manage Sub Categories</h1>

<Link
  href="/admin/subcategory/add"
  className="mb-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
>
  Add Category
</Link>

<Link
  href="/admin/dashboard" 
  className="mb-4 inline-block bg-blue-600 hover:bg-blue-700 ml-2 text-white px-4 py-2 rounded-md"
>
  Go To Dashboard
</Link>

      {subcategories.length === 0 ? (
        <p className="text-gray-500">No subcategories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                
                <th className="px-4 py-2 border">Sub Category Name</th>
                <th className="px-4 py-2 border">Sub Category Key</th>
                <th className="px-4 py-2 border">Parent Category Key</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory, index) => (
                <tr key={subcategory._id} className="text-center">
                  <td className="px-4 py-2 border">{subcategory.subCategoryName}</td>
                  <td className="px-4 py-2 border">{subcategory.subCategoryKey}</td>
                  <td className="px-4 py-2 border">{subcategory.parentCategoryKey}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link
                      href={`/admin/subcategory/edit/${subcategory._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </Link>

                    <DeleteSubCategoryButton subcategoryId={subcategory._id.toString()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
