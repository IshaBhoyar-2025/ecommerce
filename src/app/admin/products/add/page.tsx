import { getAllCategories } from "@/app/admin/categories/actions";
import { getAllSubCategories } from "@/app/admin/subcategory/actions";
import {AddProduct} from "./components/AddProduct";

export default async function AddProductPage() {
  const categories = await getAllCategories();
  const subcategories = await getAllSubCategories();

  return <AddProduct categories={categories} subcategories={subcategories} />;
}
