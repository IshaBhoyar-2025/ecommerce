import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  subCategoryName: string;
  subCategoryKey: string;
  parentCategoryKey?: string; // Optional in interface
}

const subCategorySchema = new Schema<ISubCategory>({
  subCategoryName: { type: String, required: true },
  subCategoryKey: { type: String, required: true, unique: true },
  parentCategoryKey: { type: String, required: true }, // Marked false here too
});

const SubCategory =
  mongoose.models.SubCategory || mongoose.model<ISubCategory>("SubCategory", subCategorySchema, 'subcategories');

export default SubCategory;
