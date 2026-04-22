const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/products.json');

class ProductService {
  /**
   * Load all products from JSON file
   */
  async getAllProducts() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading products.json:', error);
      return [];
    }
  }

  /**
   * Get filtered products with pagination
   */
  async getProducts(page = 0, pageSize = 24, search = '', category = 'all') {
    let products = await this.getAllProducts();

    // Filter by Category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Filter by Search Term
    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.sku.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    const totalCount = products.length;
    const startIndex = page * pageSize;
    const pagedData = products.slice(startIndex, startIndex + pageSize);

    return {
      totalCount,
      data: pagedData
    };
  }

  /**
   * Get single product by ID or SKU
   */
  async getProductById(id) {
    const products = await this.getAllProducts();
    return products.find(p => p.productId === id || p.sku === id) || null;
  }

  /**
   * Add a new product to the local database
   */
  async addProduct(newProduct) {
    const products = await this.getAllProducts();
    
    // Generate a unique ID and SKU if not provided
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const sku = `RG-${id.toUpperCase().substr(-6)}`;

    const productWithId = {
      productId: id,
      sku: sku,
      ...newProduct
    };

    products.push(productWithId);
    
    // Save back to JSON
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2), 'utf8');
    
    return productWithId;
  }
}

module.exports = new ProductService();
