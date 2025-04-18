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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <Link
        href="/admin/categories/add"
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

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Category Name</th>
            <th className="p-2 border">Category Key</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{category.categoryName}</td>
              <td className="p-2 border">{category.categoryKey}</td>
              <td className="p-2 border space-x-2">
                <Link
                  href={`/admin/categories/edit/${category._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Edit
                </Link>

                <DeleteCategoryButton categoryId={category._id.toString()} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
