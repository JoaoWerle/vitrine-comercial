/**
 * API wrapper for backend communication
 */
const API = {
    baseUrl: '/api',

    async getProducts(page = 0, search = '', category = 'all') {
        try {
            const categoryQuery = category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
            const response = await fetch(`${this.baseUrl}/products?page=${page}&search=${encodeURIComponent(search)}${categoryQuery}`);
            if (!response.ok) throw new Error('Erro ao buscar produtos');
            return await response.json();
        } catch (error) {
            console.error(error);
            return { data: [], totalCount: 0 };
        }
    },

    async getProductImages(sku, title = '') {
        try {
            const response = await fetch(`${this.baseUrl}/products/gallery-images?sku=${encodeURIComponent(sku)}&title=${encodeURIComponent(title)}`);
            if (!response.ok) throw new Error('Erro ao buscar imagens');
            return await response.json();
        } catch (error) {
            console.error(error);
            return { images: [] };
        }
    },

    async getProductById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/products/${id}`);
            if (!response.ok) throw new Error('Erro ao buscar detalhes do produto');
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};
