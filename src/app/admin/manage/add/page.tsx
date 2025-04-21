import { AddSubCategory } from "./components/AddSubCategory";
import { getCurrentAdmin } from "../../actions";
import { redirect } from "next/navigation";
import { getAllCategories } from "../../categories/actions";

export default async function AddSubCategoryPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await getAllCategories();

  return <AddSubCategory categories={categories} />;
}
