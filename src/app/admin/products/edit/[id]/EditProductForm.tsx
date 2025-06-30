"use client";

import { useState, useEffect, useRef } from "react";
import { updateProduct } from "@/app/admin/products/actions";
import { useRouter } from "next/navigation";
import { AiFillCloseCircle } from "react-icons/ai";
import Image from "next/image";

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
  currentPrice: string;
  currentSubCategoryKey: string;
  productImages: {
    filename: string;
    thumb: string;
  }[];
  categories: Category[];
  subcategories: SubCategory[];
};

export function EditProductForm({
  productId,
  currentTitle,
  currentDescription,
  currentCategoryKey,
  currentPrice,
  currentSubCategoryKey,
  productImages,
  categories,
  subcategories,
}: EditProductFormProps) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [categoryKey, setCategoryKey] = useState(currentCategoryKey);
  const [subCategoryKey, setSubCategoryKey] = useState(currentSubCategoryKey);
  const [price, setPrice] = useState(currentPrice);
  const [error, setError] = useState("");
  const [images, setImages] = useState(productImages);

  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const filtered = subcategories.filter(
      (sub) => sub.parentCategoryKey === categoryKey
    );
    setFilteredSubcategories(filtered);
  }, [categoryKey, subcategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productTitle", title);
    formData.append("productDescription", description);
    formData.append("price", price);
    formData.append("subCategoryKey", subCategoryKey);

    const files = imageInputRef.current?.files;
    if (files) {
      for (const file of files) {
        formData.append("productImages", file);
      }
    }

    const res = await updateProduct(productId, formData, images);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin/products");
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  const handleDelete = (indexToDelete: number) => {
    setImages(images.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
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

      <div>
        <label className="block mb-1 font-medium text-gray-700">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Current Images</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square w-full">
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                aria-label={`Delete image ${index + 1}`}
                type="button"
              >
                <AiFillCloseCircle className="text-red-600 w-6 h-6" />
              </button>

              <Image
                src={`/uploads/${image.thumb}`}
                alt={`Product ${index + 1}`}
                fill
                className="rounded-md border object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Upload New Images</label>
        <input
          type="file"
          name="productImages"
          ref={imageInputRef}
          multiple
          accept="image/*"
          className="w-full"
        />
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
