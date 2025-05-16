'use client';

import { useState } from "react";
import { addSubCategory } from "@/app/admin/subcategory/actions";
import { useRouter } from "next/navigation";
import { CategoryType } from "@/app/admin/categories/actions";

type Props = {
  categories: CategoryType[];
};

export function AddSubCategory({ categories }: Props) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form.subCategoryName.value;
    const key = form.subCategoryKey.value;
    const parentKey = form.parentCategoryKey.value;

    if (!name || !key || !parentKey) {
      setMessage("All fields are required.");
      return;
    }

    const data = new FormData();
    data.set("subCategoryName", name);
    data.set("subCategoryKey", key);
    data.set("parentCategoryKey", parentKey);

    const response = await addSubCategory(data);

    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Subcategory added successfully.");
      router.push("/admin/subcategory");
    }
  }

  const handleCancel = () => {
    router.push("/admin/subcategory");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Sub Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SubCategory Name
          <input
            type="text"
            name="subCategoryName"
            placeholder="SubCategory Name"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          SubCategory Key
          <input
            type="text"
            name="subCategoryKey"
            placeholder="SubCategory Key"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Category Key
          <select
            name="parentCategoryKey"
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Parent Category</option>
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
          <p
            className={`text-center text-sm ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
