'use client';

import { useState } from "react";
import { addProduct } from "../../actions"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";

type Props = {
  // You can add any necessary props here if you need categories or other data.
};

export function AddProduct({}: Props) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const title = form.productTitle.value;
    const description = form.productDescription.value;

    if (!title || !description) {
      setMessage("All fields are required.");
      return;
    }

    const data = new FormData();
    data.set("productTitle", title);
    data.set("productDescription", description);

    const response = await addProduct(data);

    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Product added successfully.");
      router.push("/admin/products"); // Adjust path for the products listing page
    }
  }

  const handleCancel = () => {
    router.push("/admin/products"); // Adjust path to cancel and go back to product list
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Title
          <input
            type="text"
            name="productTitle"
            placeholder="Product Title"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Description
          <textarea
            name="productDescription"
            placeholder="Product Description"
            required
            className="w-full px-4 py-2 border rounded"
          ></textarea>
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
