import Header from "../components/Header";


export default function AboutPage() {
  return (

    <>
      <Header />
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-purple-600 mb-4 mt-12">About Us</h1>
      <p className="text-gray-700 text-lg mb-4">
        Welcome to <strong>Shoporia</strong>, your one-stop destination for the latest electronics, fashion, and lifestyle essentials. 
        We’re passionate about helping you discover the best products at the best prices.
      </p>
      <p className="text-gray-600">
        Our goal is to create a seamless shopping experience with top-tier service, fast delivery, and 24/7 support.
        Thank you for choosing us!
      </p>
    </main>
    </>
  );
}
