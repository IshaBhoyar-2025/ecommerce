import Header from "../components/Header";  

export default function FAQPage() {
  return (

    <>
      <Header />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6">Frequently Asked Questions</h1>

      <div className="space-y-6 text-gray-700 text-sm sm:text-base">
        <div>
          <h2 className="font-semibold text-lg sm:text-xl">1. How do I place an order?</h2>
          <p>Add items to cart and proceed to checkout. Follow the steps to enter your address and payment.</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg sm:text-xl">2. Can I cancel or modify my order?</h2>
          <p>You can cancel or change your order before it is shipped. After that, you’ll need to request a return.</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg sm:text-xl">3. What payment options are available?</h2>
          <p>We accept UPI, debit/credit cards, net banking, and cash on delivery.</p>
        </div>
      </div>
    </main>
    </>
  );
}
