// ============================================================
// ZEEGO — Main app orchestrator
// ============================================================
import { restaurants, getAllDishes, findRestaurant } from './data.js';
import { detectLocation, getSavedLocation } from './location.js';
import { initAuth, getUser } from './auth.js';
import {
    addToCart, decreaseCart, getCartQty, getCart, getCartCount,
    getCartBill, clearCart
} from './cart.js';
import { placeOrder } from './orders.js';
import {
    getOrders, getOrder, startTracking, stopTracking, renderTrackingPage
} from './tracking.js';

/* ---------- DOM ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

let currentView = 'home';
let restaurantOpenId = null;
let trackingOrderId = null;

/* ---------- Boot ---------- */
window.addEventListener('load', async () => {
    initAuth();
    setupNav();
    setupHome();
    setupSearch();
    setupCart();
    setupCheckout();
    setupRestaurantPage();
    setupTracking();
    setupNotifications();

    // Location
    const loc = getSavedLocation();
    if (loc) applyLocation(loc); else applyLocation({ address: 'Detecting your location…' });
    detectLocation().then(applyLocation);

    renderHome();
    refreshOrders();
    refreshProfile();

    // Live sync events
    window.addEventListener('zeego:cart-updated', () => { refreshCartBadge(); refreshCartSheet(); });
    window.addEventListener('zeego:orders-updated', () => { refreshOrders(); if (trackingOrderId) renderTrackingPage(trackingOrderId); });
    window.addEventListener('zeego:user-updated', refreshProfile);
    window.addEventListener('zeego:location-updated', () => { const l = getSavedLocation(); if (l) applyLocation(l); });

    refreshCartBadge();

    // Cross-tab / admin sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'zeego_orders') {
            refreshOrders();
            if (trackingOrderId) renderTrackingPage(trackingOrderId);
        }
    });

    // Refresh icons
    if (window.lucide) window.lucide.createIcons();

    // Signal to the inline safety-hide script that the app has
    // finished booting. The inline script also has a hard failsafe
    // timeout so the loader NEVER gets stuck (fixes the previous bug
    // where the loader stayed forever if any module import failed).
    setTimeout(() => {
        window.dispatchEvent(new Event('zeego:app-ready'));
    }, 700);
});

/* ---------- Nav ---------- */
function setupNav() {
    $$('.nav-item[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.nav;
            if (target === 'cart') { openCartSheet(); return; }
            switchView(target);
        });
    });
    // data-nav on links
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('[data-nav]');
        if (link && !link.classList.contains('nav-item')) {
            e.preventDefault();
            const target = link.dataset.nav;
            if (target === 'cart') openCartSheet();
            else switchView(target);
        }
    });
}
function switchView(name) {
    currentView = name;
    $$('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view' + name.charAt(0).toUpperCase() + name.slice(1))?.classList.add('active');
    $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.nav === name));
    window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ---------- Location ---------- */
function applyLocation(loc) {
    if (loc?.address) document.getElementById('deliverAddr').textContent = loc.address;
    if (loc?.address) {
        const el = document.getElementById('checkoutAddress');
        if (el) el.textContent = loc.address;
    }
}

/* ---------- Home rendering ---------- */
function renderHome() {
    renderTopDishes();
    renderRecommended();
    renderRestaurants('all');

    $$('.filter-btn').forEach(b => {
        b.addEventListener('click', () => {
            $$('.filter-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            renderRestaurants(b.dataset.filter);
        });
    });

    // Category clicks
    $$('.cat-item').forEach(c => {
        c.addEventListener('click', () => {
            const cat = c.dataset.cat;
            switchView('search');
            $('#searchInput').value = cat;
            performSearch(cat);
        });
    });

    $('#orderNowBtn')?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

function renderTopDishes() {
    const wrap = $('#topDishesScroll');
    const dishes = getAllDishes()
        .sort((a, b) => b.restaurantRating - a.restaurantRating)
        .slice(0, 8);
    wrap.innerHTML = dishes.map(d => `
        <div class="dish-card" data-rest="${d.restaurantId}">
            <img src="${d.image}" loading="lazy" alt="${d.name}">
            <h5>${d.name}</h5>
            <div class="rest-tiny">${d.restaurantName} · ⭐ ${d.restaurantRating}</div>
            <div class="price-tiny">₹${d.price}</div>
        </div>
    `).join('');
    wrap.querySelectorAll('.dish-card').forEach(el => {
        el.addEventListener('click', () => openRestaurant(el.dataset.rest));
    });
}

function renderRecommended() {
    const wrap = $('#recommendedList');
    const list = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);
    wrap.innerHTML = list.map(r => restaurantCardHtml(r)).join('');
    bindRestClicks(wrap);
}
function renderRestaurants(filter) {
    const wrap = $('#restaurantsList');
    let list = [...restaurants];
    if (filter === 'rating') list = list.filter(r => r.rating >= 4);
    if (filter === 'fast') list = list.filter(r => r.deliveryTime <= 25);
    if (filter === 'offer') list = list.filter(r => r.offer);
    if (filter === 'pure-veg') list = list.filter(r => r.veg);
    wrap.innerHTML = list.map(restaurantCardHtml).join('');
    bindRestClicks(wrap);
}
function restaurantCardHtml(r) {
    return `
      <div class="rest-card" data-id="${r.id}">
        <div class="rest-thumb"><img src="${r.image}" loading="lazy" alt="${r.name}"></div>
        <div class="rest-info">
            <h4>${r.name}</h4>
            <div class="cuisines">${r.cuisines.join(' · ')} · Bowls</div>
            <div class="meta">
                <span>⭐ ${r.rating} (${(r.reviews / 1000).toFixed(1)}k+)</span>
                <span class="dot"></span>
                <span>${r.deliveryTime - 5}–${r.deliveryTime + 5} min</span>
            </div>
            ${r.offer ? `<span class="rest-offer">${r.offer}</span>` : ''}
        </div>
        <button class="rest-heart" data-id="${r.id}"><i data-lucide="heart"></i></button>
        <div class="rest-rating-badge"><span class="star">⭐</span>${r.rating}</div>
      </div>
    `;
}
function bindRestClicks(container) {
    container.querySelectorAll('.rest-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.rest-heart')) return;
            openRestaurant(card.dataset.id);
        });
    });
    container.querySelectorAll('.rest-heart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('liked');
        });
    });
    if (window.lucide) window.lucide.createIcons();
}

/* ---------- Search ---------- */
function setupSearch() {
    const inp = $('#searchInput');
    inp?.addEventListener('input', (e) => performSearch(e.target.value));
    $$('#searchTags .tag').forEach(t => {
        t.addEventListener('click', () => {
            inp.value = t.dataset.tag;
            performSearch(t.dataset.tag);
        });
    });
}
function performSearch(q) {
    const results = $('#searchResults');
    q = (q || '').toLowerCase().trim();
    if (!q) {
        results.innerHTML = '<p class="empty-state-text">Start typing above ⬆️</p>';
        return;
    }
    const matches = restaurants.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q)) ||
        r.categories.some(c => c.includes(q)) ||
        r.menu.some(m => m.name.toLowerCase().includes(q))
    );
    if (matches.length === 0) {
        results.innerHTML = '<p class="empty-state-text">No results for "' + q + '"</p>';
        return;
    }
    results.innerHTML = matches.map(restaurantCardHtml).join('');
    bindRestClicks(results);
}

/* ---------- Restaurant full page ---------- */
function setupRestaurantPage() {
    $('#closeRestaurantPage')?.addEventListener('click', closeRestaurant);
    $('#restCartViewBtn')?.addEventListener('click', () => {
        openCartSheet();
    });
    $('#restPageShare')?.addEventListener('click', () => {
        showToast('Share link copied!');
    });
}
function openRestaurant(id) {
    const r = findRestaurant(id);
    if (!r) return;
    restaurantOpenId = id;
    $('#restPageHeaderName').textContent = r.name;
    const body = $('#restaurantPageBody');
    body.innerHTML = `
        <div class="rest-hero-img" style="background-image:url('${r.image}');"></div>
        <div class="rest-hero-title">
            <h2>${r.name}</h2>
            <div class="cuisines">${r.cuisines.join(' · ')}</div>
            <div class="rest-badges">
                <span class="badge rating-badge"><span class="star">⭐</span> ${r.rating} (${r.reviews})</span>
                <span class="badge">🕒 ${r.deliveryTime} min</span>
                <span class="badge">💰 ₹${r.priceForTwo} for two</span>
                ${r.offer ? `<span class="badge" style="background:var(--brand-orange-soft);color:var(--brand-orange);">🎁 ${r.offer}</span>` : ''}
            </div>
        </div>
        <div class="menu-list" id="menuList">
            <div class="menu-cat-title">🍽️ Recommended</div>
            ${r.menu.map(m => menuItemHtml(r.id, m)).join('')}
        </div>
        <div class="end-spacer" style="height:120px;"></div>
    `;
    $('#restaurantPage').classList.add('active');
    document.body.style.overflow = 'hidden';
    bindMenuActions();
    refreshRestCartBar();
    if (window.lucide) window.lucide.createIcons();
}
function menuItemHtml(rid, m) {
    const qty = getCartQty(m.id);
    return `
        <div class="menu-item" data-dish="${m.id}">
            <div class="info">
                <span class="veg-dot ${m.veg ? 'veg' : 'nonveg'}"></span>
                <h5>${m.name}</h5>
                <div class="price-line">₹${m.price} <span class="kcal">· ${m.kcal || 0} kcal · ${m.protein || 0}g protein</span></div>
                <div class="desc">${m.desc || ''}</div>
            </div>
            <div class="img-add">
                <img src="${m.image}" loading="lazy" alt="${m.name}">
                ${qty > 0
                    ? `<div class="add-btn qty"><button data-act="minus" data-dish="${m.id}">−</button><span>${qty}</span><button data-act="plus" data-dish="${m.id}" data-rest="${rid}">+</button></div>`
                    : `<button class="add-btn" data-act="add" data-dish="${m.id}" data-rest="${rid}">ADD +</button>`}
            </div>
        </div>
    `;
}
function bindMenuActions() {
    $$('.menu-list [data-act]').forEach(btn => {
        btn.addEventListener('click', () => {
            const rid = btn.dataset.rest || restaurantOpenId;
            const did = btn.dataset.dish;
            const r = findRestaurant(rid);
            const d = r?.menu.find(m => m.id === did);
            if (btn.dataset.act === 'add' || btn.dataset.act === 'plus') {
                if (d) addToCart(rid, d);
            } else if (btn.dataset.act === 'minus') {
                decreaseCart(did);
            }
            // Re-render just this item
            const wrap = btn.closest('.menu-item');
            wrap.outerHTML = menuItemHtml(rid, d);
            bindMenuActions();
            refreshRestCartBar();
        });
    });
}
function refreshRestCartBar() {
    const bar = $('#restPageCartBar');
    const c = getCart();
    if (!c.restaurantId) { bar.style.display = 'none'; return; }
    const count = getCartCount();
    if (count === 0) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    $('#restCartCount').textContent = count + (count === 1 ? ' item' : ' items');
    const bill = getCartBill(getSavedLocation());
    $('#restCartTotal').textContent = '₹' + bill.subtotal;
}
function closeRestaurant() {
    $('#restaurantPage').classList.remove('active');
    document.body.style.overflow = '';
    restaurantOpenId = null;
}

