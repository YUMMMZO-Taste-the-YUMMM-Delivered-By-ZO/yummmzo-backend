import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { CreateOrderSchema } from "./order.dataValidation";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/utils/customError.util";
import { redisConnection as redis } from "@/config/redis";
import { checkIfAddressBelongsToUserService } from "../address/address.ownershipValidation";
import { checkifAddressDeliverableService } from './order.ownershipValidation';
import { sendSuccess } from "@/utils/response.util";
import { emailQueue } from "@/queues/email.queue";
import { createOrderService, getOrderByIdService, getOrdersService, cancelOrderService, reorderService, updateOrderPaymentService } from "./order.service";
import { getRestaurantByIdService } from "../restaurant/restaurant.service";
import { orderStatusQueue } from "@/queues/orderStatus.queue";
import { nanoid } from "nanoid";
import { Payment_Status } from "@prisma/client";

/**
    * API 6.1: Create Order
    * POST /api/v1/orders/:userId
*/
export const createOrderController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = CreateOrderSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { addressId, deliveryInstruction, paymentMethod } = validatedData.data;

    const authUser = (req as any).user;
    if(!authUser){
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if(!userId){
        return next(new ValidationError([], "User ID is required"));
    };

    const cacheKey = `cart:${userId}`;
    const cartData = await redis.get(cacheKey);

    if(!cartData){
        return next(new NotFoundError("Cart is empty or doesn't exist."));
    };

    const userCart = JSON.parse(cartData);

    if(userCart.items.length === 0){
        return next(new NotFoundError("Cart is empty."));
    };

    const isAddressValid = await checkIfAddressBelongsToUserService(Number(userId), Number(addressId));
    if(!isAddressValid){
        return next(new ForbiddenError("This address does not belong to your account."));
    };

    const restaurantData = await getRestaurantByIdService(Number(userCart.restaurantId));
    if(!restaurantData){
        return next(new NotFoundError("Restaurant doesn't exist."));
    };

    // const isAddressDeliverable = await checkifAddressDeliverableService(Number(userId), Number(addressId), restaurantData);
    // if(!isAddressDeliverable){
    //     return next(new BadRequestError("Sorry, we don't deliver to this location yet."));
    // };

    const order = await createOrderService(Number(userId), Number(addressId), deliveryInstruction, paymentMethod, userCart);

    let paymentMetaData = {};

    if(paymentMethod === 'COD'){
        paymentMetaData = {
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            message: 'Pay on delivery'
        };
    }
    else if(paymentMethod === 'MOCK_ONLINE'){
        const mockTransactionId = `MOCK_TXN_${nanoid(10)}`;
        await updateOrderPaymentService(order.id, {
            paymentStatus: Payment_Status.COMPLETED,
            razorpayPaymentId: mockTransactionId
        });
        paymentMetaData = {
            paymentMethod: 'MOCK_ONLINE',
            paymentStatus: 'COMPLETED',
            mockTransactionId
        };
    };

    const statusProgression = [
        { status: 'CONFIRMED',        delay: 0 },
        { status: 'PREPARING',        delay: 30_000 },
        { status: 'READY',            delay: 90_000 },
        { status: 'OUT_FOR_DELIVERY', delay: 150_000 },
        { status: 'DELIVERED',        delay: 240_000 },
    ];

    for(const { status, delay } of statusProgression){
        await orderStatusQueue.add('STATUS_UPDATE', { orderId: order.id, status }, { delay });
    };

    await redis.del(cacheKey);

    await emailQueue.add('ORDER_CONFIRMATION', {
        email: authUser.email,
        orderNumber: order.orderNumber,
        totalAmount: order.total,
        orderId: order.id        
    });

    const orderDetails = { ...order, ...paymentMetaData };
    return sendSuccess("Order placed successfully.", orderDetails, 201);
});

/**
    * API 6.2: Get Orders (Order History)
    * GET /api/v1/orders/:userId
*/
export const getOrdersController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if(!authUser){
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string | undefined;

    const { orders, totalCount } = await getOrdersService(userId, { status, page, limit });

    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
        currentPage: page,
        totalPages,
        totalOrders: totalCount,
        hasNextPage: page < totalPages
    };

    return sendSuccess("Order history fetched.", { orders, pagination }, 200);
});

/**
    * API 6.3: Get Order Details
    * GET /api/v1/orders/:userId/:orderId
*/
export const getOrderByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if(!authUser){
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const orderId = Number(req.params.orderId);

    const order = await getOrderByIdService(orderId);
    if(!order){
        return next(new NotFoundError("Order not found."));
    };

    if(order.userId !== userId){
        return next(new ForbiddenError("This order does not belong to your account."));
    };

    return sendSuccess("Order details fetched.", order, 200);
});

/**
    * API 6.4: Cancel Order
    * POST /api/v1/orders/:userId/:orderId/cancel
*/
export const cancelOrderController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if(!authUser){
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const orderId = Number(req.params.orderId);

    const order = await getOrderByIdService(orderId);
    if(!order){
        return next(new NotFoundError("Order not found."));
    };

    if(order.userId !== userId){
        return next(new ForbiddenError("This order does not belong to your account."));
    };

    const cancellableStatuses = ['PENDING', 'CONFIRMED'];
    if(order.orderStatus === 'CANCELLED'){
        return next(new BadRequestError("Order is already cancelled."));
    };

    if(!cancellableStatuses.includes(order.orderStatus)){
        return next(new BadRequestError("Restaurant has already started preparing your food."));
    };

    await cancelOrderService(orderId);

    let refundInfo: any = { refunded: false };
    if(order.paymentMethod === 'ONLINE' && order.paymentStatus === 'COMPLETED'){
        await updateOrderPaymentService(orderId, {
            paymentStatus: Payment_Status.REFUNDED
        });
        refundInfo = { refunded: true };
    };

    await emailQueue.add('ORDER_CANCELLATION', {
        email: authUser.email,
        orderNumber: order.orderNumber
    });

    return sendSuccess("Order cancelled successfully.", { orderId, status: 'CANCELLED', refundInfo }, 200);
});

/**
    * API 6.5: Reorder
    * POST /api/v1/orders/:userId/:orderId/reorder
*/
export const reorderController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if(!authUser){
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const orderId = Number(req.params.orderId);

    const { cart, skippedItems } = await reorderService(userId, orderId);

    return sendSuccess("Cart ready. Proceed to checkout.", { cart, skippedItems }, 200);
});