// ============================================================
// ZEEGO — Orders creation
// ============================================================
import { getCart, clearCart, getCartBill } from './cart.js';
import { findRestaurant, estimateDeliveryTime } from './data.js';
import { saveOrder, autoProgressDemo } from './tracking.js';

function makeOrderId() {
    return 'ZG' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
}

export function placeOrder({ address, paymentMethod, userCoords }) {
    const cart = getCart();
    if (!cart.restaurantId || Object.keys(cart.items).length === 0) return null;

    const restaurant = findRestaurant(cart.restaurantId);
    const bill = getCartBill(userCoords);

    const items = Object.values(cart.items).map(i => ({
        id: i.id, name: i.name, price: i.price, qty: i.qty, veg: i.veg
    }));

    const eta = estimateDeliveryTime(bill.distance, restaurant.deliveryTime || 20);

    const order = {
        id: makeOrderId(),
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        items,
        subtotal: bill.subtotal,
        deliveryFee: bill.deliveryFee,
        tax: bill.tax,
        grandTotal: bill.grandTotal,
        distanceKm: bill.distance,
        etaMinutes: eta,
        address,
        paymentMethod,
        placedAt: Date.now(),
        status: 'placed',
        statusHistory: [{ status: 'placed', ts: Date.now() }],
        rider: null
    };
    saveOrder(order);
    clearCart();

    // Kick off demo auto-progress (admin can override manually)
    autoProgressDemo(order.id);

    return order;
}
