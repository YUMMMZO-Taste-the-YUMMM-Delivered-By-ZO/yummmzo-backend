import { prisma } from "@/config/database";
import { redisConnection as redis } from "@/config/redis";
import { validateCouponService } from "../coupon/coupon.service";

export const getCartService = async (cart: any): Promise<any> => {
    try {
        let wasModified = false;
        let itemTotal = 0;

        const menuIDs = cart.items.map((item: any) => item.menuItemId);

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
        

        const restaurant = itemsData[0]?.category.restaurant;
        if(restaurant && restaurant.status !== 'OPEN'){
            wasModified = true;
            cart.restaurantStatus = restaurant.status;
        };

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
        const cacheKey = `cart:${userId}`;

        const cachedCart = await redis.get(cacheKey);
        if (!cachedCart){
            throw { statusCode: 404, message: "Cart not found." };
        };

        const cart = JSON.parse(cachedCart);

        const restaurantId = cart.restaurantId;
        const cartTotal = cart.items.reduce((acc: number, item: any) => {
            return acc + (item.price * item.quantity);
        }, 0);

        const couponResult = await validateCouponService({ code, restaurantId, cartTotal });

        cart.coupon = {
            couponId: couponResult.couponId,
            code: couponResult.code,
            discountType: couponResult.discountType,
            discountAmount: couponResult.discountAmount
        };

        const itemTotal = cartTotal;
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

        await redis.set(cacheKey, JSON.stringify(cart), 'EX', 600);

        return cart;
    }
    catch (error: any) {
        console.log(`Error While Applying Coupon : ${error}`);
        throw new Error(`Error While Applying Coupon : ${error}`);
    }
};

export const removeCouponService = async (userId: number): Promise<any> => {
    try {
        const cacheKey = `cart:${userId}`;
        const cachedCart = await redis.get(cacheKey);
        if (!cachedCart) throw { statusCode: 404, message: "Cart not found." };

        const cart = JSON.parse(cachedCart);

        if (!cart.coupon){
            throw { statusCode: 400, message: "No coupon applied." };
        };

        cart.coupon = null;

        const itemTotal = cart.items.reduce((acc: number, item: any) => {
            return acc + (item.price * item.quantity);
        }, 0);
        const gst = itemTotal * 0.05;
        const deliveryFee = 40;
        const packagingFee = 10;
        const total = itemTotal + gst + deliveryFee + packagingFee;

        cart.bill = {
            itemTotal,
            gst,
            deliveryFee,
            packagingFee,
            discount: 0,
            total
        };

        await redis.set(cacheKey, JSON.stringify(cart), 'EX', 600);

        return cart;
    }
    catch (error: any) {
        console.log(`Error While Removing Coupon : ${error}`);
        throw new Error(`Error While Removing Coupon : ${error}`);
    }
};