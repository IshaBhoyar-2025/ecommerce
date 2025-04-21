import { getCurrentAdmin } from "@/app/admin/actions";
import { getProductById } from "@/app/admin/products/actions";
import { EditProductForm } from "./EditProductForm";
import { redirect } from "next/navigation";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const product = await getProductById(params.id);

  // Check if the product is null or not found
  if (!product) {
    return <div className="text-center mt-10 text-red-600">Product not found.</div>;
  }

  // Render the form to edit the product
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <EditProductForm
        product={{
          id: product._id.toString(),
          productTitle: product.productTitle,
          productDescription: product.productDescription,
        }}
      />
    </div>
  );
}
