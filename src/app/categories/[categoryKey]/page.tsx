import CategoryPageContent from "./CategoryPageContent";
import { getProductsByCategoryKey, getSubcategoriesByCategoryKey } from "@/app/actions";

export default async function CategoryPage({
  params,
}: {
  params:Promise< { categoryKey: string }>;
}) {
  const { categoryKey } =  await params;

  const [products, subcategories] = await Promise.all([
    getProductsByCategoryKey(categoryKey),
    getSubcategoriesByCategoryKey(categoryKey),
  ]);

  return (
    <CategoryPageContent
      categoryKey={categoryKey}
      products={products}
      subcategories={subcategories}
    />
  );
}
