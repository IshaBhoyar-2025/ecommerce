// app/components/ProductActions.tsx
"use client";

interface Props {
  productId: string;
}

export  function Item({ productId }: Props) {
  const handleAddToCart = () => {
    console.log("Add to Cart:", productId);
    // Add logic here
  };

  const handleBuyNow = () => {
    console.log("Buy Now:", productId);
    // Add logic here
  };

  return (
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
  );
}
