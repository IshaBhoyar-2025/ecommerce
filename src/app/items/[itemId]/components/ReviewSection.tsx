"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getReviews,
  submitReview,
  deleteReview,
} from "@/app/items/[itemId]/actions";
import { getCurrentUser } from "@/app/actions";
import { FaStar } from "react-icons/fa";

interface Props {
  productId: string;
}

interface Review {
  _id: string;
  userName: string;
  userId: string;
  text: string;
  rating: number;
}

export default function ReviewSection({ productId }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  // Fetch reviews with proper memoization to avoid dependency warning
  const fetchReviews = useCallback(async () => {
    const res = await getReviews(productId);
    const mappedReviews: Review[] = res.map((r: {
      _id: string;
      userName: string;
      userId: string;
      text: string;
      rating: number;
    }) => ({
      _id: r._id,
      userName: r.userName,
      userId: r.userId,
      text: r.text,
      rating: r.rating,
    }));
    setReviews(mappedReviews);

    if (currentUser) {
      const alreadyReviewed = mappedReviews.some(
        (r) => r.userId === currentUser
      );
      setHasReviewed(alreadyReviewed);
    } else {
      setHasReviewed(false);
    }
  }, [productId, currentUser]);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setCurrentUser(user?._id || null);
      setIsLoggedIn(!!user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !rating) return;

    try {
      await submitReview({ productId, userId: currentUser!, text, rating });
      setText("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      alert(message);
    }
  };

  const handleDelete = async (reviewId: string) => {
    await deleteReview(reviewId);
    fetchReviews();
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 italic">No reviews yet.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {reviews.map((review) => (
            <li key={review._id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{review.userName}</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.text}</p>
              {review.userId === currentUser && (
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-red-600 text-sm mt-2 hover:underline"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isLoggedIn ? (
        <p className="text-sm text-gray-500 italic">
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            log in
          </a>{" "}
          to leave a review.
        </p>
      ) : hasReviewed ? (
        <p className="text-sm text-gray-500 italic">
          You’ve already submitted a review.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3 resize-none"
            required
          />

          <div>
            <p className="font-semibold text-gray-700 mb-2">Rate this product:</p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="rating"
                    value={num}
                    checked={rating === num}
                    onChange={() => setRating(num)}
                    className="accent-yellow-500"
                    required
                  />
                  <span className="text-sm text-gray-600">{num}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
