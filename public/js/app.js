/**
 * Advanced Multi-Layout Platform Logic
 */

class LayoutRenderer {
    static renderTopBar(theme) {
        const slot = document.getElementById('layout-top-bar-slot');
        if (!slot) return;

        slot.innerHTML = `
            <div class="top-bar">
                <div class="top-bar-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 6H4V4h16v2zm0 2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H4v-8h16v8z"/></svg>
                    <span>${theme.tagline.split('|')[0].trim()}</span>
                </div>
                <div class="top-bar-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    <span>Compra 100% Segura</span>
                </div>
            </div>
        `;
    }

    static renderHeader(theme, handlers) {
        const slot = document.getElementById('layout-header-slot');
        if (!slot) return;

        const isMarket = theme.layoutType === 'utility-sidebar';
        const isExecutive = theme.layoutType === 'minimalist-premium';

        slot.className = `layout-header ${theme.layoutType}`;
        slot.innerHTML = `
            <div class="header-container">
                <a href="/" class="logo">
                     <img src="themes-assets/${theme.id}/logo.png" alt="${theme.logoTitle}" class="site-logo">
                     <span class="logo-text">${theme.logoTitle}</span>
                </a>
                
                ${!isExecutive ? `
                <div class="search-container">
                    <input type="text" id="searchInput" placeholder="O que você está procurando?">
                    <button id="searchBtn">BUSCAR</button>
                </div>
                ` : '<div class="header-spacer"></div>'}

                <div class="header-actions">
                    <button id="themeToggleBtn" class="theme-toggle-btn" title="Alterar Estilo">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
                    </button>
                    <button id="cartBtn" class="cart-toggle-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        <span id="cartBadge" class="cart-badge">0</span>
                    </button>
                </div>
            </div>
        `;

        // Re-attach listeners because we replaced the HTML
        document.getElementById('themeToggleBtn').onclick = handlers.onThemeToggle;
        document.getElementById('cartBtn').onclick = handlers.onCartToggle;

        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.onclick = handlers.onSearch;
            searchInput.onkeypress = (e) => e.key === 'Enter' && handlers.onSearch();
        }
    }

    static renderNavigation(theme, categories, currentCategory, onCategoryChange) {
        const navSlot = document.getElementById('layout-nav-slot');
        const sidebarSlot = document.getElementById('layout-sidebar-slot');

        const isSidebar = theme.layoutType === 'utility-sidebar';
        const targetSlot = isSidebar ? sidebarSlot : navSlot;

        // Clear both slots
        navSlot.innerHTML = '';
        sidebarSlot.innerHTML = '';
        sidebarSlot.style.display = isSidebar ? 'block' : 'none';

        const navHtml = `
            <div class="categories-container ${theme.layoutType}">
                ${isSidebar ? `<h3 class="sidebar-title">Categorias</h3>` : ''}
                <ul class="category-list">
                    <li class="category-item">
                        <a href="#" class="category-link ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
                            ${theme.id === 'kids' ? '<span>🧸</span> ' : ''}Todos
                        </a>
                    </li>
                    ${categories.map(cat => `
                        <li class="category-item">
                            <a href="#" class="category-link ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
                                ${theme.id === 'kids' ? `<span>${this.getKidsIcon(cat)}</span> ` : ''}${cat}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        targetSlot.innerHTML = navHtml;
        targetSlot.querySelectorAll('.category-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                onCategoryChange(link.dataset.category);
            };
        });
    }

    static getKidsIcon(cat) {
        const icons = {
            'Meninas': '👗',
            'Meninos': '👕',
            'Bebês': '🍼',
            'Calçados': '👟',
            'Acessórios': '🎀',
            'Ofertas': '🎁'
        };
        return icons[cat] || '✨';
    }

    static renderBanner(theme) {
        const slot = document.getElementById('layout-banner-slot');
        if (!slot) return;

        slot.innerHTML = `
            <div class="theme-hero-banner ${theme.layoutType}" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('themes-assets/${theme.id}/banner.png')">
                <div class="hero-content">
                    <h1>${theme.tagline.split('|')[0].trim()}</h1>
                    <p>${theme.tagline.split('|')[1]?.trim() || ''}</p>
                    <button class="hero-cta">CONFIRA AGORA</button>
                </div>
            </div>
        `;
    }

    static renderProductCard(product, theme, onAddToCart, onShowDetail) {
        const price = typeof product.price === 'number' ? product.price : 0;
        const priceFormatted = price > 0 ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta';
        const images = product.images || [];

        const card = document.createElement('div');
        card.className = `product-card ${theme.layoutType}`;

        card.innerHTML = `
            <div class="product-tag">${product.condition || 'Novidade'}</div>
            <div class="product-image-wrapper">
                <img src="${encodeURI(images[0]) || 'https://via.placeholder.com/300x200'}" alt="${product.title}" class="product-image">
                <div class="product-overlay">
                    <button class="quick-view-btn">${theme.id === 'executive' ? 'DETALHES' : 'VER DETALHES'}</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${priceFormatted}</div>
                <button class="add-to-cart-btn" data-action="add-to-cart">
                    ${theme.id === 'executive' ? 'ADICIONAR À SELEÇÃO' : (theme.id === 'market' ? 'COMPRAR' : 'ADICIONAR')}
                </button>
            </div>
        `;

        card.onclick = (e) => {
            if (e.target.closest('[data-action="add-to-cart"]')) {
                e.stopPropagation();
                onAddToCart(product);
            } else {
                onShowDetail(product);
            }
        };

        return card;
    }
}

