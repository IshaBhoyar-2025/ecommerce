import { getProductsByCategoryKey } from "@/app/actions";

export default async function CategoryPage({ params }: { params: Promise<{ categoryKey: string }> }) {
  const { categoryKey } = await params;
  const products = await getProductsByCategoryKey(categoryKey);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products in "{categoryKey}"</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product:any) => (
          <div key={product._id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{product.productTitle}</h2>
            <p>{product.productDescription}</p>
            <p className="font-bold text-blue-600">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
