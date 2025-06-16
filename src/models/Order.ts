import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
cartId: String, // Array of cart item objects 
ShippingAddressId: String, // Shipping address ID

  products: Array, // Array of product objects
  amount: Number,
  status: String,
  paymentId: String,
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
