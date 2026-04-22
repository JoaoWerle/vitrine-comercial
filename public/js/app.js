/**
 * Main application logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');

    const categoryLinks = document.querySelectorAll('.category-link');
    const detailInstallments = document.getElementById('detailInstallments');
    const detailPix = document.getElementById('detailPix');
    const whatsappBuyBtn = document.getElementById('whatsappBuyBtn');
    
    // Gallery elements
    const prevImg = document.getElementById('prevImg');
    const nextImg = document.getElementById('nextImg');
    const imageDots = document.getElementById('imageDots');

    let currentPage = 0;
    let currentSearch = '';
    let currentCategory = 'all';
    
    // Cart elements
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalValue = document.getElementById('cartTotalValue');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const backToTopBtn = document.getElementById('backToTopBtn');

    // Admin elements
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const adminForm = document.getElementById('adminForm');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('rodagigante_cart')) || [];
    let currentImages = [];
    let currentImageIndex = 0;

    // Initialize
    loadProducts();
    updateCartUI();

    // Event Listeners
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function toggleCart() {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        if (cartDrawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        currentSearch = searchInput.value;
        currentPage = 0;
        loadProducts();
    });

    searchInput.value = ''; // Clear on load
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value;
            currentPage = 0;
            loadProducts();
        }
    });

    // Category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            currentCategory = link.dataset.category;
            currentPage = 0;
            loadProducts();
            
            // Close mobile menu if it was open (future feature)
        });
    });

    closeModal.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Gallery Nav
    prevImg.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateGalleryUI();
    });
    
    nextImg.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateGalleryUI();
    });

    // Admin Modal Listeners
    adminBtn.addEventListener('click', () => {
        adminModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeAdminModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = adminForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'SALVANDO...';

        try {
            const formData = new FormData(adminForm);
            
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Falha ao cadastrar produto');

            showToast('Produto cadastrado com sucesso!', 'success');
            adminForm.reset();
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reload products
            currentPage = 0;
            loadProducts();

        } catch (error) {
            console.error(error);
            showToast('Erro ao cadastrar produto. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'SALVAR PRODUTO';
        }
    });

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Fetch and render products
     */
    async function loadProducts() {
        productGrid.innerHTML = '<div class="loader">Buscando produtos...</div>';
        
        try {
            const result = await API.getProducts(currentPage, currentSearch, currentCategory);
            renderProducts(result.data || []);
            renderPagination(result.totalCount || 0);
        } catch (error) {
            productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem;">Erro ao carregar produtos.</div>';
        }
    }

    /**
     * Render product cards
     */
    function renderProducts(products) {
        if (products.length === 0) {
            productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">Nenhum produto encontrado nesta categoria.</div>';
            return;
        }

        productGrid.innerHTML = '';
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.index = index; // Store index for the modal
            
            // Format price
            const isPriceAvailable = typeof product.price === 'number' && product.price > 0;
            const priceFormatted = isPriceAvailable 
                ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'Sob consulta';

            // Calculate installments (12x)
            const installmentValue = isPriceAvailable ? (product.price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null;
            
            // Random condition for demo purposes
            const conditions = ['Lançamento', 'Novidade', 'Coleção 2026'];
            const condition = product.condition || conditions[Math.floor(Math.random() * conditions.length)];

            const images = product.images || [];
            const hasMultipleImages = images.length > 1;

            card.innerHTML = `
                <div class="product-tag">${condition}</div>
                <div class="product-image-wrapper">
                    ${hasMultipleImages ? `
                        <button class="grid-gallery-nav prev" data-action="prev">‹</button>
                        <button class="grid-gallery-nav next" data-action="next">›</button>
                        <div class="grid-image-dots">
                            ${images.map((_, i) => `<div class="grid-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
                        </div>
                    ` : ''}
                    <img src="${encodeURI(images[0]) || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}" 
                         alt="${product.title}" 
                         class="product-image" 
                         loading="lazy"
                         data-current-img="0">
                </div>
                <div class="product-info">
                    <span class="product-code">Cód: ${product.sku || product.productId}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price-container">
                        <div class="product-price">${priceFormatted}</div>
                        ${isPriceAvailable ? `
                            <div class="product-installments">ou 12x de ${installmentValue}</div>
                            <span class="product-pix-tag">2% OFF NO PIX</span>
                        ` : ''}
                    </div>
                </div>
                <div class="product-card-footer">
                    <button class="add-to-cart-btn" data-action="add-to-cart">
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
            `;

            productGrid.appendChild(card);
        });

        // Use event delegation for all interactions in the grid
        productGrid.onclick = (e) => {
            const navBtn = e.target.closest('.grid-gallery-nav');
            const dot = e.target.closest('.grid-dot');
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            const card = e.target.closest('.product-card');
            
            if (!card) return;
            
            const product = products[card.dataset.index];
            const images = product.images || [];

            if (navBtn || dot) {
                e.stopPropagation();
                const img = card.querySelector('.product-image');
                let current = parseInt(img.dataset.currentImg);
                
                if (navBtn) {
                    if (navBtn.dataset.action === 'prev') {
                        current = (current - 1 + images.length) % images.length;
                    } else {
                        current = (current + 1) % images.length;
                    }
                } else if (dot) {
                    const dots = Array.from(card.querySelectorAll('.grid-dot'));
                    current = dots.indexOf(dot);
                }
                
                img.src = encodeURI(images[current]);
                img.dataset.currentImg = current;
                
                // Update dots
                const dots = card.querySelectorAll('.grid-dot');
                dots.forEach((d, i) => {
                    d.classList.toggle('active', i === current);
                });
            } else if (addToCartBtn) {
                e.stopPropagation();
                addToCart(product);
                toggleCart(); // Show the cart after adding
            } else {
                // Open modal
                showProductDetail(product);
            }
        };
    }

    /**
     * Render pagination buttons
     */
    function renderPagination(totalCount) {
        const pageSize = 24;
        const totalPages = Math.ceil(totalCount / pageSize);
        
        pagination.innerHTML = '';
        if (totalPages <= 1) return;

        let start = Math.max(0, currentPage - 2);
        let end = Math.min(totalPages, start + 5);
        if (end - start < 5) start = Math.max(0, end - 5);

        for (let i = start; i < end; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.innerText = i + 1;
            btn.addEventListener('click', () => {
                currentPage = i;
                loadProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(btn);
        }
    }

    /**
     * Show product details in modal
     */
    async function showProductDetail(product) {
        const isPriceAvailable = typeof product.price === 'number' && product.price > 0;
        
        detailTitle.innerText = product.title;
        detailCode.innerText = `SKU: ${product.sku || product.productId}`;
        
        detailPrice.innerText = isPriceAvailable 
            ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'Preço sob consulta';

        if (isPriceAvailable) {
            const instVal = (product.price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const pixVal = (product.price * 0.98).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            detailInstallments.innerText = `ou em até 12x de ${instVal} sem juros`;
            detailPix.innerHTML = `Pague apenas <strong>${pixVal}</strong> no PIX (2% de desconto)`;
            detailInstallments.classList.remove('hidden');
            detailPix.classList.remove('hidden');
        } else {
            detailInstallments.classList.add('hidden');
            detailPix.classList.add('hidden');
        }
        
        detailStock.innerHTML = `
            <span style="font-weight: 600; color: var(--text-main);">Disponibilidade:</span> 
            <span class="${product.availableQuantity > 0 ? 'stock-in' : 'stock-out'}">
                ${product.availableQuantity > 0 ? `Em estoque (${product.availableQuantity} unidades)` : 'Esgotado'}
            </span>
        `;
        
        detailDescription.innerText = product.description || 'Produto de alta qualidade selecionado com carinho pela Roda Gigante.';

        // WhatsApp Link
        const message = `Olá! Tenho interesse no produto:
*${product.title}*
Código: ${product.sku || product.productId}
Valor: ${isPriceAvailable ? detailPrice.innerText : 'A consultar'}`;

        const waNumber = '554497387673'; 
        const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
        
        // Product Action Buttons in Modal
        const actionContainer = document.createElement('div');
        actionContainer.className = 'modal-actions';
        
        // Clear previous buttons if any (though they are hardcoded, we will replace the flow)
        // Find existing buttons or container
        const existingActions = document.querySelector('.modal-details .modal-action-buttons');
        if (existingActions) existingActions.remove();

        // Let's modify the buttons in the modal
        const detailActions = document.createElement('div');
        detailActions.className = 'modal-action-buttons';
        detailActions.innerHTML = `
            <button id="modalAddToCart" class="modal-add-cart-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4.4c.09-.16.14-.36.14-.58C21.84 3.37 21.47 3 21 3H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.67-1.18z"/>
                </svg>
                ADICIONAR AO CARRINHO
            </button>
            <a href="${waLink}" class="whatsapp-btn-primary" target="_blank">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                OU NEGOCIAR AGORA
            </a>
        `;

        // Replace the static WhatsApp buttons with our dynamic container
        const modalBody = document.querySelector('.modal-details');
        const desc = document.getElementById('detailDescription');
        
        // Remove existing whatsapp buttons
        const oldBtn1 = document.getElementById('whatsappBuyBtn');
        const oldBtn2 = document.getElementById('whatsappBtn');
        if (oldBtn1) oldBtn1.remove();
        if (oldBtn2) oldBtn2.remove();

        modalBody.insertBefore(detailActions, desc);

        document.getElementById('modalAddToCart').onclick = () => {
            addToCart(product);
            toggleCart(); // Show the cart after adding
        };

        // Gallery logic: Fetch local images by SKU or Title
        currentImages = product.images || [];
        const localImages = await API.getProductImages(product.sku || product.productId, product.title);
        
        if (localImages.images && localImages.images.length > 0) {
            currentImages = localImages.images;
        }
        
        currentImageIndex = 0;
        updateGalleryUI();

        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function updateGalleryUI() {
        if (currentImages.length === 0) {
            detailImage.src = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
            prevImg.style.display = 'none';
            nextImg.style.display = 'none';
            imageDots.innerHTML = '';
            return;
        }

        detailImage.src = encodeURI(currentImages[currentImageIndex]);
        
        // Show/Hide nav buttons
        if (currentImages.length > 1) {
            prevImg.style.display = 'flex';
            nextImg.style.display = 'flex';
            
            // Update dots
            imageDots.innerHTML = '';
            currentImages.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = `dot ${i === currentImageIndex ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    currentImageIndex = i;
                    updateGalleryUI();
                });
                imageDots.appendChild(dot);
            });
        } else {
            prevImg.style.display = 'none';
            nextImg.style.display = 'none';
            imageDots.innerHTML = '';
        }
    }

    /**
     * Cart Functions
     */
    function addToCart(product) {
        const id = product.sku || product.productId;
        const exists = cart.find(item => (item.sku || item.productId) === id);
        
        if (!exists) {
            cart.push({
                ...product,
                quantity: 1
            });
            saveCart();
            updateCartUI();
        } else {
            // Optional: Increment quantity
            exists.quantity++;
            saveCart();
            updateCartUI();
        }
        
        // Simple visual feedback
        const badge = document.getElementById('cartBadge');
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }

    function removeFromCart(id) {
        cart = cart.filter(item => (item.sku || item.productId) !== id);
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        localStorage.setItem('rodagigante_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Update badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';

        // Update items list
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Seu carrinho está vazio</div>';
            cartTotalValue.innerText = 'R$ 0,00';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            return;
        }

        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        cartItemsContainer.innerHTML = '';
        
        let total = 0;

        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            
            const price = typeof item.price === 'number' ? item.price : 0;
            total += price * item.quantity;
            
            const priceFormatted = price > 0 
                ? (price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'Sob consulta';

            itemEl.innerHTML = `
                <img src="${encodeURI(item.images[0]) || 'https://via.placeholder.com/80x80?text=Peça'}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="price">${item.quantity}x ${priceFormatted}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">SKU: ${item.sku || item.productId}</div>
                </div>
                <button class="remove-item" data-id="${item.sku || item.productId}">&times;</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalValue.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Remove handlers
        const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.onclick = () => removeFromCart(btn.dataset.id);
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        let message = `Olá! Gostaria de fazer um pedido deste(s) item(ns) do seu catálogo:\n\n`;
        
        cart.forEach((item, index) => {
            const price = typeof item.price === 'number' && item.price > 0
                ? (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'A consultar';
            
            message += `${index + 1}. *${item.title}*\n`;
            message += `   Qtd: ${item.quantity}\n`;
            message += `   SKU: ${item.sku || item.productId}\n`;
            message += `   Valor: ${price}\n\n`;
        });

        const total = cart.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price * item.quantity : 0), 0);
        if (total > 0) {
            message += `*Total Estimado:* ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
        }

        message += `Aguardo seu retorno para finalizar a compra.`;

        const waNumber = '554497387673';
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Back to Top Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