/* ---------- Cart sheet ---------- */
function setupCart() {
    $('#closeCart')?.addEventListener('click', closeCartSheet);
    $('#cartOverlay')?.addEventListener('click', closeCartSheet);
    $('#checkoutBtn')?.addEventListener('click', () => {
        closeCartSheet();
        openCheckout();
    });
}
function openCartSheet() {
    refreshCartSheet();
    $('#cartSheet').classList.add('active');
    $('#cartOverlay').classList.add('active');
}
function closeCartSheet() {
    $('#cartSheet').classList.remove('active');
    $('#cartOverlay').classList.remove('active');
}
function refreshCartSheet() {
    const cart = getCart();
    const items = $('#cartItems');
    const footer = $('#cartFooter');
    const restLabel = $('#cartRestaurant');
    if (!cart.restaurantId || Object.keys(cart.items).length === 0) {
        items.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-basket" style="width:60px;height:60px;"></i>
                <p>Your cart is empty</p>
                <span>Add items from any restaurant to get started</span>
            </div>`;
        footer.style.display = 'none';
        restLabel.textContent = '';
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    const r = findRestaurant(cart.restaurantId);
    restLabel.innerHTML = `📍 <strong>${r.name}</strong>`;
    items.innerHTML = Object.values(cart.items).map(i => `
        <div class="cart-item">
            <span class="veg-dot ${i.veg ? 'veg' : 'nonveg'}"></span>
            <span class="name">${i.name}</span>
            <div class="qty-ctrl">
                <button data-cart-act="minus" data-id="${i.id}">−</button>
                <span>${i.qty}</span>
                <button data-cart-act="plus" data-id="${i.id}">+</button>
            </div>
            <span class="price">₹${(i.price * i.qty).toFixed(0)}</span>
        </div>
    `).join('');
    // qty ctrl
    items.querySelectorAll('[data-cart-act]').forEach(b => {
        b.addEventListener('click', () => {
            const did = b.dataset.id;
            if (b.dataset.cartAct === 'plus') {
                const dish = r.menu.find(m => m.id === did);
                if (dish) addToCart(r.id, dish);
            } else {
                decreaseCart(did);
            }
        });
    });
    // bill
    const bill = getCartBill(getSavedLocation());
    $('#itemTotal').textContent = '₹' + bill.subtotal;
    $('#deliveryFee').textContent = '₹' + bill.deliveryFee;
    $('#gstAmount').textContent = '₹' + bill.tax;
    $('#grandTotal').textContent = '₹' + bill.grandTotal;
    footer.style.display = 'block';
}
function refreshCartBadge() {
    const count = getCartCount();
    const badge = $('#cartBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'grid' : 'none';
    }
}

/* ---------- Checkout ---------- */
function setupCheckout() {
    $('#closeCheckout')?.addEventListener('click', closeCheckout);
    $('#checkoutModal')?.querySelector('.modal-overlay').addEventListener('click', closeCheckout);
    $('#placeOrderBtn')?.addEventListener('click', doPlaceOrder);
    $('#continueShoppingBtn')?.addEventListener('click', () => {
        $('#successModal').classList.remove('active');
        switchView('home');
    });
    $('#trackOrderBtn')?.addEventListener('click', () => {
        const oid = $('#orderIdDisplay').textContent;
        $('#successModal').classList.remove('active');
        openTracking(oid);
    });
}
function openCheckout() {
    const cart = getCart();
    if (!cart.restaurantId) return;
    const loc = getSavedLocation();
    if (loc?.address) $('#checkoutAddress').textContent = loc.address;
    const bill = getCartBill(loc);
    $('#checkoutSummary').innerHTML = `
        <div class="line"><span>Item Total</span><span>₹${bill.subtotal}</span></div>
        <div class="line"><span>Delivery Fee</span><span>₹${bill.deliveryFee}</span></div>
        <div class="line"><span>Taxes</span><span>₹${bill.tax}</span></div>
        <div class="line total"><span>To Pay</span><span>₹${bill.grandTotal}</span></div>
    `;
    $('#checkoutModal').classList.add('active');
}
function closeCheckout() { $('#checkoutModal').classList.remove('active'); }
function doPlaceOrder() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
    const loc = getSavedLocation();
    const order = placeOrder({
        address: loc?.address || 'Home',
        paymentMethod,
        userCoords: loc
    });
    if (!order) return;
    closeCheckout();
    $('#orderIdDisplay').textContent = order.id;
    $('#etaDisplay').textContent = order.etaMinutes + ' mins';
    $('#successModal').classList.add('active');
    refreshOrders();
}

/* ---------- Orders view ---------- */
function refreshOrders() {
    const list = getOrders();
    const wrap = $('#ordersList');
    if (list.length === 0) {
        wrap.innerHTML = `
            <div class="empty-state">
                <i data-lucide="receipt" style="width:64px;height:64px;"></i>
                <h3>No orders yet</h3>
                <p>Your past orders will appear here</p>
                <button class="btn-primary" data-nav="home"><i data-lucide="utensils"></i> Order Now</button>
            </div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    wrap.innerHTML = list.map(o => `
        <div class="order-card" data-order="${o.id}">
            <div class="order-card-head">
                <div class="rest-name">${o.restaurantName}</div>
                <span class="order-status-chip chip-${o.status}">
                    ${o.status !== 'delivered' && o.status !== 'cancelled' ? '<span class="pulse-dot"></span>' : ''}
                    ${statusLabel(o.status)}
                </span>
            </div>
            <div class="order-items-line">${o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
            <div class="order-card-foot">
                <span class="order-time">${new Date(o.placedAt).toLocaleString([], { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                <span class="order-total">₹${o.grandTotal}</span>
            </div>
        </div>
    `).join('');
    wrap.querySelectorAll('.order-card').forEach(c => {
        c.addEventListener('click', () => openTracking(c.dataset.order));
    });
    if (window.lucide) window.lucide.createIcons();
}
function statusLabel(s) {
    const map = {
        placed: 'Order Placed',
        preparing: 'Preparing',
        ready: 'Order Ready',
        picked: 'Rider Picking Up',
        ontheway: 'On the Way',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };
    return map[s] || s;
}

/* ---------- Tracking ---------- */
function setupTracking() {
    $('#closeTrackPage')?.addEventListener('click', closeTracking);
    $('#callSupport')?.addEventListener('click', () => showToast('Support: 1800-ZEEGO-1'));
}
function openTracking(orderId) {
    trackingOrderId = orderId;
    $('#trackPage').classList.add('active');
    document.body.style.overflow = 'hidden';
    startTracking(orderId);
}
function closeTracking() {
    $('#trackPage').classList.remove('active');
    document.body.style.overflow = '';
    trackingOrderId = null;
    stopTracking();
}

/* ---------- Profile ---------- */
function refreshProfile() {
    const u = getUser();
    if (u && u.name !== 'Guest') {
        $('#profileName').textContent = u.name;
        $('#profilePhone').textContent = u.phone;
        $('#profileLoginBtn').style.display = 'none';
        $('#profileLogoutRow').style.display = 'flex';
    } else {
        $('#profileName').textContent = u?.name || 'Guest User';
        $('#profilePhone').textContent = u ? 'Guest session' : 'Login to order food';
        $('#profileLoginBtn').style.display = 'inline-flex';
        $('#profileLogoutRow').style.display = 'none';
    }
}

/* ---------- Notifications ---------- */
function setupNotifications() {
    $('#bellBtn')?.addEventListener('click', () => {
        showToast('🔔 3 new offers available!');
    });
}

/* ---------- Toast ---------- */
function showToast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
