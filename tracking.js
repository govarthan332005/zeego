// ============================================================
// ZEEGO — Order tracking (live status pipeline)
// Uses localStorage. Admin can push status updates via 'zeego_orders' key.
// ============================================================

export const ORDER_STATUSES = [
    { key: 'placed',     title: 'Order Placed',       desc: 'We received your order' , icon: 'receipt' },
    { key: 'preparing',  title: 'Preparing Your Food', desc: 'Chef is cooking it fresh', icon: 'chef-hat' },
    { key: 'ready',      title: 'Order Ready',         desc: 'Your food is ready to be picked up', icon: 'check-circle' },
    { key: 'picked',     title: 'Rider Picking Up',    desc: 'Rider is at the restaurant', icon: 'bike' },
    { key: 'ontheway',   title: 'On the Way',          desc: 'Rider is on the way to your address', icon: 'truck' },
    { key: 'delivered',  title: 'Delivered',           desc: 'Enjoy your meal! ❤️', icon: 'party-popper' }
];

const STATUS_MSGS = {
    placed:    'Confirming your order…',
    preparing: 'Chef is preparing your food 👨‍🍳',
    ready:     'Your food is ready! Rider being assigned',
    picked:    'Rider has picked up your order 🛵',
    ontheway:  'Your rider is on the way! 🚴‍♂️',
    delivered: 'Order delivered! Enjoy 🎉'
};

const RIDER_NAMES = ['Ravi Kumar', 'Suresh M.', 'Arjun Reddy', 'Kiran Babu', 'Manoj S.'];

export function getOrders() {
    return JSON.parse(localStorage.getItem('zeego_orders') || '[]');
}
export function saveOrders(list) {
    localStorage.setItem('zeego_orders', JSON.stringify(list));
    window.dispatchEvent(new Event('zeego:orders-updated'));
}
export function saveOrder(order) {
    const list = getOrders();
    list.unshift(order);
    saveOrders(list);
}
export function getOrder(id) {
    return getOrders().find(o => o.id === id);
}
export function updateOrderStatus(id, status) {
    const list = getOrders();
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    list[idx].statusHistory = list[idx].statusHistory || [];
    list[idx].statusHistory.push({ status, ts: Date.now() });

    // Auto-assign rider when picked
    if ((status === 'picked' || status === 'ontheway') && !list[idx].rider) {
        list[idx].rider = {
            name: RIDER_NAMES[Math.floor(Math.random() * RIDER_NAMES.length)],
            phone: '+91 98' + Math.floor(10000000 + Math.random() * 89999999),
            vehicle: 'TS 09 ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                     String.fromCharCode(65 + Math.floor(Math.random() * 26)) + ' ' +
                     Math.floor(1000 + Math.random() * 9000),
            rating: (4 + Math.random()).toFixed(1)
        };
    }

    saveOrders(list);
    return list[idx];
}

