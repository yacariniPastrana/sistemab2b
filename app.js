// App State
const state = {
    currentView: 'home',
    tenant: null,
    cart: {},
    products: []
};

// Mock Data (High Quality Images from Unsplash by category)
const MOCK_DATA = {
    'accesorios': [
        { id: 101, name: "Reloj Minimalista Clásico", price: 120.00, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
        { id: 102, name: "Lentes de Sol Retro", price: 45.00, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400" },
        { id: 103, name: "Pulsera de Cuero", price: 25.00, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400" },
        { id: 104, name: "Collar de Plata Fina", price: 85.00, img: "https://images.unsplash.com/photo-1599643478524-fb66f7f6a7a0?auto=format&fit=crop&q=80&w=400" }
    ],
    'artesania': [
        { id: 201, name: "Jarrón de Cerámica", price: 65.00, img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400" },
        { id: 202, name: "Cesta Tejida a Mano", price: 40.00, img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=400" },
        { id: 203, name: "Figura de Madera", price: 95.00, img: "https://images.unsplash.com/photo-1582736181297-a7dc42f36113?auto=format&fit=crop&q=80&w=400" },
        { id: 204, name: "Tapiz Decorativo Boho", price: 110.00, img: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=400" }
    ],
    'ropa': [
        { id: 301, name: "Chaqueta Denim Vintage", price: 89.90, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400" },
        { id: 302, name: "Camiseta Básica Algodón", price: 15.00, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400" },
        { id: 303, name: "Pantalón Cargo Urbano", price: 55.00, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400" },
        { id: 304, name: "Zapatillas Casuales Blancas", price: 75.00, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" }
    ],
    'tecnologia': [
        { id: 401, name: "Auriculares Inalámbricos", price: 129.99, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
        { id: 402, name: "Smartwatch Deportivo", price: 199.00, img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400" },
        { id: 403, name: "Teclado Mecánico RGB", price: 85.00, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400" },
        { id: 404, name: "Ratón Ergonómico", price: 45.00, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400" }
    ]
};

// Router & View Management
function navigate(viewName) {
    state.currentView = viewName;
    const app = document.getElementById('app');
    const template = document.getElementById(`tpl-${viewName}`);
    
    app.innerHTML = '';
    app.appendChild(template.content.cloneNode(true));

    // Post-render setup
    if (viewName === 'home') {
        document.querySelectorAll('.tenant-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const t = e.currentTarget.dataset.tenant;
                state.tenant = t;
                navigate('catalog');
            });
        });
    }

    if (viewName === 'catalog') {
        const titleMap = { 
            'accesorios': 'Catálogo de Accesorios', 
            'artesania': 'Catálogo de Artesanía', 
            'ropa': 'Catálogo de Ropa', 
            'tecnologia': 'Catálogo de Tecnología' 
        };
        document.getElementById('tenant-title').textContent = titleMap[state.tenant] || 'Catálogo';
        
        // Load the specific products for the selected tenant
        state.products = MOCK_DATA[state.tenant] || [];
        
        renderCatalog();
        updateCartBadge();
        
        document.getElementById('open-cart').addEventListener('click', toggleCart);
    }

    if (viewName === 'crm') {
        renderCRM();
    }
}

// Catalog Rendering
function renderCatalog() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (state.products.length === 0) {
        grid.innerHTML = '<p>No hay productos disponibles en este catálogo.</p>';
        return;
    }

    state.products.forEach(p => {
        const qty = state.cart[p.id] || 0;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <div class="qty-controls">
                    <button class="btn-qty" onclick="updateQty(${p.id}, -1)">-</button>
                    <span class="qty-display" id="qty-${p.id}">${qty}</span>
                    <button class="btn-qty" onclick="updateQty(${p.id}, 1)">+</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Cart Logic
window.updateQty = function(id, change) {
    const current = state.cart[id] || 0;
    let next = current + change;
    if (next < 0) next = 0;
    
    if (next === 0) {
        delete state.cart[id];
    } else {
        state.cart[id] = next;
    }

    const qtyEl = document.getElementById(`qty-${id}`);
    if (qtyEl) {
        qtyEl.textContent = next;
        // Animation
        qtyEl.style.transform = 'scale(1.5)';
        setTimeout(() => qtyEl.style.transform = 'scale(1)', 150);
    }
    
    updateCartBadge();
    renderCartItems();
};

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = Object.values(state.cart).reduce((a, b) => a + b, 0);
        badge.textContent = totalItems;
        badge.style.transform = 'scale(1.4)';
        setTimeout(() => badge.style.transform = 'scale(1)', 150);
    }
}

// Sidebar Cart
const cartSidebar = document.getElementById('cart-sidebar');
document.getElementById('close-cart').addEventListener('click', toggleCart);
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (Object.keys(state.cart).length === 0) return alert("El carrito está vacío. Añade productos para continuar.");
    toggleCart();
    state.cart = {}; // Clear cart
    navigate('success');
});

function toggleCart() {
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
}

function renderCartItems() {
    const itemsContainer = document.getElementById('cart-items');
    itemsContainer.innerHTML = '';
    let total = 0;

    Object.keys(state.cart).forEach(id => {
        // Find product across all categories since they might be in different arrays now
        // But cart only contains IDs from current session. Better to find by ID in current state.products
        const product = state.products.find(p => p.id == id);
        if (!product) return;
        const qty = state.cart[id];
        const lineTotal = product.price * qty;
        total += lineTotal;

        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div>
                <strong>${product.name}</strong><br>
                <small style="color: #10b981;">$${product.price.toFixed(2)} x ${qty}</small>
            </div>
            <div style="font-size: 1.2rem;"><strong>$${lineTotal.toFixed(2)}</strong></div>
        `;
        itemsContainer.appendChild(el);
    });

    if (Object.keys(state.cart).length === 0) {
        itemsContainer.innerHTML = '<div style="text-align:center; opacity: 0.5; padding: 2rem 0;">El carrito está vacío</div>';
    }

    document.getElementById('cart-total-price').textContent = `$${total.toFixed(2)}`;
}

// Init App
navigate('home');

// Modal Logic
window.showDemoAlert = function(featureName) {
    const modal = document.getElementById('demo-modal');
    document.getElementById('modal-title').textContent = featureName;
    document.getElementById('modal-msg').innerHTML = `El módulo de <strong>${featureName}</strong> se integrará de forma funcional en la Fase 2, una vez conectado al backend.`;
    modal.classList.add('active');
};

window.closeDemoAlert = function() {
    document.getElementById('demo-modal').classList.remove('active');
};

// Admin Sidebar Logic
window.toggleAdmin = function() {
    document.getElementById('admin-sidebar').classList.toggle('open');
};

// CRM Rendering
function renderCRM() {
    const MOCK_CLIENTS = [
        { id: 1, name: "Ferretería El Sol", phone: "+506 8888-1111", address: "San José, Centro" },
        { id: 2, name: "Taller Automotriz Ruiz", phone: "+506 8888-2222", address: "Alajuela, Radial" },
        { id: 3, name: "Repuestos Central", phone: "+506 8888-3333", address: "Heredia, Zona Franca" },
        { id: 4, name: "Mundo Accesorios B2B", phone: "+506 8888-4444", address: "Cartago, Parque Industrial" },
        { id: 5, name: "Distribuidora Gamma", phone: "+506 8888-5555", address: "San José, Escazú" }
    ];

    const grid = document.getElementById('crm-grid');
    grid.innerHTML = '';
    
    MOCK_CLIENTS.forEach(c => {
        const row = document.createElement('div');
        row.className = 'glass-panel';
        row.style.padding = '1.5rem 2rem';
        row.style.borderRadius = '12px';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.gap = '2rem';
        row.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        row.style.background = 'linear-gradient(90deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)';
        row.style.flexWrap = 'wrap'; 
        row.style.transition = 'all 0.2s ease';
        
        row.onmouseover = () => { 
            row.style.transform = 'translateY(-2px)'; 
            row.style.background = 'linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)';
            row.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            row.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
        };
        row.onmouseout = () => { 
            row.style.transform = 'none'; 
            row.style.background = 'linear-gradient(90deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)';
            row.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            row.style.boxShadow = 'none';
        };
        
        row.innerHTML = `
            <!-- Col 1: Nombre -->
            <div style="flex: 2; min-width: 250px; display: flex; align-items: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; color: #60a5fa; font-size: 1.4rem; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);">
                    🏢
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 1.15rem; color: #f8fafc; font-weight: 600; letter-spacing: 0.3px;">${c.name}</h3>
                    <span style="font-size: 0.75rem; color: #64748b; letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">Cod. 100${c.id}</span>
                </div>
            </div>
            
            <!-- Col 2: Teléfono -->
            <div style="flex: 1.5; min-width: 180px; border-left: 1px solid rgba(255,255,255,0.05); padding-left: 1.5rem;">
                <span style="display: block; font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.3rem; font-weight: 600;">Teléfono</span>
                <span style="color: #cbd5e1; font-weight: 500; font-size: 0.95rem;">${c.phone}</span>
            </div>

            <!-- Col 3: Dirección -->
            <div style="flex: 2; min-width: 200px; border-left: 1px solid rgba(255,255,255,0.05); padding-left: 1.5rem;">
                <span style="display: block; font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.3rem; font-weight: 600;">Ubicación</span>
                <span style="color: #cbd5e1; font-weight: 500; font-size: 0.95rem;">${c.address}</span>
            </div>

            <!-- Col 4: Acción -->
            <div style="flex: 0.5; min-width: 120px; text-align: right;">
                <button class="btn-outline" style="padding: 0.5rem 1.2rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; border-color: rgba(255,255,255,0.15); color: #e2e8f0; background: rgba(255,255,255,0.02); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,255,255,0.3)';" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.borderColor='rgba(255,255,255,0.15)';" onclick="showDemoAlert('Ver Expediente de ${c.name}')">Abrir ↗</button>
            </div>
        `;
        grid.appendChild(row);
    });
}
