import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import { signup, login,checkToken } from './controllers/authController.js';
import {authenticateToken} from './middlewares/authenticateToken.js';
import {
  addOrUpdateProduct,
  incrementProductQuantity,
  decrementProductQuantity,
  getUserCart,
  addBulkProducts,
  removeProductFromCart,
  clearUserCart
} from './controllers/cartController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Authentication routes
app.post('/api/signup', signup);
app.post('/api/login', login);

// Cart routes with individual middleware
app.post('/api/cart/addOrUpdateProduct', authenticateToken, addOrUpdateProduct);
app.put('/api/cart/incrementProductQuantity', authenticateToken, incrementProductQuantity);
app.put('/api/cart/decrementProductQuantity', authenticateToken, decrementProductQuantity);
app.get('/api/cart/getUserCart', authenticateToken, getUserCart);
app.post('/api/auth/checkToken', checkToken);
app.post('/api/addBulkProducts', authenticateToken, addBulkProducts);
app.delete('/api/cart/removeProduct/:id', authenticateToken, removeProductFromCart); // Add the new route
app.delete('/api/cart/clearCart', authenticateToken, clearUserCart);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});