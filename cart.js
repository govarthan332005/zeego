// ============================================================
// ZEEGO — Cart module
// ============================================================
import { findRestaurant, calculateDistance, calculateDeliveryFee } from './data.js';

const LS_KEY = 'zeego_cart_v1';

export function getCart() {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{"restaurantId":null,"items":{}}');
}
export function saveCart(cart) {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('zeego:cart-updated'));
}
export function clearCart() {
    localStorage.removeItem(LS_KEY);
    window.dispatchEvent(new Event('zeego:cart-updated'));
}

export function addToCart(restaurantId, dish) {
    const cart = getCart();
    if (cart.restaurantId && cart.restaurantId !== restaurantId && Object.keys(cart.items).length > 0) {
        const ok = confirm('You have items from another restaurant. Replace with this one?');
        if (!ok) return false;
        cart.items = {};
    }
    cart.restaurantId = restaurantId;
    cart.items[dish.id] = cart.items[dish.id] || { ...dish, qty: 0 };
    cart.items[dish.id].qty += 1;
    saveCart(cart);
    return true;
}
export function decreaseCart(dishId) {
    const cart = getCart();
    if (!cart.items[dishId]) return;
    cart.items[dishId].qty -= 1;
    if (cart.items[dishId].qty <= 0) delete cart.items[dishId];
    if (Object.keys(cart.items).length === 0) cart.restaurantId = null;
    saveCart(cart);
}
export function getCartQty(dishId) {
    const cart = getCart();
    return cart.items[dishId]?.qty || 0;
}
export function getCartCount() {
    const cart = getCart();
    return Object.values(cart.items).reduce((s, i) => s + i.qty, 0);
}
export function getCartSubtotal() {
    const cart = getCart();
    return Object.values(cart.items).reduce((s, i) => s + i.price * i.qty, 0);
}

export function getCartBill(userCoords) {
    const cart = getCart();
    const subtotal = getCartSubtotal();
    let deliveryFee = 30;
    let distance = null;
    if (cart.restaurantId && userCoords) {
        const r = findRestaurant(cart.restaurantId);
        if (r) {
            distance = calculateDistance(userCoords.lat, userCoords.lng, r.coords.lat, r.coords.lng);
            deliveryFee = calculateDeliveryFee(distance);
        }
    }
    const tax = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + deliveryFee + tax;
    return { subtotal, deliveryFee, tax, grandTotal, distance };
}
