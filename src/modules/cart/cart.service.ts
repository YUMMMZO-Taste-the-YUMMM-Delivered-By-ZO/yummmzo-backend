import { prisma } from "@/config/database";
import { redisConnection as redis } from "@/config/redis";
import { validateCouponService } from "../coupon/coupon.service";

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
        const discount = cart.coupon ? cart.coupon.discountAmount : 0; 
        const total = itemTotal + gst + deliveryFee + packagingFee - discount;

        cart.bill = {
            itemTotal,
            gst,
            deliveryFee,
            packagingFee,
            discount,
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

export const checkIfMenuItemExistService = async (menuItemId: number, restaurantId: number): Promise<any> => {
    try {
        const item = await prisma.menu_Item.findFirst({
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

export const applyCouponService = async ({ userId, code }: { userId: number; code: string; }): Promise<any> => {
    try {
        // 1. Fetch Redis cart using key `cart:{userId}` → if empty, throw 404 "Cart not found."
        const cacheKey = `cart:${userId}`;

        const cachedCart = await redis.get(cacheKey);
        if (!cachedCart){
            throw { statusCode: 404, message: "Cart not found." };
        };

        // 2. Parse cart JSON   
        const cart = JSON.parse(cachedCart);

        // 3. Extract restaurantId and calculate cartTotal from cart.items (price * quantity)
        const restaurantId = cart.restaurantId;
        const cartTotal = cart.items.reduce((acc: number, item: any) => {
            return acc + (item.price * item.quantity);
        }, 0);

        // 4. Call validateCouponService({ code, restaurantId, cartTotal }) → get discountAmount
        const couponResult = await validateCouponService({ code, restaurantId, cartTotal });

        // 5. Attach coupon to cart:
        //    cart.coupon = { couponId, code, discountType, discountAmount }
        cart.coupon = {
            couponId: couponResult.couponId,
            code: couponResult.code,
            discountType: couponResult.discountType,
            discountAmount: couponResult.discountAmount
        };

        // 6. Recalculate bill:
        //    - itemTotal = sum of (price * quantity)
        //    - gst = itemTotal * 0.05
        //    - deliveryFee = 40
        //    - packagingFee = 10
        //    - discount = discountAmount
        //    - total = itemTotal + gst + deliveryFee + packagingFee - discount
        const itemTotal = cartTotal;
        const gst = itemTotal * 0.05;
        const deliveryFee = 40;
        const packagingFee = 10;
        const discount = cart.coupon ? cart.coupon.discountAmount : 0;
        const total = itemTotal + gst + deliveryFee + packagingFee - discount;

        // 7. Update cart.bill with new values
        cart.bill = {
            itemTotal,
            gst,
            deliveryFee,
            packagingFee,
            discount,
            total
        };

        // 8. Save updated cart to Redis (TTL: 600)
        await redis.set(cacheKey, JSON.stringify(cart), 'EX', 600);

        // 9. Return updated cart
        return cart;
    }
    catch (error: any) {
        console.log(`Error While Applying Coupon : ${error}`);
        throw new Error(`Error While Applying Coupon : ${error}`);
    }
};

export const removeCouponService = async (userId: number): Promise<any> => {
    try {
        // 1. Fetch Redis cart
        const cacheKey = `cart:${userId}`;
        const cachedCart = await redis.get(cacheKey);
        if (!cachedCart) throw { statusCode: 404, message: "Cart not found." };

        // 2. Parse cart
        const cart = JSON.parse(cachedCart);

        // 3. No coupon applied check
        if (!cart.coupon){
            throw { statusCode: 400, message: "No coupon applied." };
        };

        // 4. Remove coupon
        cart.coupon = null;

        // 5. Recalculate bill without discount
        const itemTotal = cart.items.reduce((acc: number, item: any) => {
            return acc + (item.price * item.quantity);
        }, 0);
        const gst = itemTotal * 0.05;
        const deliveryFee = 40;
        const packagingFee = 10;
        const total = itemTotal + gst + deliveryFee + packagingFee;

        // 6. Update bill
        cart.bill = {
            itemTotal,
            gst,
            deliveryFee,
            packagingFee,
            discount: 0,
            total
        };

        // 7. Save to Redis
        await redis.set(cacheKey, JSON.stringify(cart), 'EX', 600);

        // 8. Return updated cart
        return cart;
    }
    catch (error: any) {
        console.log(`Error While Removing Coupon : ${error}`);
        throw new Error(`Error While Removing Coupon : ${error}`);
    }
};