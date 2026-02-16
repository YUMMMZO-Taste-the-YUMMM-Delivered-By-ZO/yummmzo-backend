import { redisConnection as redis } from "@/config/redis";
import { catchAsync } from "@/utils/catchAsync.util";
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from "@/utils/customError.util";
import { sendSuccess } from "@/utils/response.util";
import { Request, Response, NextFunction } from "express";
import { applyCouponService, checkIfMenuItemExistService, getCartService, removeCouponService } from "./cart.service";
import { AddItemToCartSchema, ApplyCouponSchema, UpdateCartItemSchema } from "./cart.dataValidation";

/**
    * API 5.1: Get Cart
    * GET /api/v1/cart
*/
export const getCartController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const { syncedData , wasModified } = await getCartService(JSON.parse(cartData));

    if(wasModified){
        await redis.set(cacheKey , JSON.stringify(syncedData) , 'EX' , 600);
    };

    return sendSuccess("Successfully Retrieved Users Cart." , syncedData , 200);
});

/**
    * API 5.2: Add to Cart
    * POST /api/v1/cart/items
*/
export const addCartItemController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const cacheKey = `cart:${userId}`;
    const cachedCart = await redis.get(cacheKey);

    let cart = cachedCart ? JSON.parse(cachedCart) : {restaurantId , items: []};
    if (cart.restaurantId !== restaurantId) {
        return next(new ConflictError("Clear cart from previous restaurant."));
    };
    
    const item = await checkIfMenuItemExistService(Number(menuItemId) , restaurantId);
    if(!item){
        return next(new NotFoundError("This item doesn't belong to the selected restaurant or is out of stock."));
    };

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

    await redis.set(cacheKey , JSON.stringify(cart) , 'EX' , 600);

    return sendSuccess("Item Added to Your Cart." , cart , 201);
});

/**
    * API 5.3: Update Cart Item
    * PATCH /api/v1/cart/items/:cartItemId
*/
export const updateCartItemController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const cacheKey = `cart:${userId}`;
    const cachedCart = await redis.get(cacheKey);
    if (!cachedCart){
        return next(new NotFoundError("Cart Not Found."));
    };

    let cart = JSON.parse(cachedCart);

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

    let newItemTotal = 0;
    cart.items.forEach((item: any) => {
        newItemTotal = newItemTotal + (item.price * item.quantity);
    });

    const gst = newItemTotal * 0.05;
    const deliveryFee = 40;
    const packagingFee = 10;
    const total = newItemTotal + gst + deliveryFee + packagingFee;

    cart.bill = { itemTotal: newItemTotal, gst, deliveryFee, packagingFee, total };
    cart.updatedAt = new Date().toISOString();

    await redis.set(cacheKey, JSON.stringify(cart), 'EX', 600);

    return sendSuccess("Cart updated successfully.", cart, 200);
});

/**
    * API 5.5: Clear Cart
    * DELETE /api/v1/cart
*/
export const clearCartController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    return sendSuccess("Cart Cleared Successfully" , emptyCart , 200);
});

/**
    * API 5.6: Apply Coupon
    * POST /api/v1/cart/coupon
*/
export const applyCouponController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = ApplyCouponSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { code } = validatedData.data;

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const updatedCart = await applyCouponService({ userId, code });

    return sendSuccess("Coupon applied successfully.", updatedCart, 200);
});

/**
    * API 5.7: Remove Coupon
    * DELETE /api/v1/cart/coupon
*/
export const removeCouponController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const updatedCart = await removeCouponService(Number(userId));

    return sendSuccess("Coupon applied successfully.", updatedCart, 200);
});