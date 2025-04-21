'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct } from '../../actions'; // Adjust the import path as necessary

type EditProductFormProps = {
  product: {
    id: string;
    productTitle: string;
    productDescription: string;
  };
};

export function EditProductForm({ product }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    productTitle: product.productTitle,
    productDescription: product.productDescription,
  });

  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.set('id', product.id);
    data.set('productTitle', formData.productTitle);
    data.set('productDescription', formData.productDescription);

    const result = await updateProduct(data);

    if (result.error) {
      setMessage(result.error);
    } else {
      router.push('/admin/products');
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Product Title
        <input
          type="text"
          value={formData.productTitle}
          onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </label>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Product Description
        <textarea
          value={formData.productDescription}
          onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          rows={4}
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
