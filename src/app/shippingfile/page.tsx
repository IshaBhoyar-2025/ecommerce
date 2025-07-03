import Header from "../components/Header";

export default function ShippingPage() {
  return (

    <>
      <Header />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6">Shipping Information</h1>
      <p className="text-gray-700 mb-4 text-sm sm:text-base">
        We offer reliable shipping services across India with various delivery options to suit your needs.
      </p>
      <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
        <li>Standard delivery: 3–5 business days</li>
        <li>Express delivery: 1–2 business days</li>
        <li>Free delivery for orders above ₹500</li>
      </ul>
    </main>
    </>
  );
}
