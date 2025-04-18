import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  categoryName: string;
  categoryKey: string;
  parentCategoryKey?: string; 
   
}

const CategorySchema = new Schema<ISubCategory>({
  categoryName: { type: String, required: true },
  categoryKey: { type: String, required: true, unique: true }, // Ensuring categoryKey is unique
  parentCategoryKey: { type: String, required:true }, // Optional field for parent category key
});

const SubCategory = mongoose.models.SubCategory || mongoose.model<ISubCategory>("SubCategory", CategorySchema);

export default SubCategory;
