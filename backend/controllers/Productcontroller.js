const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: foundProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE PRODUCT WITH IMAGE
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // req.files contains uploaded images from multer
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,           // cloudinary URL
          public_id: file.filename, // cloudinary public_id
        }))
      : [];

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Get existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If new images uploaded add them
    let images = existingProduct.images;
    if (req.files && req.files.length > 0) {
      // Delete old images from cloudinary
      for (const img of existingProduct.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      // Set new images
      images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, images },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findById(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from cloudinary
    for (const img of deletedProduct.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};