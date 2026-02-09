import { prisma } from "@/config/database";
import { calculateHaversineJS } from "@/utils/distance.util";

export const checkifAddressDeliverableService = async (userId: number, addressId: number, restaurantData: any): Promise<any> => {
    try {
        // 1. Prisma query to find address by ID
        const userAddress = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId: userId
            }
        });
        if (!userAddress) {
            return false;
        };

        // 2. Extract userLat and userLng from address record
        const { latitude: userLat, longitude: userLng } = userAddress;        

        // 3. Extract restLat and restLng from restaurantData
        const { latitude: restLat, longitude: restLng } = restaurantData;
        
        // 4. Check if any coordinate is missing; if so, return false
        if (userLat === null || userLng === null || restLat === null || restLng === null) {
            return false;
        };
        
        // 5. Apply Haversine formula to find distance 'd' in kilometers
        const distance = calculateHaversineJS(userLat , userLng , restLat , restLng);
        
        // 6. Define MAX_RADIUS = 5 (or fetch from config)
        const MAX_RADIUS = 20;
        
        // 7. Return (d <= MAX_RADIUS)
        return distance <= MAX_RADIUS;
    }
    catch (error) {
        console.log(`Error While Checking If Address Deliverable : ${error}`);
        throw new Error(`Error While Checking If Address Deliverable : ${error}`);  
    }
};