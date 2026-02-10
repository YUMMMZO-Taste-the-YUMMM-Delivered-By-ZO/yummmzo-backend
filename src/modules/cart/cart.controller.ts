import { redisConnection as redis } from "@/config/redis";
import { catchAsync } from "@/utils/catchAsync.util";
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from "@/utils/customError.util";
import { sendSuccess } from "@/utils/response.util";
import { Request, Response, NextFunction } from "express";
import { checkIfMenuItemExistService, getCartService } from "./cart.service";
import { AddItemToCartSchema, UpdateCartItemSchema } from "./cart.dataValidation";

/**
    * API 5.1: Get Cart
    * GET /api/v1/cart
*/
export const getCartController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Fetch cart from Redis using key `cart:{userId}`.
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };
    
    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const cacheKey = `cart:${userId}`;
    const cartData = await redis.get(cacheKey);
    
    // 2. If Cart Empty: Return 200 with an empty structure and zeroed bill.
    if(!cartData){
        let result = {
            restaurant: null,
            items: [],
            bill: {
                itemTotal: 0,
                deliveryFee: 0,
                packagingFee: 0,
                gst: 0,
                discount: 0,
                total: 0
            }
        };

        return sendSuccess("Cart is empty." , result , 200);
    };

    // 3. Real-time Sync: Cross-check all items in Redis against the DB (Prisma) to ensure 'inStock' and 'price' haven't changed.
    const { syncedData , wasModified } = await getCartService(JSON.parse(cartData));

    if(wasModified){
        await redis.set(cacheKey , JSON.stringify(syncedData) , 'EX' , 600);
    };

    // 4. Response: Return 200 with restaurant details, items list, and the final bill breakdown.
    return sendSuccess("Successfully Retrieved Users Cart." , syncedData , 200);
});

/**
    * API 5.2: Add to Cart
    * POST /api/v1/cart/items
*/
export const addCartItemController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validation: Validate quantity (1-10) and customization options using Zod.
    const validatedData = AddItemToCartSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const { restaurantId , menuItemId , quantity } = validatedData.data;

    // 2. State Check: Retrieve existing cart from Redis `cart:{userId}`.
    const cacheKey = `cart:${userId}`;
    const cachedCart = await redis.get(cacheKey);

    // 3. Conflict Check: If request `restaurantId` != existing cart `restaurantId`, return 400 "Clear cart from previous restaurant?".
    let cart = cachedCart ? JSON.parse(cachedCart) : {restaurantId , items: []};
    if (cart.restaurantId !== restaurantId) {
        return next(new ConflictError("Clear cart from previous restaurant."));
    };
    
    // 4. DB Verification: Check if `itemId` exists and is `inStock`.
    const item = await checkIfMenuItemExistService(Number(menuItemId) , restaurantId);
    if(!item){
        return next(new NotFoundError("This item doesn't belong to the selected restaurant or is out of stock."));
    };

    // 5. Logic:
    //    - If item + same customizations exists, increment quantity.
    //    - Else, push new item to the items array.
    const existingItemIndex = cart.items.findIndex((i: any) => i.menuItemid === menuItemId);
    if(existingItemIndex > -1){
        let newQuantity = cart.items[existingItemIndex].quantity + quantity;
        cart.items[existingItemIndex].quantity = Math.min(newQuantity , 10);
    }
    else{
        cart.items.push({
            menuItemId,
            name: item.name,
            price: item.price,
            quantity
        })
    };
    
    // 6. Redis Store: Save updated JSON in `cart:{userId}` (TTL: 7 days).
    await redis.set(cacheKey , JSON.stringify(cart) , 'EX' , 600);

    // 7. Response: Return 200 with updated cart summary.
    return sendSuccess("Item Added to Your Cart." , cart , 201);
});

/**
    * API 5.3: Update Cart Item
    * PATCH /api/v1/cart/items/:cartItemId
*/
export const updateCartItemController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract `quantity` from body.
    const validatedData = UpdateCartItemSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const { cartItemId } = req.params;
    const { quantity } = validatedData.data;

    // 2. Fetch and Parse
    const cacheKey = `cart:${userId}`;
    const cachedCart = await redis.get(cacheKey);
    if (!cachedCart){
        return next(new NotFoundError("Cart Not Found."));
    };

    let cart = JSON.parse(cachedCart);
    
    // 3. Update or Remove Logic
    const itemIndex = cart.items.findIndex((i: any) => i.menuItemId === Number(cartItemId));
    if (itemIndex === -1) {
        return next(new NotFoundError("Item not in cart."));
    };

    if(quantity === 0){
        cart.items.splice(itemIndex , 1);

        if(cart.items.length === 0){
            await redis.del(cacheKey);
            return sendSuccess("Cart cleared because it was empty.", null, 200);
        };
    }
    else{
        cart.items[itemIndex].quantity = quantity;
    };

    // 4. Bill Recalculation logic
    let newItemTotal = 0;
    cart.items.forEach((item: any) => {
        newItemTotal = newItemTotal + (item.price * item.quantity);
    });

    const gst = newItemTotal * 0.05;
    const deliveryFee = 40;
    const packagingFee = 10;
    const total = newItemTotal + gst + deliveryFee + packagingFee;

    // 5. Update Cart State
    cart.bill = { itemTotal: newItemTotal, gst, deliveryFee, packagingFee, total };
    cart.updatedAt = new Date().toISOString();

    // 6. Redis Store
    await redis.set(cacheKey, JSON.stringify(cart), 'EX', 600);

    // 7. Response: Return 200 success.
    return sendSuccess("Cart updated successfully.", cart, 200);
});

/**
    * API 5.5: Clear Cart
    * DELETE /api/v1/cart
*/
export const clearCartController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Delete the `cart:{userId}` key from Redis.
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const cacheKey = `cart:${userId}`;

    await redis.del(cacheKey);

    const emptyCart = {
        restaurant: null,
        items: [],
        bill: {
            itemTotal: 0,
            deliveryFee: 0,
            packagingFee: 0,
            gst: 0,
            discount: 0,
            total: 0
        }
    };

    // 2. Response: Return 200 with an empty cart object.
    return sendSuccess("Cart Cleared Successfully" , emptyCart , 200);
});

/**
    * API 5.6: Apply Coupon
    * POST /api/v1/cart/coupon
*/
export const applyCouponController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Validation: Fetch coupon from DB by `code`.
    // 2. Eligibility Checks:
    //    - Expiry: `validTill` > now.
    //    - Min Order: Cart total >= `minOrderValue`.
    //    - First Order: If `isFirstOrderOnly`, check user's order count in DB.
    //    - Restaurant: If `restaurantId` is set on coupon, ensure it matches cart.
    //    - Usage: Check `maxUsagePerUser` and global `maxUsage`.
    // 3. Discount Calculation: Apply percentage or flat discount (capped at `maxDiscount`).
    // 4. Update Cart: Attach `coupon` object to the Redis cart.
    // 5. Response: Return 200 with the discount amount applied.
});

/**
    * API 5.7: Remove Coupon
    * DELETE /api/v1/cart/coupon
*/
export const removeCouponController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Fetch Redis cart.
    // 2. Set `coupon` to null and reset discount values in the bill.
    // 3. Save to Redis.
    // 4. Response: Return 200.
});