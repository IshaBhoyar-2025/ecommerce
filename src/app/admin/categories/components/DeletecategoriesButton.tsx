'use client';
import { deleteCategoryById } from "@/app/admin/categories/actions";

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export const DeleteCategoryButton: React.FC<DeleteCategoryButtonProps> = ({ categoryId }) => {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategoryById(categoryId);
    } catch (error) {
      alert("An error occurred while deleting the category. " + error);
    }
  };

  return (
    <input
      type="button"
      value="Delete"
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
    />
  );
};
