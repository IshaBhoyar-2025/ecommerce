"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  productImages: { filename: string; thumb: string }[];
}

export function Item({ productId, productImages }: Props) {
  const router = useRouter();

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...cart.filter((item: string) => item !== productId), productId];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    router.push("/cart");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {productImages.map((image) => (
          <Image
            key={image.filename}
            src={image.thumb}
            alt={image.filename}
            width={200}
            height={200}
            className="rounded-xl border shadow-sm"
          />
        ))}
      </div>

      <div className="mt-auto">
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-full font-medium shadow-sm transition"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
