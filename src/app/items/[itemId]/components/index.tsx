"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      {/* Main Selected Image */}
      {selectedImage && (
        <div className="mb-6 flex justify-center">
          <Image
            src={selectedImage}
            alt="Selected"
            width={350}
            height={350}
            className="rounded-xl border shadow-md object-contain"
          />
        </div>
      )}

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
        {productImages.map((image) => (
          <Image
            key={image.filename}
            src={image.thumb}
            alt={image.filename}
            width={80}
            height={80}
            className={`rounded-lg border cursor-pointer transition ${
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
