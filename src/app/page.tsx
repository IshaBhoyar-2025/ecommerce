// app/page.tsx or app/page.jsx
import { getAllProducts } from "./admin/products/actions";
import { getAllCategories } from "./admin/categories/actions";
import { Home } from "./component";

export default async function Page() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return <Home products={products} categories={categories} />;
}
