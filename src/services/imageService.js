const fs = require('fs').promises;
const path = require('path');

/**
 * Service to handle local product images
 */
const findImagesBySku = async (sku, title = '') => {
  const imgDir = path.join(__dirname, '../../public/img');
  
  try {
    // Ensure directory exists
    await fs.access(imgDir);
    
    const files = await fs.readdir(imgDir);
    
    // Normalize string for better matching (lowercase, no accents)
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const normalizedSku = sku ? normalize(sku) : null;
    const normalizedTitle = title ? normalize(title) : null;
    
    const productImages = files
      .filter(file => {
        const normalizedFile = normalize(file);
        
        // Match by SKU in parentheses: "(SKU)"
        if (normalizedSku && normalizedFile.includes(`(${normalizedSku})`)) return true;
        
        // Fallback: match by title if it starts with or contains the product title
        if (normalizedTitle && normalizedFile.includes(normalizedTitle)) return true;
        
        return false;
      })
      .sort((a, b) => {
        // Simple sort by number suffix if present (e.g., _1.jpg, _2.jpg)
        const numA = parseInt(a.match(/_(\d+)\./)?.[1] || 0);
        const numB = parseInt(b.match(/_(\d+)\./)?.[1] || 0);
        return numA - numB;
      })
      .map(file => `/img/${file}`);
    
    return productImages;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading image directory:', error);
    return [];
  }
};

module.exports = {
  findImagesBySku
};
