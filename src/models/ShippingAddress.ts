import mongoose, { Schema, Document } from "mongoose";

export interface ShippingAddressType extends Document {
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: Date;
}

const ShippingAddressSchema = new Schema<ShippingAddressType>({
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ShippingAddress ||
  mongoose.model<ShippingAddressType>("ShippingAddress", ShippingAddressSchema);
