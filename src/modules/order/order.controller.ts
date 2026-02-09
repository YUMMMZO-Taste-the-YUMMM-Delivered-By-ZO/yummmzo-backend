import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { CreateOrderSchema } from "./order.dataValidation";
import { BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "@/utils/customError.util";
import { redisConnection as redis } from "@/config/redis";
import { checkIfAddressBelongsToUserService } from "../address/address.ownershipValidation";
import { checkifAddressDeliverableService } from './order.ownershipValidation';
import { sendSuccess } from "@/utils/response.util";
import { emailQueue } from "@/queues/email.queue";
import { createOrderService, updateOrderStatusService } from "./order.service";
import { getRestaurantByIdService } from "../restaurant/restaurant.service";

/**
    * API 6.1: Create Order
    * POST /api/v1/orders
*/
export const createOrderController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validate Data
    const validatedData = CreateOrderSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { addressId , deliveryInstruction , paymentMethod } = validatedData.data;
    const { userId } = req.params;

    // 2. Pre-check: Fetch cart from Redis. If empty, return 400.
    const cachekey = `cart:${userId}`;
    const cartData = await redis.get(cachekey);
    if(!cartData){
        return next(new NotFoundError("Cart is empty or doesn't exist."));
    };

    const userCart = JSON.parse(cartData);

    // 3. Address Check: Verify `addressId` belongs to user and is within restaurant delivery radius.
    const isAddressBelongsToUser = await checkIfAddressBelongsToUserService(Number(userId) , Number(addressId));
    if(!isAddressBelongsToUser){
        return next(new ForbiddenError("This address does not belong to your account."));
    };

    const restaurantData = await getRestaurantByIdService(Number(userCart.restaurantId));
    if(!restaurantData){
        return next(new NotFoundError("Restaurant Doesnt Exist."));
    };

    const isAddressDeliverable = await checkifAddressDeliverableService(Number(userId) , Number(addressId), restaurantData);
    if(!isAddressDeliverable){
        return next(new BadRequestError("Sorry, we don't deliver to this location yet."));
    };

    // 4. DB Transaction (Prisma):
    //    - Create Order record with status `PENDING`.
    //    - Create OrderItem records.
    const order = await createOrderService(Number(userId) , Number(addressId) , deliveryInstruction , paymentMethod , userCart);

    // 5. Payment Logic:
    let paymentMetaData = {};
    //    - If COD: Set status to `CONFIRMED`.
    if(paymentMethod === 'COD'){
        await redis.del(cachekey);

        await emailQueue.add('ORDER_CONFIRMATION', {
            email: "",
            orderNumber: order.orderNumber,
            totalAmount: order.total,
        });

        await updateOrderStatusService(Number(order.id));
    }
    //    - If ONLINE: Create Razorpay Order and return `razorpayOrderId`. ----> Cant Implement Right Now , as Razorpay is not verified
    else {
        // Razorpay Api Call..
        console.log("Cant Order , Because Razorpay is Not Verified Yet.");
    };

    // 8. Response: Return 201 with order details and payment metadata.
    let orderDetails = {};

    return sendSuccess("Order placed successfully" , orderDetails , 201);
});

/**
    * API 6.2: Get Orders (Order History)
    * GET /api/v1/orders
*/
export const getOrdersController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract userId and Query Params (status, page, limit).
    // 2. Fetch: Query Prisma for orders including Restaurant (name, image) and OrderItems.
    // 3. Filter: Apply status filters (e.g., DELIVERED, CANCELLED) if provided.
    // 4. Sort: Default to `createdAt: desc` to show recent orders first.
    // 5. Response: Return 200 with paginated order history.
});

/**
    * API 6.3: Get Order Details
    * GET /api/v1/orders/:orderId
*/
export const getOrderByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Fetch: Get order by ID including items, restaurant, delivery address, and status history.
    // 2. Ownership: Ensure the order belongs to the requesting `userId`.
    // 3. Dynamic Data: Fetch latest `deliveryPartner` location if status is `OUT_FOR_DELIVERY`.
    // 4. Response: Return 200 with full order tracking object.
});

/**
    * API 6.4: Cancel Order
    * POST /api/v1/orders/:orderId/cancel
*/
export const cancelOrderController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. State Check: Find order and verify status is `PENDING` or `CONFIRMED`.
    // 2. Constraint: If status is `PREPARING` or later, return 400 "Restaurant has already started preparing your food".
    // 3. DB Update: Set status to `CANCELLED` and log the reason.
    // 4. Refund Logic: If `paymentMethod` was ONLINE and `paymentStatus` is PAID, initiate Razorpay Refund.
    // 5. Queue: Send cancellation email/notification via BullMQ.
    // 6. Response: Return 200 success.
});

/**
    * API 6.5: Reorder
    * POST /api/v1/orders/:orderId/reorder
*/
export const reorderController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Fetch previous order items and restaurantId.
    // 2. Validation: Check if the restaurant is still `isActive` and items are `inStock`.
    // 3. Cart Logic: 
    //    - Clear existing Redis cart (if it contains items from a different restaurant).
    //    - Push all available items from the previous order into the Redis cart.
    // 4. Response: Return 200 with the new cart summary (User then proceeds to checkout).
});