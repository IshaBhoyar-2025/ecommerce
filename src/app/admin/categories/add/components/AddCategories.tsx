'use client';

import { useState } from "react";
import { addCategories } from "@/app/admin/categories/actions";
import { useRouter } from "next/navigation";

export function AddCategories() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    key: "",
  });
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name || !formData.key) {
      setMessage("All fields are required.");
      return;
    }

    const data = new FormData();
    data.set("categoryName", formData.name);
    data.set("categoryKey", formData.key);

    const response = await addCategories(data);

    if (response.error) {
      setMessage(response.error);
    } else if (response.success) {
      setMessage(response.success);
      router.push("/admin/categories");
    }
  }

  const handleCancel = () => {
    router.push("/admin/categories");
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded"
        />
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
