  // controllers/cartController.js
  import Product from '../models/Product.js';

  // Add or update a product in the user's cart
  export const addOrUpdateProduct = async (req, res) => {
    const { id, quantity } = req.body;
    const user_id = req.user.userId; // Extract user ID from authenticated user

    try {
      let product = await Product.findOne({ user_id, id });

      if (product) {
        // Product already exists, update quantity
        product.quantity += quantity;
      } else {
        // Product does not exist, create new
        product = new Product({
          user_id,
          id,
          title: req.body.title,
          description: req.body.description,
          rating: req.body.rating,
          quantity,
          price: req.body.price,
          images: req.body.images,
        });
      }

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Error adding/updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Add multiple products to the user's cart
  export const addBulkProducts = async (req, res) => {
    const user_id = req.user.userId; // Extract user ID from authenticated user
    const products = req.body;
    try {
      for (const product of products) {
        let existingProduct = await Product.findOne({ user_id, id: product.id });
         
        if (existingProduct) {
          // Product already exists, update it
          existingProduct.title = product.title;
          existingProduct.description = product.description;
          existingProduct.rating = product.rating;
          existingProduct.price = product.price;
          existingProduct.images = product.images;
          existingProduct.quantity += product.quantity;

          await existingProduct.save();
        } else {
          // Product does not exist, create new
          const newProduct = new Product({
            user_id,
            id: product.id,
            title: product.title,
            description: product.description,
            rating: product.rating,
            quantity: product.quantity,
            price: product.price,
            images: product.images,
          });

          await newProduct.save();
        }
      }
      const allProducts=await Product.find({user_id})

      res.status(200).json({ message: 'Products added/updated successfully' ,products:allProducts});
    } catch (error) {
      console.error('Error adding/updating products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  // Increment quantity of a product in the user's cart
  export const incrementProductQuantity = async (req, res) => {
    const { id } = req.body;
    const user_id = req.user.userId; // Extract user ID from authenticated user

    try {
      const product = await Product.findOneAndUpdate(
        { user_id, id },
        { $inc: { quantity: 1 } },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Error incrementing product quantity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Decrement quantity of a product in the user's cart
  export const decrementProductQuantity = async (req, res) => {
    const { id } = req.body;
    const user_id = req.user.userId; // Extract user ID from authenticated user

    try {
      const product = await Product.findOneAndUpdate(
        { user_id, id },
        { $inc: { quantity: -1 } },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Remove product from cart if quantity is zero
      if (product.quantity === 0) {
        await Product.findOneAndDelete({ user_id, id });
        return res.status(204).end();
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Error decrementing product quantity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get all products in the user's cart
  export const getUserCart = async (req, res) => {
    const user_id = req.user.userId; // Extract user ID from authenticated user

    try {
      const products = await Product.find({ user_id });
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching user cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Remove a product from the user's cart
export const removeProductFromCart = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId; // Extract user ID from authenticated user

  try {
    const product = await Product.findOneAndDelete({ user_id, id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear all products from the user's cart
export const clearUserCart = async (req, res) => {
  const user_id = req.user.userId; // Extract user ID from authenticated user

  try {
    await Product.deleteMany({ user_id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  