import Header from "../components/Header";

export default function ReturnsPage() {
  return (

    <>
      <Header />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12" >
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6">Returns & Refunds</h1>
      <p className="text-gray-700 mb-4 text-sm sm:text-base">
        Not satisfied with your purchase? No worries. We offer hassle-free returns and full refunds within 10 days of delivery.
      </p>
      <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-2">Return Guidelines:</h2>
      <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
        <li>Items must be unused and in original packaging.</li>
        <li>Request a return via your order page.</li>
        <li>Refunds are processed within 5–7 business days.</li>
      </ul>
    </main>
    </>
  );
}
