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
  subcategories: { name: string; key: string }[];
};

export type PopulatedOrder = {
  _id: string;
  status: string;
  paymentId?: string;
  amount: number;
  createdAt: string | Date;
  products: { title: string; quantity: number }[];
  userId: {
    name: string;
    email: string;
  };
  shippingAddressId: {
    fullName: string;
    phone: string;
    address: string;
  };
};
