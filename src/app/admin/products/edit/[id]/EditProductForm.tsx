"use client";

import { useState, useEffect } from "react";
import { updateProduct } from "@/app/admin/products/actions";
import { useRouter } from "next/navigation";



type Category = {
  categoryName: string;
  categoryKey: string;
};

type SubCategory = {
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey: string;
};

type EditProductFormProps = {
  productId: string;
  currentTitle: string;
  currentDescription: string;
  currentCategoryKey: string;
  currentSubCategoryKey: string;
  categories: Category[];
  subcategories: SubCategory[];
 
};


export  function EditProductForm ({
  categories,
  productId,
  currentTitle,
  currentDescription,
  currentCategoryKey,
  currentSubCategoryKey,
  subcategories,

}: EditProductFormProps) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [categoryKey, setCategoryKey] = useState(currentCategoryKey);
  const [subCategoryKey, setSubCategoryKey] = useState(currentSubCategoryKey);
  const [error, setError] = useState("");
  const router = useRouter();

  

    const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);

     useEffect(() => {
        const filtered = subcategories.filter(
          (sub) => sub.parentCategoryKey === categoryKey
        );
        setFilteredSubcategories(filtered);
        //setFormData({ ...formData, subCategoryKey: '' });
        // setSubCategoryKey('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [categoryKey]);  
    
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await updateProduct(productId, title, description, categoryKey, subCategoryKey);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin/products");
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    {error && <div className="text-red-600 font-medium">{error}</div>}
  
    <div>
      <label className="block mb-1 font-medium text-gray-700">Product Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    <div>
      <label className="block mb-1 font-medium text-gray-700">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    <div>
      <label className="block mb-1 font-medium text-gray-700">Category</label>
      <select
        value={categoryKey}
        onChange={(e) => setCategoryKey(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((cat) => (
          <option key={cat.categoryKey} value={cat.categoryKey}>
            {cat.categoryName}
          </option>
        ))}
      </select>
    </div>
  
    <div>
      <label className="block mb-1 font-medium text-gray-700">Subcategory</label>
      <select
        value={subCategoryKey}
        onChange={(e) => setSubCategoryKey(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Subcategory</option>
        {filteredSubcategories.map((sub) => (
          <option key={sub.subCategoryKey} value={sub.subCategoryKey}>
            {sub.subCategoryName}
          </option>
        ))}
        
      </select>
    </div>
  
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md w-full sm:w-auto"
      >
        Update
      </button>
  
      <button
        type="button"
        onClick={handleCancel}
        className="bg-red-600 hover:bg-gray-500 transition text-white px-4 py-2 rounded-md w-full sm:w-auto"
      >
        Cancel
      </button>
    </div>
  </form>
  
  );
}
