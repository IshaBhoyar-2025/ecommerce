import React from "react";
import Link from "next/link";
import { getAllCategories } from "./actions";
import { DeleteCategoryButton } from "./components/DeletecategoriesButton";
import { getCurrentAdmin } from "../actions";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await getAllCategories();

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/categories/add"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
          >
            ➕ Add Category
          </Link>
          <Link
            href="/admin/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            🏠 Go To Dashboard
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Category Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Category Key</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{category.categoryName}</td>
                  <td className="p-3 text-sm text-gray-800">{category.categoryKey}</td>
                  <td className="p-3 space-x-2">
                    <Link
                      href={`/admin/categories/edit/${category._id}`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Edit
                    </Link>
                    <DeleteCategoryButton categoryId={category._id.toString()} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
