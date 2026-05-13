const Cart = require('../models/cart');
const Product = require('../models/Product');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    // userCart — different name from Cart model
    const userCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images');

    if (!userCart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalPrice: 0 },
      });
    }

    res.status(200).json({
      success: true,
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // userCart — different from Cart model name
    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      // Use Cart.create() not new cart()
      userCart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity: quantity,
            price: product.price,
          },
        ],
        totalPrice: product.price * quantity,
      });
    } else {
      const itemIndex = userCart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        userCart.items[itemIndex].quantity += quantity;
      } else {
        userCart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      // totalPrice — capital P to match schema
      userCart.totalPrice = userCart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      await userCart.save();
    }

    await userCart.populate('items.product', 'name price images');

    res.status(200).json({
      success: true,
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    userCart.items = userCart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    // totalPrice — capital P
    userCart.totalPrice = userCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await userCart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    userCart.items = [];
    userCart.totalPrice = 0;
    await userCart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };