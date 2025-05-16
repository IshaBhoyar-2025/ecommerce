import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  productTitle: {
    type: String,
    required: true,
    trim: true,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
  },
  subCategoryKey: {
    type: String,
    required: true,
    trim: true,
  },
   price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Product = models.Product || model('Product', productSchema, 'products');

export default Product;
