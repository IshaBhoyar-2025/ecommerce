"use client";
import { useState } from "react";
import { updateReview } from "./actions";

export default function EditReviewButton({ review }: { review: any }) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState(review.text);
  const [rating, setRating] = useState(review.rating);

  const handleUpdate = async () => {
    await updateReview(review._id, text, rating);
    window.location.reload();
  };

  const handleCancel = () => {
    setShowForm(false);
    setText(review.text); // reset to original
    setRating(review.rating); // reset to original
  };

  return (
    <div>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
        >
          Edit
        </button>
      )}

      {showForm && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
