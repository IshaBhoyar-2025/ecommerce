import { ReactNode } from "react";

// types.ts
export type ProductType = {

  _id: string;
  productTitle: string;
  productDescription: string;
  categoryName?: string;
  subCategoryName?: string;
  price: number;
  productImages: {
    filename: string;
    thumb: string;
  }[];
};

export type CategoryType = {
  _id: string;
  categoryKey: string;
  categoryName: string;
  subcategories: { name: string; key: string }[]; // assuming this structure
};

