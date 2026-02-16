import { prisma } from "@/config/database";
import { redisConnection as redis } from "@/config/redis";
import { generateOrderID } from "@/utils/orderID.util";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/customError.util";
import { Order_Status, Payment_Method, Payment_Status } from "@prisma/client";

export const createOrderService = async ( userId: number, addressId: number, deliveryInstruction: string | undefined, paymentMethod: string, userCart: any ): Promise<any> => {
    try {
        return await prisma.$transaction(async (tx) => {

            const restaurant = await tx.restaurant.findUnique({
                where: { id: userCart.restaurantId }
            });

            if(!restaurant || !restaurant.isActive || restaurant.status !== 'OPEN'){
                throw new BadRequestError("Restaurant is currently unavailable.");
            };

            const itemIDs = userCart.items.map((item: any) => item.menuItemId);

            const dbItems = await tx.menu_Item.findMany({
                where: { id: { in: itemIDs } }
            });

            if(dbItems.length !== itemIDs.length){
                throw new NotFoundError("Some items in your cart no longer exist.");
            };

            for(const dbItem of dbItems){
                if(!dbItem.inStock){
                    throw new BadRequestError(`${dbItem.name} is currently out of stock.`);
                };
            };

            const calculatedItemTotal = dbItems.reduce((total, dbItem) => {
                const cartItem = userCart.items.find((i: any) => i.menuItemId === dbItem.id);
                return total + (dbItem.price * (cartItem?.quantity || 0));
            }, 0);

            const calculatedGst = calculatedItemTotal * 0.05;
            const deliveryFee = 40;
            const packagingFee = 10;
            const discount = userCart.coupon?.discountAmount ?? 0;
            const calculatedTotal = calculatedItemTotal + calculatedGst + deliveryFee + packagingFee - discount;

            if(calculatedTotal !== userCart.bill?.total){
                console.warn(`Bill mismatch for userId ${userId}: expected ${userCart.bill?.total}, got ${calculatedTotal}`);
            };

            if(userCart.coupon){
                const coupon = await tx.coupon.findUnique({
                    where: { id: userCart.coupon.couponId }
                });

                if(!coupon || !coupon.isActive){
                    throw new BadRequestError("Coupon is no longer valid.");
                };

                if(new Date(coupon.validTill) < new Date()){
                    throw new BadRequestError("Coupon has expired.");
                };

                if(calculatedItemTotal < coupon.minOrderValue){
                    throw new BadRequestError(`Minimum order value for this coupon is ₹${coupon.minOrderValue}.`);
                };
            };

            const orderNumber = generateOrderID();

            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    restaurantId: userCart.restaurantId,
                    addressId,
                    orderStatus: Order_Status.PENDING,
                    paymentMethod: paymentMethod === 'MOCK_ONLINE' ? Payment_Method.ONLINE : Payment_Method.COD,
                    paymentStatus: Payment_Status.PENDING,
                    itemTotal: calculatedItemTotal,
                    deliveryFee,
                    packagingFee,
                    gst: calculatedGst,
                    discount,
                    total: calculatedTotal,
                    couponId: userCart.coupon?.couponId ?? null,
                }
            });

            await tx.order_Item.createMany({
                data: userCart.items.map((cartItem: any) => {
                    const dbItem = dbItems.find((d) => d.id === cartItem.menuItemId);
                    return {
                        orderId: order.id,
                        menuItemId: cartItem.menuItemId,
                        name: cartItem.name,
                        price: dbItem!.price,
                        quantity: cartItem.quantity,
                        itemTotal: dbItem!.price * cartItem.quantity
                    };
                })
            });

            await tx.order_Status_History.create({
                data: {
                    orderId: order.id,
                    status: Order_Status.PENDING
                }
            });

            return order;
        });
    }
    catch(error) {
        console.log(`Error While Creating Order: ${error}`);
        throw error;
    }
};

export const updateOrderStatusService = async (orderId: number, status: string): Promise<any> => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if(!order){
            throw new NotFoundError("Order not found.");
        };

        if(order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'){
            console.log(`Skipping status update for order ${orderId} — already ${order.orderStatus}`);
            return;
        };

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: status as Order_Status }
        });

        await prisma.order_Status_History.create({
            data: {
                orderId,
                status: status as Order_Status
            }
        });

        return updatedOrder;
    }
    catch(error) {
        console.log(`Error While Updating Order Status: ${error}`);
        throw error;
    }
};

