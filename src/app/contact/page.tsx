import Header from "../components/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-purple-600 mb-4 mt-12">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          We&#39;d love to hear from you! Whether you have questions about products, orders, or feedback — feel free to reach out.
        </p>

        <ul className="text-gray-600 space-y-2">
          <li><strong>Email:</strong> support@shoporia.com</li>
          <li><strong>Phone:</strong> +91 7586965027</li>
          <li><strong>Address:</strong> 12 Market Street, Andheri West, Mumbai, Maharashtra 400058, India</li>
        </ul>
      </main>
    </>
  );
}
