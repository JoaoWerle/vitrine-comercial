const productService = require('../services/productService');
const imageService = require('../services/imageService');

const getProducts = async (req, res) => {
  try {
    const { page = 0, limit = 24, search = '', category = 'all', theme = '' } = req.query;
    const products = await productService.getProducts(parseInt(page), parseInt(limit), search, category, theme);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details', message: error.message });
  }
};

const getProductImages = async (req, res) => {
  try {
    const { sku, title } = req.query;
    const images = await imageService.findImagesBySku(sku, title);
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images', message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, price, description, category, condition, availableQuantity, theme } = req.body;
    let images = [];
    
    if (req.file) {
      images.push(`/img/${req.file.filename}`);
    }

    const newProduct = {
      title,
      price: parseFloat(price) || 0,
      description,
      category,
      condition,
      theme: theme || 'kids',
      availableQuantity: parseInt(availableQuantity) || 0,
      images
    };

    const product = await productService.addProduct(newProduct);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductImages,
  createProduct
};
