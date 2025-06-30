import { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: string;
  productTitle: string;
  productDescription: string;
  subCategoryKey: string;
  price: number;
  productImages: {
    filename: string;
    thumb: string;
  }[];
}

const productSchema = new Schema<IProduct>({
  productTitle: { type: String, required: true, trim: true },
  productDescription: { type: String, required: true, trim: true },
  subCategoryKey: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  productImages: [
    {
      filename: { type: String, required: true },
      thumb: { type: String, required: true },
      _id: false,
    },
  ],
});

const Product = models.Product || model<IProduct>('Product', productSchema, 'products');
export default Product;