class LayoutManager {
    constructor() {
        this.themes = [];
        this.currentThemeId = localStorage.getItem('vitrine_theme') || 'kids';
        this.themeLink = document.getElementById('theme-link');

        // Cart and State
        this.cart = JSON.parse(localStorage.getItem('rodagigante_cart')) || [];
        this.currentPage = 0;
        this.currentSearch = '';
        this.currentCategory = 'all';
        this.categories = [];

        this.init();
    }

    async init() {
        try {
            const response = await fetch('/themes/themes.json');
            this.themes = await response.json();
            this.applyLayout(this.currentThemeId);
            this.setupStaticListeners();
            this.updateCartUI();
        } catch (error) {
            console.error('LayoutManager Init Error:', error);
        }
    }

    setupStaticListeners() {
        // Product Modal listeners
        document.getElementById('closeModal').onclick = () => {
            document.getElementById('modalOverlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Theme Modal listeners
        document.getElementById('closeThemeModal').onclick = () => {
            document.getElementById('themeModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Cart listeners (static part)
        document.getElementById('closeCart').onclick = () => this.toggleCart();
        document.getElementById('cartOverlay').onclick = () => this.toggleCart();
        document.getElementById('checkoutBtn').onclick = () => this.handleCheckout();

        // Admin listeners
        document.getElementById('adminBtn').onclick = () => {
            document.getElementById('adminModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
        document.getElementById('closeAdminModal').onclick = () => {
            document.getElementById('adminModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        };
        document.getElementById('adminForm').onsubmit = (e) => this.handleAdminSubmit(e);

        // Global back to top
        window.onscroll = () => {
            const btn = document.getElementById('backToTopBtn');
            if (window.scrollY > 500) btn.classList.add('visible');
            else btn.classList.remove('visible');
        };
        document.getElementById('backToTopBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    applyLayout(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (!theme) return;

        this.currentThemeId = themeId;
        localStorage.setItem('vitrine_theme', themeId);
        this.themeLink.href = `themes/${themeId}/theme.css`;

        document.body.className = `layout-${theme.layoutType} theme-${theme.id}`;

        // Update categories from theme config
        this.categories = theme.categories || ['Meninas', 'Meninos', 'Bebês', 'Calçados', 'Acessórios', 'Ofertas'];

        // Full Re-render of structural components
        LayoutRenderer.renderTopBar(theme);
        LayoutRenderer.renderHeader(theme, {
            onThemeToggle: () => this.openThemeModal(),
            onCartToggle: () => this.toggleCart(),
            onSearch: () => this.handleSearch()
        });
        LayoutRenderer.renderNavigation(theme, this.categories, this.currentCategory, (cat) => this.handleCategoryChange(cat));
        LayoutRenderer.renderBanner(theme);

        // Update branding/title
        document.title = theme.logoTitle + " | " + theme.tagline.split('|')[0];
        document.getElementById('og-title')?.setAttribute('content', document.title);
        document.getElementById('og-desc')?.setAttribute('content', theme.description);
        document.getElementById('og-image')?.setAttribute('content', `${window.location.origin}/themes-assets/${theme.id}/banner.png`);

        // Reload products for new grid/card style
        this.loadProducts();
        this.updateCartUI();
        this.renderThemeGrid();
    }

    openThemeModal() {
        document.getElementById('themeModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    toggleCart() {
        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartOverlay');
        drawer.classList.toggle('active');
        if (drawer.classList.contains('active')) {
            overlay.style.display = 'block';
            setTimeout(() => overlay.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 300);
            document.body.style.overflow = 'auto';
        }
    }

    handleSearch() {
        this.currentSearch = document.getElementById('searchInput').value;
        this.currentPage = 0;
        this.loadProducts();
    }

    handleCategoryChange(category) {
        this.currentCategory = category;
        this.currentPage = 0;
        this.applyLayout(this.currentThemeId); // Re-render nav for active state
    }

    async loadProducts() {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = Array(8).fill(`
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `).join('');

        try {
            const theme = this.themes.find(t => t.id === this.currentThemeId);
            const result = await API.getProducts(this.currentPage, this.currentSearch, this.currentCategory, this.currentThemeId);

            grid.innerHTML = '';
            if (!result.data || result.data.length === 0) {
                grid.innerHTML = '<div class="no-results">Nenhum produto encontrado.</div>';
                return;
            }

            result.data.forEach(product => {
                const card = LayoutRenderer.renderProductCard(
                    product,
                    theme,
                    (p) => this.addToCart(p),
                    (p) => this.showProductDetail(p)
                );
                grid.appendChild(card);
            });

            this.renderPagination(result.totalCount);
        } catch (error) {
            grid.innerHTML = '<div class="error-msg">Erro ao carregar produtos.</div>';
        }
    }

    renderPagination(totalCount) {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(totalCount / 24);
        pagination.innerHTML = '';
        if (totalPages <= 1) return;

        for (let i = 0; i < totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            btn.innerText = i + 1;
            btn.onclick = () => {
                this.currentPage = i;
                this.loadProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            pagination.appendChild(btn);
        }
    }

    addToCart(product) {
        const id = product.sku || product.productId;
        const exists = this.cart.find(item => (item.sku || item.productId) === id);
        if (!exists) this.cart.push({ ...product, quantity: 1 });
        else exists.quantity++;

        localStorage.setItem('rodagigante_cart', JSON.stringify(this.cart));
        this.updateCartUI();
        this.toggleCart();
    }

    updateCartUI() {
        const badge = document.getElementById('cartBadge');
        const itemsContainer = document.getElementById('cartItems');
        const totalVal = document.getElementById('cartTotalValue');

        const count = this.cart.reduce((s, i) => s + i.quantity, 0);
        if (badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        if (this.cart.length === 0) {
            itemsContainer.innerHTML = '<div class="empty-cart-msg">Vazio</div>';
            totalVal.innerText = 'R$ 0,00';
            return;
        }

        itemsContainer.innerHTML = '';
        let total = 0;
        this.cart.forEach(item => {
            const p = item.price || 0;
            total += p * item.quantity;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${encodeURI(item.images[0])}" alt="">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div>${item.quantity}x ${p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>
                <button class="remove-item-btn" onclick="layoutManager.removeFromCart('${item.sku || item.productId}')" title="Remover item">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;
            itemsContainer.appendChild(el);
        });
        totalVal.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => (item.sku || item.productId) !== id);
        localStorage.setItem('rodagigante_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    handleCheckout() {
        if (this.cart.length === 0) return;

        let msg = "Olá! Gostaria de pedir:\n\n";
        let total = 0;

        this.cart.forEach(item => {
            const p = item.price || 0;
            const subtotal = p * item.quantity;
            total += subtotal;

            const priceStr = p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const subtotalStr = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            msg += `*${item.title}*\n`;
            msg += `   Quantidade: ${item.quantity}x\n`;
            msg += `   Valor unitário: ${priceStr}\n`;
            msg += `   Subtotal do item: ${subtotalStr}\n\n`;
        });

        const totalStr = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        msg += `*TOTAL DO PEDIDO: ${totalStr}*\n\n`;
        msg += `Aguardo o retorno para alinhar o pagamento e a entrega!`;

        window.open(`https://wa.me/554497387673?text=${encodeURIComponent(msg)}`, '_blank');
    }

    renderThemeGrid() {
        const grid = document.getElementById('themeGrid');
        if (!grid) return;
        grid.innerHTML = '';
        this.themes.forEach(t => {
            const card = document.createElement('div');
            card.className = `theme-card ${this.currentThemeId === t.id ? 'active' : ''}`;
            card.innerHTML = `
                <div class="theme-preview" style="background-image: url('themes-assets/${t.id}/banner.png'); background-size: cover;"></div>
                <h4>${t.name}</h4>
                <p>${t.description}</p>
                <button class="submit-btn">${this.currentThemeId === t.id ? 'ATIVO' : 'APLICAR'}</button>
            `;
            card.onclick = () => this.applyLayout(t.id);
            grid.appendChild(card);
        });
    }

    async handleAdminSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('saveProductBtn');
        btn.disabled = true;
        btn.innerText = 'SALVANDO...';
        try {
            const formData = new FormData(e.target);
            formData.append('theme', this.currentThemeId);
            const response = await fetch('/api/products', { method: 'POST', body: formData });
            if (!response.ok) throw new Error();
            e.target.reset();
            document.getElementById('adminModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            this.loadProducts();
        } catch (error) {
            alert('Erro ao salvar produto.');
        } finally {
            btn.disabled = false;
            btn.innerText = 'SALVAR PRODUTO';
        }
    }

    showProductDetail(product) {
        // Use existing modal logic but could themed in the future
        const overlay = document.getElementById('modalOverlay');
        document.getElementById('detailTitle').innerText = product.title;
        document.getElementById('detailDescription').innerText = product.description || '';
        document.getElementById('detailPrice').innerText = (product.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('detailImage').src = encodeURI(product.images[0]);

        // Populate Meta Info (Stock & Category)
        const catEl = document.getElementById('detailCategory');
        if (catEl) catEl.innerText = product.category || 'Geral';

        const stockContainer = document.getElementById('detailStock');
        const stockEl = document.getElementById('detailStockText');
        const qty = product.availableQuantity || 0;
        if (stockEl && stockContainer) {
            if (qty > 0) {
                stockEl.innerText = `${qty} unidades em estoque`;
                stockContainer.style.color = 'var(--success, #2e7d32)';
            } else {
                stockEl.innerText = 'Esgotado no momento';
                stockContainer.style.color = 'var(--accent, #d32f2f)';
            }
        }

        const actionContainer = document.getElementById('modalActionsContainer');
        actionContainer.innerHTML = `
            <button class="modal-add-cart-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                ADICIONAR AO CARRINHO
            </button>
        `;
        actionContainer.querySelector('button').onclick = () => {
            this.addToCart(product);
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

let layoutManager;
document.addEventListener('DOMContentLoaded', () => {
    layoutManager = new LayoutManager();
    window.layoutManager = layoutManager; // Export to global for inline events
});
