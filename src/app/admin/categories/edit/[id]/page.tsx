import { getCurrentAdmin } from "@/app/admin/actions";
import { getCategoryById, updateCategory } from "../../actions";
import {EditCategoryForm } from "./EditcategoriesForm";
import { redirect } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string } >}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category)
    return <div className="text-center mt-10 text-red-600">Category not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Category</h1>
      <EditCategoryForm
        category={{
          id: category._id.toString(),
          categoryName: category.categoryName,
          categoryKey: category.categoryKey,
        }}
        updateCategory={updateCategory}
      />
    </div>
  );
}