export const updateOrderPaymentService = async ( orderId: number, paymentData: { paymentStatus: Payment_Status; razorpayPaymentId?: string } ): Promise<any> => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { ...paymentData }
        });

        return updatedOrder;
    }
    catch(error) {
        console.log(`Error While Updating Order Payment: ${error}`);
        throw error;
    }
};

export const getOrdersService = async ( userId: number, filters: { status?: string; page: number; limit: number }): Promise<any> => {
    try {
        const where: any = { userId };
        if(filters.status){
            where.orderStatus = filters.status;
        };

        const skip = (filters.page - 1) * filters.limit;

        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: filters.limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    restaurant: { select: { id: true, name: true, image: true } },
                    items: { select: { name: true, quantity: true, price: true, itemTotal: true } },
                    address: { select: { address: true, city: true, state: true, pincode: true } }
                }
            }),
            prisma.order.count({ where })
        ]);

        return { orders, totalCount };
    }
    catch(error) {
        console.log(`Error While Fetching Orders: ${error}`);
        throw error;
    }
};

export const getOrderByIdService = async (orderId: number): Promise<any> => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                restaurant: { select: { id: true, name: true, image: true, location: true, deliveryTime: true } },
                items: {
                    include: {
                        menuItem: {
                            select: { image: true }
                        }
                    }
                },
                address: true,
                statusHistory: { orderBy: { createdAt: 'asc' } }
            }
        });

        return order;
    }
    catch(error) {
        console.log(`Error While Fetching Order: ${error}`);
        throw error;
    }
};

export const cancelOrderService = async (orderId: number): Promise<any> => {
    try {
        return await prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where: { id: orderId }
            });

            if(!order){
                throw new NotFoundError("Order not found.");
            };

            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { orderStatus: Order_Status.CANCELLED }
            });

            await tx.order_Status_History.create({
                data: {
                    orderId,
                    status: Order_Status.CANCELLED
                }
            });

            return updatedOrder;
        });
    }
    catch(error) {
        console.log(`Error While Cancelling Order: ${error}`);
        throw error;
    }
};

export const reorderService = async (userId: number, orderId: number): Promise<any> => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if(!order){
            throw new NotFoundError("Order not found.");
        };

        if(order.userId !== userId){
            throw new ForbiddenError("This order does not belong to your account.");
        };

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: order.restaurantId }
        });

        if(!restaurant || !restaurant.isActive || restaurant.status !== 'OPEN'){
            throw new BadRequestError("This restaurant is currently unavailable.");
        };

        const menuItemIds = order.items.map((i) => i.menuItemId);

        const dbItems = await prisma.menu_Item.findMany({
            where: { id: { in: menuItemIds } }
        });

        const availableItems = dbItems.filter((i) => i.inStock);

        const skippedItems = order.items
            .filter((oi) => !availableItems.find((a) => a.id === oi.menuItemId))
            .map((oi) => oi.name);

        if(availableItems.length === 0){
            throw new BadRequestError("None of the items are currently available.");
        };

        const cacheKey = `cart:${userId}`;
        const existingCartRaw = await redis.get(cacheKey);

        if(existingCartRaw){
            const existingCart = JSON.parse(existingCartRaw);
            if(existingCart.restaurantId !== order.restaurantId){
                await redis.del(cacheKey);
            };
        };

        const newCart: any = {
            restaurantId: order.restaurantId,
            items: availableItems.map((dbItem) => {
                const prevItem = order.items.find((oi) => oi.menuItemId === dbItem.id);
                return {
                    menuItemId: dbItem.id,
                    name: dbItem.name,
                    price: dbItem.price,
                    quantity: prevItem!.quantity
                };
            })
        };

        const itemTotal = newCart.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const gst = itemTotal * 0.05;
        const deliveryFee = 40;
        const packagingFee = 10;

        newCart.bill = {
            itemTotal,
            gst,
            deliveryFee,
            packagingFee,
            discount: 0,
            total: itemTotal + gst + deliveryFee + packagingFee
        };

        await redis.set(cacheKey, JSON.stringify(newCart), 'EX', 600);

        return { cart: newCart, skippedItems };
    }
    catch(error) {
        console.log(`Error While Reordering: ${error}`);
        throw error;
    }
};