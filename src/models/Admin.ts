import mongoose, { Schema, Document } from "mongoose";

export interface Iadmin extends Document {
  name: string;
  email: string;
  password: string;
}

const AdminSchema = new Schema<Iadmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model<Iadmin>("Admin", AdminSchema);

export default Admin;
