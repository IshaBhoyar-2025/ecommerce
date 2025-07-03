import Header from "../components/Header";


export default function HelpCenterPage() {
  return (

    <>
      <Header />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6">Help Center</h1>
      <p className="text-gray-700 mb-4 text-sm sm:text-base">
        Welcome to our Help Center! Find answers to common questions and get support for any issues you’re facing.
      </p>
      <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
        <li>Order tracking and delivery status</li>
        <li>Account access and password recovery</li>
        <li>Payment methods and billing</li>
        <li>Returns and refund process</li>
      </ul>
    </main>
    </>
  );
}
