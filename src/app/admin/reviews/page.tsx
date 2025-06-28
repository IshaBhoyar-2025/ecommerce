import { getAllReviewsWithProduct } from "./actions";
import EditReviewButton from "./EditReviewButton";
import DeleteReviewButton from "./DeleteReviewButton";
import Link from "next/link";

export default async function ManageReviewsPage() {
  const reviews = await getAllReviewsWithProduct();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>

      <Link
        href="/admin/dashboard"
        className="mb-4 inline-block bg-blue-600 hover:bg-blue-700 ml-2 text-white px-4 py-2 rounded-md"
      >
        Go To Dashboard
      </Link>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Comment</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="text-sm text-center">
              <td className="p-2 border">
                <Link
                  href={`/items/${review.productId}`}
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                >
                  {review.productName}
                </Link>
              </td>
              <td className="p-2 border">{review.userName}</td>
              <td className="p-2 border">{review.rating}</td>
              <td className="p-2 border">{review.text}</td>
              <td className="p-2 border flex justify-center gap-2">
                <EditReviewButton review={review} />
                <DeleteReviewButton reviewId={review._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
