'use client';

import { useState } from "react";
import { addSubCategory } from "@/app/admin/subcategory/actions"; // Renamed to avoid conflict
import { useRouter } from "next/navigation";

import { CategoryType } from "@/app/admin/categories/actions";

type Props = {
  categories: CategoryType[]; // Assuming you have a type for your categories
};

export function AddSubCategory({ categories }: Props) { 
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    subCategoryName: "",
    subCategoryKey: "",
    parentCategoryKey: "",
  });
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.subCategoryName || !formData.subCategoryKey || !formData.parentCategoryKey) {
      setMessage("All fields are required.");
      return;
    }

    const data = new FormData();
    data.set("subCategoryName", formData.subCategoryName);
    data.set("subCategoryKey", formData.subCategoryKey);
    
    if (formData.parentCategoryKey) {
      data.set("parentCategoryKey", formData.parentCategoryKey);
    }

    const response = await addSubCategory(data);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Category added successfully.");
      router.push("/admin/Subcategories");
    }
  }

  const handleCancel = () => {
    router.push("/admin/Subcategories");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name

        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          value={formData.subCategoryName}
          onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded"
        />
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Key
        <input
          type="text"
          name="categoryKey"
          placeholder="Category Key"
          value={formData.subCategoryKey}
          onChange={(e) => setFormData({ ...formData, subCategoryKey: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded"
        />
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Category Key (optional)
        <select
          name="parentCategoryKey"
          value={formData.parentCategoryKey}
          onChange={(e) => setFormData({ ...formData, parentCategoryKey: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Parent Category</option>
          {/* Replace with actual categories from your database */}
          {categories.map((category) => (
            <option key={category.categoryKey} value={category.categoryKey}>
              {category.categoryName}
            </option>
          ))}

        </select>
        </label>



        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Add
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Cancel
        </button>

        {message && (
          <p className={`text-center text-sm ${message.includes("success") ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
