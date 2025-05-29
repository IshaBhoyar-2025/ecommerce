'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '../../actions'; // Adjust as needed

type Category = {
  categoryName: string;
  categoryKey: string;
};

type SubCategory = {
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey: string;
};

type AddProductProps = {
  categories: Category[];
  subcategories: SubCategory[];
};

export function AddProduct({ categories, subcategories }: AddProductProps) {
  const [formData, setFormData] = useState({
    productTitle: '',
    productDescription: '',
    subCategoryKey: '',
    price: '',
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const filtered = subcategories.filter(
      (sub) => sub.parentCategoryKey === selectedCategory
    );
    setFilteredSubcategories(filtered);
    setFormData((prev) => ({ ...prev, subCategoryKey: '' }));
  }, [selectedCategory, subcategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productTitle ||
      !formData.productDescription ||
      !formData.subCategoryKey ||
      !formData.price
    ) {
      setMessage('All fields are required.');
      return;
    }

    const data = new FormData();
    data.set('productTitle', formData.productTitle);
    data.set('productDescription', formData.productDescription);
    data.set('subCategoryKey', formData.subCategoryKey);
    data.set('price', formData.price);

    productImages.forEach((file) => {
      data.append('productImages', file);
    });

    const res = await addProduct(data);

    if (res.error) {
      setMessage(res.error);
    } else {
      router.push('/admin/products');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <input
        type="text"
        value={formData.productTitle}
        onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
        placeholder="Product Title"
        className="w-full px-4 py-2 border rounded"
        required
      />

      <textarea
        value={formData.productDescription}
        onChange={(e) =>
          setFormData({ ...formData, productDescription: e.target.value })
        }
        placeholder="Product Description"
        className="w-full px-4 py-2 border rounded"
        rows={4}
        required
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.categoryKey} value={cat.categoryKey}>
            {cat.categoryName}
          </option>
        ))}
      </select>

      <select
        value={formData.subCategoryKey}
        onChange={(e) => setFormData({ ...formData, subCategoryKey: e.target.value })}
        className="w-full px-4 py-2 border rounded"
        required
      >
        <option value="">Select Subcategory</option>
        {filteredSubcategories.map((sub) => (
          <option key={sub.subCategoryKey} value={sub.subCategoryKey}>
            {sub.subCategoryName}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Product Price"
        className="w-full px-4 py-2 border rounded"
        required
      />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            setProductImages(Array.from(e.target.files));
          }
        }}
        className="w-full"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Product
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </form>
  );
}
