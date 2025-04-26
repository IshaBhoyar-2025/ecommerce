import { getAllProducts, getAllCategories } from './actions';
import {Home} from "./component";


export type ProductType = {
  _id: string;
  productTitle: string;
  productDescription: string;
  categoryName?: string;
  subCategoryName?: string;
};



export default async function ProductPage() {
  const products: ProductType[] = await getAllProducts();

  const categories = await getAllCategories();
   
  return (
    <Home categories={JSON.parse(JSON.stringify(categories))} products={JSON.parse(JSON.stringify(products))} />
  
  )
}
  
