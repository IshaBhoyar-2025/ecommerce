export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order. Your payment has been received.</p>
        <a
          href="/"
          className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
