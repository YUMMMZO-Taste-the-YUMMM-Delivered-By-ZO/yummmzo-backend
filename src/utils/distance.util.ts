
export function calculateHaversineJS(userLat: number, userLng: number, restaurantLat: number, restaurantLng: number): number {
    const R = 6371;

    const dLat = (restaurantLat - userLat) * (Math.PI / 180);
    const dLng = (restaurantLng - userLng) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * (Math.PI / 180)) * Math.cos(restaurantLat * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
};