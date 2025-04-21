'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSubCategory } from "../../actions";


type EditSubCategoryFormProps = {
  subCategory: {
    id: string;
    subCategoryName: string;
    subCategoryKey: string;
    parentCategoryKey?: string;
  };
  categories: {
    categoryName: string;
    categoryKey: string;
  }[];
};

export function EditSubCategoryForm({
  subCategory,
  categories,
}: EditSubCategoryFormProps) {
  const [formData, setFormData] = useState({
    subCategoryName: subCategory.subCategoryName,
    subCategoryKey: subCategory.subCategoryKey,
    parentCategoryKey: subCategory.parentCategoryKey?.trim() || '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.set('id', subCategory.id);
    data.set('subCategoryName', formData.subCategoryName);
    data.set('subCategoryKey', formData.subCategoryKey);
    data.set('parentCategoryKey', formData.parentCategoryKey);

    const result = await updateSubCategory(data);
    if (result.error) {
      setMessage(result.error);
    } else {
      router.push('/admin/subcategory');
    }
  };

  const handleCancel = () => {
    router.push('/admin/subcategory');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Subcategory Name
        <input
          type="text"
          value={formData.subCategoryName}
          onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </label>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Subcategory Key
        <input
          type="text"
          value={formData.subCategoryKey}
          onChange={(e) => setFormData({ ...formData, subCategoryKey: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
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
          {categories.map((category) => (
            <option
              key={category.categoryKey}
              value={category.categoryKey}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
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
