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

    // Avoid duplicates
    const updatedCart = [
      ...cart.filter((item: string) => item !== productId),
      productId,
    ];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    router.push("/cart"); // Redirect to cart page
  };

  const handleBuyNow = () => {
    console.log("Buy Now:", { productId });
    // Implement direct checkout logic here later
  };

  return (
    <div className="mt-6">
      {productImages.map((image) => (
        <Image
          key={image.filename}
          src={image.thumb}
          alt={image.filename}
          width={200}
          height={200}
          className="rounded-lg shadow-md mb-4"
        />
      ))}

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-md font-semibold"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
