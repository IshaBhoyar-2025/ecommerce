'use client';

import {deleteProductById} from "@/app/admin/products/actions"; // Adjust the import path as necessary

interface DeleteProductButtonProps {
  productId: string; // Updated to match the productId
}

export const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({ productId }) => {
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProductById(productId); // Use productId here
      alert("Product deleted successfully.");
      window.location.reload(); // Reload the page after deletion
    } catch (error) {
      alert("An error occurred while deleting the product. " + error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
    >
      Delete
    </button>
  );
};
