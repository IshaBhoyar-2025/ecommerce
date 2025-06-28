"use client";
import { deleteReviewByAdmin } from "./actions";

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReviewByAdmin(reviewId);
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
    >
      Delete
    </button>
  );
}
