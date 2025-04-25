import { getCurrentAdmin } from "@/app/admin/actions";
import { getProductById, getSubCategoryByKey } from "@/app/admin/products/actions";
import { EditProductForm } from "./EditProductForm";
import { redirect } from "next/navigation";
import { getAllCategories } from "@/app/admin/categories/actions";
import { getAllSubCategories } from "@/app/admin/subcategory/actions";

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

  const rawProduct = await getProductById(params.id);
  if (!rawProduct) {
    return <div className="text-center mt-10 text-red-600">Product not found.</div>;
  }

  const subCategory = await getSubCategoryByKey(rawProduct.subCategoryKey);
  if (!subCategory) {
    return <div className="text-center mt-10 text-red-600">Subcategory not found.</div>;
  }

  console.log("Subcategory:", subCategory); // Debugging line to check the output

  const product = rawProduct; // Convert Mongoose doc to plain object
  const allCategories = await getAllCategories();
  const allSubcategories = await getAllSubCategories();
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Edit Product
      </h1>

      <EditProductForm
        productId={params.id}
        currentTitle={product.productTitle}
        currentDescription={product.productDescription}
        currentCategoryKey={subCategory.parentCategoryKey}
        currentSubCategoryKey={product.subCategoryKey}
        categories={allCategories}
        subcategories={allSubcategories}
      />
    </div>
  );
}
