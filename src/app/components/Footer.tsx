import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-700">

                {/* Brand Info */}
                <div>
                    <Link href="/" className="inline-block">
                        <h2 className="text-2xl font-bold text-purple-600 mb-3 hover:underline">Shoporia</h2>
                    </Link>
                    <p className="text-sm text-gray-500 mb-4">
                        Discover the best deals on electronics, fashion, appliances, and more.
                    </p>
                    <div className="flex space-x-4 mt-2 text-purple-600 text-xl">
                        <a href="#" aria-label="Facebook"><FaFacebookF className="hover:text-purple-800 transition" /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram className="hover:text-purple-800 transition" /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter className="hover:text-purple-800 transition" /></a>
                        <a href="#" aria-label="LinkedIn"><FaLinkedinIn className="hover:text-purple-800 transition" /></a>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/categories/electronics" className="hover:text-purple-600">
                                Electronics
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/fashion" className="hover:text-purple-600">
                                Fashion
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/home-appliance" className="hover:text-purple-600">
                                Home Appliance
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/books" className="hover:text-purple-600">
                                Books
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/accessories" className="hover:text-purple-600">
                                Accessories
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/about" className="hover:text-purple-600">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-purple-600">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy" className="hover:text-purple-600">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Customer Support */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/help" className="hover:text-purple-600">
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link href="/returns" className="hover:text-purple-600">
                                Returns & Refunds
                            </Link>
                        </li>
                        <li>
                            <Link href="/shippingfile" className="hover:text-purple-600">
                                Shipping Info
                            </Link>
                        </li>
                        <li>
                            <Link href="/faq" className="hover:text-purple-600">
                                FAQs
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-sm text-gray-400 py-4 border-t mt-6 px-4">
                &copy; {new Date().getFullYear()} Shoporia. All rights reserved.
            </div>
        </footer>
    );
}
