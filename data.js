// ============================================================
// ZEEGO — Data layer (restaurants, menu, helpers)
// ============================================================

export const CITY_COORDS = { lat: 16.5062, lng: 80.6480 }; // Vijayawada default

export const restaurants = [
    {
        id: 'r1',
        name: 'The Bowl Company',
        cuisines: ['Healthy', 'Salads', 'Bowls'],
        rating: 4.6, reviews: 1200, priceForTwo: 400, deliveryTime: 28,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        offer: '30% OFF up to ₹100', veg: true,
        coords: { lat: 16.5065, lng: 80.6485 },
        address: '2nd Cross Rd, Vijayawada',
        categories: ['south-indian', 'chinese'],
        menu: [
            { id: 'r1m1', name: 'Chicken Teriyaki Bowl', desc: 'Tender chicken with rice & veggies in teriyaki glaze', price: 289, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', veg: false, kcal: 480, protein: 32 },
            { id: 'r1m2', name: 'Quinoa Buddha Bowl', desc: 'Nutrient-packed quinoa with fresh veggies & hummus', price: 249, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', veg: true, kcal: 420, protein: 18 },
            { id: 'r1m3', name: 'Peri Peri Paneer Bowl', desc: 'Grilled paneer over rice with peri sauce', price: 229, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', veg: true, kcal: 460, protein: 22 },
            { id: 'r1m4', name: 'Greek Chicken Bowl', desc: 'Chicken with feta, olives, tzatziki, and pita', price: 299, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', veg: false, kcal: 510, protein: 34 }
        ]
    },
    {
        id: 'r2',
        name: 'Cheesy Crust Pizza',
        cuisines: ['Pizza', 'Italian', 'Fast Food'],
        rating: 4.4, reviews: 980, priceForTwo: 500, deliveryTime: 22,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        offer: '20% OFF up to ₹80', veg: false,
        coords: { lat: 16.5058, lng: 80.6492 },
        address: 'MG Road, Vijayawada',
        categories: ['pizza'],
        menu: [
            { id: 'r2m1', name: 'Margherita Pizza', desc: 'Classic tomato sauce, mozzarella & basil', price: 199, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80', veg: true, kcal: 460, protein: 18 },
            { id: 'r2m2', name: 'Pepperoni Pizza', desc: 'Loaded pepperoni & mozzarella', price: 349, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80', veg: false, kcal: 620, protein: 26 },
            { id: 'r2m3', name: 'Veg Supreme Pizza', desc: 'Capsicum, onion, corn, olives, mushrooms', price: 299, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80', veg: true, kcal: 540, protein: 20 },
            { id: 'r2m4', name: 'BBQ Chicken Pizza', desc: 'Smoky BBQ chicken with onions and peppers', price: 399, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80', veg: false, kcal: 680, protein: 30 },
            { id: 'r2m5', name: 'Garlic Bread', desc: 'Crispy bread with garlic butter and herbs', price: 99, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80', veg: true, kcal: 260, protein: 8 }
        ]
    },
    {
        id: 'r3',
        name: 'Burger Hub',
        cuisines: ['American', 'Burgers', 'Fast Food'],
        rating: 4.2, reviews: 650, priceForTwo: 350, deliveryTime: 20,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        offer: '20% OFF', veg: false,
        coords: { lat: 16.5070, lng: 80.6478 },
        address: 'Benz Circle, Vijayawada',
        categories: ['burger'],
        menu: [
            { id: 'r3m1', name: 'Classic Cheeseburger', desc: 'Beef patty with cheese, lettuce & tomato', price: 149, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', veg: false, kcal: 540, protein: 26 },
            { id: 'r3m2', name: 'Veg Burger', desc: 'Crispy veggie patty with fresh lettuce', price: 99, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80', veg: true, kcal: 380, protein: 10 },
            { id: 'r3m3', name: 'Chicken Burger', desc: 'Grilled chicken patty with mayo', price: 179, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80', veg: false, kcal: 480, protein: 28 },
            { id: 'r3m4', name: 'French Fries', desc: 'Crispy golden fries with seasoning', price: 79, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', veg: true, kcal: 320, protein: 4 }
        ]
    },
    {
        id: 'r4',
        name: 'Biryani Junction',
        cuisines: ['Biryani', 'Mughlai', 'Indian'],
        rating: 4.5, reviews: 1560, priceForTwo: 400, deliveryTime: 30,
        image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80',
        offer: '50% OFF up to ₹100', veg: false,
        coords: { lat: 16.5075, lng: 80.6470 },
        address: 'Governorpet, Vijayawada',
        categories: ['biryani', 'south-indian'],
        menu: [
            { id: 'r4m1', name: 'Chicken Biryani', desc: 'Aromatic basmati rice with tender chicken & spices', price: 220, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', veg: false, kcal: 540, protein: 32 },
            { id: 'r4m2', name: 'Mutton Biryani', desc: 'Slow-cooked mutton with fragrant rice', price: 320, image: 'https://images.unsplash.com/photo-1633945274405-b6c8a7adcb22?w=400&q=80', veg: false, kcal: 620, protein: 38 },
            { id: 'r4m3', name: 'Veg Biryani', desc: 'Mixed vegetables and basmati rice', price: 160, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80', veg: true, kcal: 420, protein: 12 },
            { id: 'r4m4', name: 'Butter Chicken', desc: 'Creamy tomato curry with tender chicken', price: 280, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', veg: false, kcal: 480, protein: 28 }
        ]
    },
    {
        id: 'r5',
        name: 'Dragon Wok',
        cuisines: ['Chinese', 'Asian'],
        rating: 4.1, reviews: 480, priceForTwo: 450, deliveryTime: 35,
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80',
        offer: '30% OFF', veg: false,
        coords: { lat: 16.5085, lng: 80.6465 },
        address: 'Governor Road, Vijayawada',
        categories: ['chinese'],
        menu: [
            { id: 'r5m1', name: 'Veg Hakka Noodles', desc: 'Stir-fried noodles with vegetables', price: 140, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80', veg: true, kcal: 380, protein: 11 },
            { id: 'r5m2', name: 'Chicken Fried Rice', desc: 'Wok-tossed rice with chicken', price: 180, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', veg: false, kcal: 520, protein: 26 },
            { id: 'r5m3', name: 'Veg Manchurian', desc: 'Crispy veg balls in spicy sauce', price: 160, image: 'https://images.unsplash.com/photo-1626777553635-3d4f9c97c8a6?w=400&q=80', veg: true, kcal: 340, protein: 10 },
            { id: 'r5m4', name: 'Chilli Chicken', desc: 'Spicy chicken with capsicum & onions', price: 220, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80', veg: false, kcal: 480, protein: 32 }
        ]
    },
    {
        id: 'r6',
        name: 'Sweet Treats',
        cuisines: ['Desserts', 'Bakery', 'Ice Cream'],
        rating: 4.7, reviews: 980, priceForTwo: 250, deliveryTime: 20,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
        offer: 'BUY 1 GET 1', veg: true,
        coords: { lat: 16.5060, lng: 80.6495 },
        address: 'Eluru Road, Vijayawada',
        categories: ['dessert', 'beverages'],
        menu: [
            { id: 'r6m1', name: 'Chocolate Cake', desc: 'Rich and moist chocolate cake', price: 120, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', veg: true, kcal: 380, protein: 5 },
            { id: 'r6m2', name: 'Vanilla Ice Cream', desc: 'Creamy vanilla scoop with toppings', price: 80, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80', veg: true, kcal: 220, protein: 4 },
            { id: 'r6m3', name: 'Brownie Sundae', desc: 'Warm brownie with ice cream', price: 150, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80', veg: true, kcal: 460, protein: 6 },
            { id: 'r6m4', name: 'Cold Coffee', desc: 'Refreshing iced coffee with cream', price: 110, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80', veg: true, kcal: 180, protein: 4 }
        ]
    },
    {
        id: 'r7',
        name: 'Dosa Corner',
        cuisines: ['South Indian', 'Breakfast'],
        rating: 4.6, reviews: 2100, priceForTwo: 200, deliveryTime: 25,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80',
        offer: 'FREE DELIVERY', veg: true,
        coords: { lat: 16.5055, lng: 80.6488 },
        address: 'Krishna Lanka, Vijayawada',
        categories: ['south-indian'],
        menu: [
            { id: 'r7m1', name: 'Masala Dosa', desc: 'Crispy dosa with spiced potato filling', price: 80, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80', veg: true, kcal: 320, protein: 8 },
            { id: 'r7m2', name: 'Idli Sambar', desc: '4 fluffy idlis with sambar & chutney', price: 60, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', veg: true, kcal: 240, protein: 9 },
            { id: 'r7m3', name: 'Vada Sambar', desc: 'Crispy lentil donuts with sambar', price: 50, image: 'https://images.unsplash.com/photo-1626500155002-c5cbc1d8e1a4?w=400&q=80', veg: true, kcal: 280, protein: 7 },
            { id: 'r7m4', name: 'Filter Coffee', desc: 'Authentic South Indian filter coffee', price: 30, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', veg: true, kcal: 90, protein: 2 }
        ]
    },
    {
        id: 'r8',
        name: 'Roll Express',
        cuisines: ['Rolls', 'Street Food', 'Fast Food'],
        rating: 4.0, reviews: 320, priceForTwo: 250, deliveryTime: 22,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
        offer: '15% OFF', veg: false,
        coords: { lat: 16.5052, lng: 80.6483 },
        address: 'Auto Nagar, Vijayawada',
        categories: ['rolls'],
        menu: [
            { id: 'r8m1', name: 'Chicken Kathi Roll', desc: 'Spiced chicken in soft paratha', price: 120, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', veg: false, kcal: 380, protein: 22 },
            { id: 'r8m2', name: 'Paneer Roll', desc: 'Spiced paneer in soft paratha', price: 100, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80', veg: true, kcal: 340, protein: 14 },
            { id: 'r8m3', name: 'Egg Roll', desc: 'Classic egg roll with onions & chutney', price: 80, image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&q=80', veg: false, kcal: 320, protein: 13 },
            { id: 'r8m4', name: 'Veg Roll', desc: 'Mixed vegetables roll with mint chutney', price: 70, image: 'https://images.unsplash.com/photo-1604908554027-2ce26d96fad6?w=400&q=80', veg: true, kcal: 280, protein: 8 }
        ]
    }
];

/* ---------- Helpers ---------- */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export function calculateDeliveryFee(km) {
    if (km == null || isNaN(km)) return 30;
    if (km <= 2) return 20;
    if (km <= 5) return 40;
    if (km <= 10) return 70;
    return Math.round(km * 8);
}
export function estimateDeliveryTime(km, prep = 20) {
    if (km == null || isNaN(km)) return prep + 10;
    return prep + Math.round(km * 2.5);
}
export function getAllDishes() {
    const dishes = [];
    restaurants.forEach(r => {
        r.menu.forEach(m => {
            dishes.push({ ...m, restaurantId: r.id, restaurantName: r.name, restaurantRating: r.rating });
        });
    });
    return dishes;
}
export function findRestaurant(id) {
    return restaurants.find(r => r.id === id);
}
export function findDish(restId, dishId) {
    const r = findRestaurant(restId);
    return r ? r.menu.find(m => m.id === dishId) : null;
}
