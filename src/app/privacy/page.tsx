import Header from "../components/Header";


export default function PrivacyPolicyPage() {
  return (

    <>
      <Header />
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-purple-600 mb-4 mt-12">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        At Shoporia, your privacy is important to us. We are committed to protecting your personal information and using it responsibly.
      </p>
      <p className="text-gray-600">
        We only collect necessary data such as name, email, and address to process your orders and provide better service. We never share your data with third parties without your consent.
      </p>
      <p className="text-gray-600 mt-2">
        By using our website, you agree to our terms and data handling practices outlined here.
      </p>
    </main>
    </>
  );
}
