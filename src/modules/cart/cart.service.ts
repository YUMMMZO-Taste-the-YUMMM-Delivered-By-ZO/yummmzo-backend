import { prisma } from "@/config/database";


export const getCartService = async (cart: any): Promise<any> => {
    try {
        // Step 1: Initial state set karo. Ek `wasModified` flag ko false rakho.
        let wasModified = false;
        let itemTotal = 0;
        
        // Step 2: Cart items se saari `menuItemId` extract karo.
        const menuIDs = cart.items.map((item: any) => item.menuItemId);
        
        // Step 3: Prisma se batch fetch karo (findMany) saare items ki details (price, inStock).
        const itemsData = await prisma.menu_Item.findMany({
            where: {
                id: {
                    in: menuIDs
                }
            },
            include: {
                category: {
                    include: {
                        restaurant: true
                    }
                }
            }
        });
        
        // Step 4: Items Loop - Redis item ko DB item se compare karo:
        //    - Agar price badal gaya hai, Redis item update karo aur wasModified = true.
        //    - Agar inStock false hai, item ko `isAvailable: false` mark karo aur wasModified = true.
        cart.items = cart.items.map((cartItem: any) => {
            const dbItem = itemsData.find((item) => item.id === cartItem.menuItemId);

            if(!dbItem || !dbItem.inStock){
                if(cartItem.isAvailable !== false){
                    wasModified = true;
                };

                return {
                    ...cartItem,
                    isAvailable: false
                };
            };

            if(dbItem.price !== cartItem.price){
                wasModified = true;
                cartItem.price = dbItem.price;
            };

            itemTotal = itemTotal + (cartItem.price * cartItem.quantity);

            return {
                ...cartItem,
                isAvailable: true
            };
        });
        

        // Step 5: Restaurant Status Check - Kya restaurant abhi bhi OPEN hai?
        const restaurant = itemsData[0]?.category.restaurant;
        if(restaurant && restaurant.status !== 'OPEN'){
            wasModified = true;
            cart.restaurantStatus = restaurant.status;
        };
        
        // Step 6: Bill Calculation Logic:
        //    - itemTotal = sums of (price * quantity).
        //    - gst = itemTotal * 0.05 (Food par 5% GST).
        //    - deliveryFee aur packagingFee add karo.
        const gst = itemTotal * 0.05;
        const deliveryFee = 40;
        const packagingFee = 10;
        const total = itemTotal + gst + deliveryFee + packagingFee;

        cart.bill = {
            itemTotal,
            gst,
            deliveryFee,
            packagingFee,
            total
        };
        cart.restaurantDetails = restaurant;

        // Step 7: Coupon Validation (Agar cart mein coupon hai):
        //    - Check karo expiry (validTill).
        //    - Check karo minOrderValue satisfy ho rahi hai ya nahi.
        //    - Agar invalid hai, toh coupon hatao aur wasModified = true.

        // Step 8: Final object structure return karo jisme restaurant, items, aur bill details honi chahiye.
        return {
            syncedData: cart,
            wasModified
        }
    }
    catch (error) {
        console.log(`Error While Getting Users Cart : ${error}`);
        throw new Error(`Error While Getting Users Cart : ${error}`);
    }
};

export const checkIfMenuItemExistService = async (menuItemId: number , restaurantId: number): Promise<any> => {
    try {
        const item = await prisma.menu_Item.findUnique({
            where: {
                id: menuItemId,
                inStock: true,
                category: {
                    restaurantId: restaurantId
                }
            }
        });

        return item;
    }
    catch (error) {
        console.log(`Error While Checking If Item Exist : ${error}`);
        throw new Error(`Error While Checking If Item Exist : ${error}`);
    };
};

export const applyCouponService = async (): Promise<void> => {
    // logic...
    try {
        
    }
    catch (error) {
        console.log(`Error While Getting All Restaurants : ${error}`);
        throw new Error(`Error While Getting All Restaurants : ${error}`);
    }
};

export const removeCouponService = async (): Promise<void> => {
    // logic...
    try {
        
    }
    catch (error) {
        console.log(`Error While Getting All Restaurants : ${error}`);
        throw new Error(`Error While Getting All Restaurants : ${error}`);
    }
};