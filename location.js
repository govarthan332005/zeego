// ============================================================
// ZEEGO — Location detection (best effort; fallbacks gracefully)
// ============================================================
import { CITY_COORDS } from './data.js';

const LS_LOC = 'zeego_location';

export function getSavedLocation() {
    return JSON.parse(localStorage.getItem(LS_LOC) || 'null');
}
export function saveLocation(loc) {
    localStorage.setItem(LS_LOC, JSON.stringify(loc));
    window.dispatchEvent(new Event('zeego:location-updated'));
}

/**
 * Try browser geolocation first; if denied/unavailable, use default city coords.
 * Then reverse-geocode via Nominatim (open) for a friendly label.
 */
export function detectLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            const loc = { ...CITY_COORDS, address: 'Home – 2nd Cross, Vijayawada' };
            saveLocation(loc); resolve(loc); return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude, lng = pos.coords.longitude;
                let address = 'Current location';
                try {
                    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    const j = await r.json();
                    address = j.display_name?.split(',').slice(0, 3).join(',') || address;
                } catch (e) {}
                const loc = { lat, lng, address };
                saveLocation(loc); resolve(loc);
            },
            () => {
                const loc = { ...CITY_COORDS, address: 'Home – 2nd Cross, Vijayawada' };
                saveLocation(loc); resolve(loc);
            },
            { timeout: 6000, maximumAge: 300000 }
        );
    });
}
