const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// GET /api/products - List with pagination/search
router.get('/', productController.getProducts);

// GET /api/products/gallery-images - Get local images by SKU
router.get('/gallery-images', productController.getProductImages);

// GET /api/products/:id - Single product detail
router.get('/:id', productController.getProductById);

// POST /api/products - Create a new product with image upload
router.post('/', upload.single('image'), productController.createProduct);

module.exports = router;
