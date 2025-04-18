import { AddCategories } from "./components/AddCategories";
import { getCurrentAdmin } from "../../actions";
import { redirect } from "next/navigation";

export default async function AddCategoryPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AddCategories />;
}
