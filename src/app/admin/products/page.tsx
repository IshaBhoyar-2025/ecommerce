import { getAllProducts } from './actions';
import Link from "next/link";
import { DeleteProductButton } from "./components/DeleteProductButton";

export type ProductType = {
  categoryKey: string;
  _id: string;
  productTitle: string;
  productDescription: string;
  price: number;
  subCategoryKey: string; 
  categoryName?: string;
  subCategoryName?: string;
};



export default async function ProductPage() {
  const products: ProductType[] = await getAllProducts();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      <Link
        href="/admin/products/add"
        className="mb-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
      >
        Add Product
      </Link>

      <Link
        href="/admin/dashboard"
        className="mb-4 inline-block bg-blue-600 hover:bg-blue-700 ml-2 text-white px-4 py-2 rounded-md"
      >
        Go To Dashboard
      </Link>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
          <thead>
  <tr className="bg-gray-100">
    <th className="px-4 py-2 border">Product Title</th>
    <th className="px-4 py-2 border">Product Description</th>
    <th className="px-4 py-2 border"> Price</th>
    <th className="px-4 py-2 border">Category Name</th>
    <th className="px-4 py-2 border">Subcategory Name</th>
    <th className="px-4 py-2 border">Actions</th>
  </tr>
</thead>
<tbody>
  {products.map((product) => (
    <tr key={product._id} className="text-center">
      <td className="px-4 py-2 border">{product.productTitle}</td>
      <td className="px-4 py-2 border">{product.productDescription}</td>
      <td className="px-4 py-2 border">{product.price}</td>
      <td className="px-4 py-2 border">{product.categoryName }</td>
      <td className="px-4 py-2 border">{product.subCategoryName}</td>

      <td className="px-4 py-2 border space-x-2">
        <Link
          href={`/admin/products/edit/${product._id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
        >
          Edit
        </Link>
        <DeleteProductButton productId={product._id.toString()} />
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>
      )}
    </div>
  );
}
