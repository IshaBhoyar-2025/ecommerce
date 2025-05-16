import { ReactNode } from "react";

// types.ts
export type ProductType = {
    imageUrl: string | undefined;
    productPrice: ReactNode;
    _id: string;
    productTitle: string;
    productDescription: string;
    categoryName?: string;
    subCategoryName?: string;
    price: number;
  };
  
  export type CategoryType = {
    _id: string;
    categoryKey: string;
    categoryName: string;
    subcategories: { name: string; key: string }[]; // assuming this structure
  };
  
  