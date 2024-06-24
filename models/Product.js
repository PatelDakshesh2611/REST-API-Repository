import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
});

const Cart = mongoose.model('Cart', productSchema);
export default Cart