/* ---------- Rendering the tracking page ---------- */
export function renderTrackingPage(orderId) {
    const order = getOrder(orderId);
    if (!order) return;

    const pipeline = document.getElementById('statusPipeline');
    const currentIdx = ORDER_STATUSES.findIndex(s => s.key === order.status);

    pipeline.innerHTML = ORDER_STATUSES.map((s, i) => {
        const state = i < currentIdx ? 'done' : (i === currentIdx ? 'current' : 'pending');
        const historyEntry = (order.statusHistory || []).find(h => h.status === s.key);
        const ts = historyEntry
            ? new Date(historyEntry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';
        const iconHtml = state === 'done'
            ? '<i data-lucide="check"></i>'
            : `<i data-lucide="${lucideIconFor(s.icon)}"></i>`;
        return `
            <div class="status-step ${state}">
                <div class="status-icon">${iconHtml}</div>
                <div class="status-text">
                    <div class="title">${s.title}</div>
                    <div class="desc">${s.desc}</div>
                    ${ts ? `<div class="ts">${ts}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    // ETA hero
    const etaMinsLeft = calculateEtaLeft(order);
    document.getElementById('trackEtaNum').textContent = order.status === 'delivered' ? '✓' : etaMinsLeft;
    document.getElementById('trackEtaStatus').textContent = STATUS_MSGS[order.status] || 'Processing…';

    // Rider card (show after ready)
    const riderCard = document.getElementById('riderCard');
    if (order.rider && ['picked','ontheway','delivered'].includes(order.status)) {
        riderCard.style.display = 'flex';
        document.getElementById('riderAvatar').textContent = order.rider.name.charAt(0);
        document.getElementById('riderName').textContent = order.rider.name;
        document.getElementById('riderMeta').textContent =
            `⭐ ${order.rider.rating} · ${order.rider.vehicle}`;
    } else {
        riderCard.style.display = 'none';
    }

    // Summary
    const summary = document.getElementById('trackSummary');
    summary.innerHTML = `
        <h4>Order #${order.id} · ${order.restaurantName}</h4>
        ${order.items.map(it => `
            <div class="line"><span>${it.qty} × ${it.name}</span><span>₹${(it.price * it.qty).toFixed(0)}</span></div>
        `).join('')}
        <div class="line"><span>Delivery Fee</span><span>₹${order.deliveryFee.toFixed(0)}</span></div>
        <div class="line"><span>Taxes</span><span>₹${order.tax.toFixed(0)}</span></div>
        <div class="line total"><span>Total Paid</span><span>₹${order.grandTotal.toFixed(0)}</span></div>
        <div class="line" style="margin-top:12px;"><span>Payment</span><span>${order.paymentMethod.toUpperCase()}</span></div>
        <div class="line"><span>Address</span><span style="max-width:60%;text-align:right;">${order.address}</span></div>
    `;

    // Refresh icons
    if (window.lucide) window.lucide.createIcons();
}

function lucideIconFor(name) {
    const map = {
        'receipt': 'receipt',
        'chef-hat': 'chef-hat',
        'check-circle': 'check-circle-2',
        'bike': 'bike',
        'truck': 'truck',
        'party-popper': 'party-popper'
    };
    return map[name] || 'circle';
}

function calculateEtaLeft(order) {
    if (!order.placedAt) return order.etaMinutes || 30;
    const elapsedMin = Math.floor((Date.now() - order.placedAt) / 60000);
    const left = Math.max(0, (order.etaMinutes || 30) - elapsedMin);
    return left;
}

/* ---------- Live sync — poll every 6s to catch admin-side updates ---------- */
let trackPollHandle = null;
export function startTracking(orderId) {
    stopTracking();
    renderTrackingPage(orderId);
    trackPollHandle = setInterval(() => renderTrackingPage(orderId), 6000);
}
export function stopTracking() {
    if (trackPollHandle) { clearInterval(trackPollHandle); trackPollHandle = null; }
}

/* ---------- Auto-progression for demo (if admin never touches order) ---------- */
export function autoProgressDemo(orderId) {
    // Every 25s, if status hasn't reached delivered, bump to next step.
    // This gives a live-feel demo without an admin dashboard interaction.
    const bumpDelays = [25, 30, 25, 30, 30]; // seconds between transitions
    const bumps = ['preparing', 'ready', 'picked', 'ontheway', 'delivered'];
    let step = 0;

    const tick = () => {
        const o = getOrder(orderId);
        if (!o || o.status === 'delivered') return;
        // Only auto-progress if the current status is the "expected" step index.
        const expectedIdx = step; // 0 => order should be at 'placed' before first bump
        const currentIdx = ORDER_STATUSES.findIndex(s => s.key === o.status);
        if (currentIdx <= expectedIdx) {
            updateOrderStatus(orderId, bumps[step]);
        }
        step++;
        if (step < bumps.length) setTimeout(tick, bumpDelays[step] * 1000);
    };
    setTimeout(tick, bumpDelays[0] * 1000);
}
