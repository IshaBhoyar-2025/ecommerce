import { getCurrentAdmin } from "@/app/admin/actions";
import { getSubCategoryById } from "../../actions";
import { EditSubCategoryForm } from "./EditSubCategoryForm";
import { redirect } from "next/navigation";
import { getAllCategories } from "@/app/admin/categories/actions";

export default async function EditSubCategoryPage({ params }: { params: Promise< { id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await getAllCategories();
  if (!categories) {
    return <div className="text-center mt-10 text-red-600">Categories not found.</div>;
  }

  const subCategory = await getSubCategoryById((await params).id);

  if (!subCategory) return <div className="text-center mt-10 text-red-600">Subcategory not found.</div>;
   

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Subcategory</h1>
      <EditSubCategoryForm
        subCategory={{
          id: subCategory._id.toString(),
          subCategoryName: subCategory.subCategoryName,
          subCategoryKey: subCategory.subCategoryKey,
          parentCategoryKey: subCategory.parentCategoryKey,
        }}       
        categories={categories}
        />
    </div>
  );
}

