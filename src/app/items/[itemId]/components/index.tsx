// app/components/ProductActions.tsx
"use client";

import Image from "next/image";

interface Props {
  productId: string;
  productImages: { filename: string; thumb: string }[];

}

export function Item({ productId, productImages}: Props) {
  const handleAddToCart = () => {
    console.log("Add to Cart:", { productId,  });
    // TODO: Add product to cart logic here
  };

  const handleBuyNow = () => {
    console.log("Buy Now:", { productId, });
    // TODO: Handle buy now logic here
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
