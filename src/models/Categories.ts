import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  categoryName: string;
  categoryKey: string;
}

const CategorySchema = new Schema<ICategory>({
  categoryName: { type: String, required: true },
  categoryKey: { type: String, required: true, unique: true }, // Ensuring categoryKey is unique
});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema, 'categories');

export default Category;
