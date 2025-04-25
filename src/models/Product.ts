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
});

const Product = models.Product || model('Product', productSchema);

export default Product;
