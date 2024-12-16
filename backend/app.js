const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');
const uuid = require('uuid'); 

const app = express();

// Middleware
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(require('cookie-parser')());

app.use(
  session({
    secret: "a57cb2f7c4a1ef3a8a3c6a5bf213d998812de8fc7bb47da8b7347a92f9ec48d9",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://ecommerce:ecommerce@ecommerce.dunf0.mongodb.net/",
      collectionName: 'sessions',
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Routes
app.use('/auth', authRoutes);

// MongoDB Connection
const uri = "mongodb+srv://ecommerce:ecommerce@ecommerce.dunf0.mongodb.net/";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
  category: String,
  rating: Number,
  productId: { type: String, unique: true }, // Added productId field
  inStockValue: Number, // Available stock value
  soldStockValue: Number, // Number of items sold
  visibility: { type: String, default: 'on' } // Visibility field with default 'on'
});

const Product = mongoose.model('Product', productSchema);

// Keep-Alive Route
app.get('/keep-alive', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is up and running'
  });
});

// Create Product Route
app.post('/create-product', async (req, res) => {
  try {
    const productData = req.body;

    // Check if category is valid (optional)
    const validCategories = ["Boys' Wear", "Girls' Wear", "Sarees", "Ganzy Clothes", "Men's Wear", "Women's Wear"];
    if (!validCategories.includes(productData.category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product category',
      });
    }

    // Generate a unique 6-digit productId
    let productId;
    const usedIds = new Set();
    do {
      productId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (usedIds.has(productId));
    
    usedIds.add(productId);

    // Create the product with the assigned productId
    const product = new Product({
      ...productData,
      productId: productId // Add the generated productId to the product data
    });

    const result = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
});


// Get All Products Route
app.get('/get-product', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Update Product Visibility Route
app.put('/update-visibility', async (req, res) => {
  try {
    const { productId, visibility } = req.body;

    // Find and update the product, creating visibility field if it doesn't exist
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      { $set: { visibility: visibility } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product visibility updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product visibility',
      error: error.message
    });
  }
});

// Get Product by ID Route
app.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Update Stock Status Route
app.post('/instock-update', async (req, res) => {
  try {
    const { productId, inStockValue, soldStockValue } = req.body;

    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      {
        $set: {
          inStockValue: inStockValue,
          soldStockValue: soldStockValue
        }
      },
      { new: true, upsert: false }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock status updated successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock status',
      error: error.message
    });
  }
});



// Assign Product ID Route
app.get('/assign-productid', async (req, res) => {
  try {
    // Find all products
    const products = await Product.find();
    
    if (products.length === 0) {
      return res.status(404).send('No products found to assign productIds.');
    }

    // Update each product to add a productId
    const updatedProducts = [];
    const usedIds = new Set(); // Track used IDs to ensure uniqueness

    for (const product of products) {
      let productId;
      // Generate unique 6 digit number
      do {
        productId = Math.floor(100000 + Math.random() * 900000).toString();
      } while (usedIds.has(productId));
      
      usedIds.add(productId);

      const updateResult = await Product.findOneAndUpdate(
        { _id: product._id },
        { $set: { productId } },
        { new: true }
      );

      if (updateResult) {
        updatedProducts.push(updateResult);
      } else {
        console.error(`Failed to update product with ID: ${product._id}`);
      }
    }

    // Save all updated products
    await Promise.all(updatedProducts.map(product => product.save()));

    res.status(200).json({
      success: true,
      message: 'Product IDs assigned successfully',
      products: updatedProducts
    });
  } catch (err) {
    console.error('Error during product ID assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Error assigning product IDs',
      error: err.message
    });
  }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  productsInCart: [
    {
      productId: {
        type: String,
        required: true
      },
      productQty: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

// Add to Cart Route
app.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find existing cart for user
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Cart exists, append new product
      cart.productsInCart.push({
        productId: productId,
        productQty: quantity
      });
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        productsInCart: [{
          productId: productId,
          productQty: quantity
        }]
      });
    }

    // Save cart
    const savedCart = await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart: savedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product to cart',
      error: error.message
    });
  }
});

// Get Cart by User ID Route
app.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for this user'
      });
    }

    res.status(200).json({
      success: true,
      cart: cart.productsInCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});
// Delete Item from Cart Route
app.delete('/delete-items', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    // Find cart by userId
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for this user'
      });
    }

    // Filter out the product to be deleted
    cart.productsInCart = cart.productsInCart.filter(
      item => item.productId !== productId
    );

    // Save updated cart
    const updatedCart = await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully',
      cart: updatedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing product from cart',
      error: error.message
    });
  }
});

// Update Product Quantity in Cart Route
app.put('/update-quantity', async (req, res) => {
  try {
    const { userId, productId, productQty } = req.body;
    
    // Find cart by userId
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for this user'
      });
    }

    // Find and update product quantity
    const productIndex = cart.productsInCart.findIndex(
      item => item.productId === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    cart.productsInCart[productIndex].productQty = productQty;

    // Save updated cart
    const updatedCart = await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product quantity updated successfully',
      cart: updatedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product quantity',
      error: error.message
    });
  }
});

// Address Schema
const addressSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  address: String
});

const Address = mongoose.model('Address', addressSchema);

// Update or Create Address Route
app.post('/update-address', async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Try to find existing address for user
    const existingAddress = await Address.findOne({ userId });

    let result;
    if (existingAddress) {
      // Update existing address
      existingAddress.address = address;
      result = await existingAddress.save();
    } else {
      // Create new address entry
      const newAddress = new Address({
        userId,
        address
      });
      result = await newAddress.save();
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});