'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function EditCategoryForm({
  category,
  updateCategory,
}: {
  category: { id: string; categoryName: string; categoryKey: string };
  updateCategory: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}) {
  const [categoryName, setCategoryName] = useState(category.categoryName);
  const [categoryKey, setCategoryKey] = useState(category.categoryKey);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('id', category.id);
    formData.set('categoryName', categoryName);
    formData.set('categoryKey', categoryKey);

    const result = await updateCategory(formData);
    if (result.error) {
      setMessage(result.error);
    } else {
      router.push('/admin/categories');
    }
  };

  const handleCancel = () => {
    router.push('/admin/categories');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Category Name
        <input
          type="text"
          placeholder="Category Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
      </label>

      <label>Category Key
        <input
          type="text"
          placeholder="Category Key"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={categoryKey}
          onChange={(e) => setCategoryKey(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Update
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
      >
        Cancel
      </button>
      {message && <p className="text-red-500 text-sm text-center">{message}</p>}
    </form>
  );
}
