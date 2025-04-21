'use client';

import { deleteSubCategoryById } from "@/app/admin/subcategory/actions";

interface DeleteSubCategoryButtonProps {
  subcategoryId: string; // Updated to match the subcategoryId
}

export const DeleteSubCategoryButton: React.FC<DeleteSubCategoryButtonProps> = ({ subcategoryId }) => {
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this subcategory?");
    if (!confirmDelete) return;

    try {
      await deleteSubCategoryById(subcategoryId); // Use subcategoryId here
    } catch (error) {
      alert("An error occurred while deleting the subcategory. " + error);
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
