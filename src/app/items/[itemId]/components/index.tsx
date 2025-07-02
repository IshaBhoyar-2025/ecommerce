"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SecureImage from "@/app/components/SecureImage";

interface Props {
  productId: string;
  productImages: { filename: string; thumb: string }[];
}

export function Item({ productId, productImages }: Props) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(productImages[0]?.thumb);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...cart.filter((item: string) => item !== productId), productId];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6 w-full">
      {/* Selected Main Image */}
      {selectedImage && (
        <div className="mb-6 flex justify-center">
          <SecureImage
            src={selectedImage}
            alt="Selected Product"
            width={400}
            height={400}
            className="rounded-lg object-cover shadow-lg transition-transform hover:scale-105"
          />
        </div>
      )}

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
       {productImages.map((image) => (
        
  <SecureImage
    src={image.thumb} // ✅ correct
    key={image.filename}
    alt={image.filename}
    width={100}
    height={100}
    className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-transform ${
      selectedImage === image.thumb
        ? "ring-2 ring-blue-500 scale-105"
        : "hover:scale-105"
    }`}
    onClick={() => setSelectedImage(image.thumb)}
  />
        ))}
  

      
      </div>

      {/* Add to Cart Button */}
      <div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-full font-medium shadow-lg transition"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
