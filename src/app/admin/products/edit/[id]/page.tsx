import { getCurrentAdmin } from "@/app/admin/actions";
import { getProductById, getSubCategoryByKey } from "@/app/admin/products/actions";
import { EditProductForm } from "./EditProductForm";
import { redirect } from "next/navigation";
import { getAllCategories } from "@/app/admin/categories/actions";
import { getAllSubCategories } from "@/app/admin/subcategory/actions";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProductImage = {
  filename: string;
  thumb: string;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const rawProduct = await getProductById((await params).id);
  if (!rawProduct) {
    return <div className="text-center mt-10 text-red-600">Product not found.</div>;
  }

  const subCategory = await getSubCategoryByKey(rawProduct.subCategoryKey);
  if (!subCategory) {
    return <div className="text-center mt-10 text-red-600">Subcategory not found.</div>;
  }

  const product = rawProduct;
  const allCategories = await getAllCategories();
  const allSubcategories = await getAllSubCategories();

  const productImages: ProductImage[] = product.productImages.map((img: unknown) => {
    const image = img as ProductImage;
    return {
      filename: image.filename,
      thumb: image.thumb,
    };
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Edit Product
      </h1>

      <EditProductForm
        productId={(await params).id}
        currentTitle={product.productTitle}
        currentDescription={product.productDescription}
        currentCategoryKey={subCategory.parentCategoryKey}
        currentSubCategoryKey={product.subCategoryKey}
        currentPrice={product.price .toString()}
        categories={allCategories}
        subcategories={allSubcategories}
        productImages={productImages}
      />
    </div>
  );
}
