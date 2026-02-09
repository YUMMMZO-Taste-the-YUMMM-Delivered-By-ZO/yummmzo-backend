import { prisma } from "@/config/database";
import { generateOrderID } from "@/utils/orderID.util";
import { BadRequestError, NotFoundError } from "openai";

export const createOrderService = async (userId: number, addressId: number, deliveryInstruction: string | undefined, paymentMethod: string, userCart: any): Promise<any> => {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. FRESH DATA SYNC (The Source of Truth)
            // - Restaurant fetch karo using userCart.restaurantId; check karo status 'OPEN' hai aur 'isActive' true hai
            // - Cart ke saare menuItemIds nikaalo aur MySQL se fresh price aur inStock status fetch karo
            const restaurantId = userCart.restaurantId;
            const restaurant = await tx.restaurant.findUnique({
                where: {
                    id: restaurantId,
                }
            });

            // 2. VALIDATION LOCK
            // - Agar restaurant CLOSED ya INACTIVE hai, toh Error throw karo
            if (!restaurant || !restaurant.isActive || restaurant.status !== 'OPEN') {
                // throw new BadRequestError("Restaurant is currently unavailable.");
                console.log("Restaurant is currently unavailable.");
            };

            // - Loop chalao: Agar koi bhi item 'inStock' false hai, toh "Item Unavailable" error throw karo
            const itemIDs = userCart.items.map((item: any) => item.menuItemId);

            const dbItems = await tx.menu_Item.findMany({
                where: {
                    id: { in: itemIDs }
                }
            });

            if (dbItems.length !== itemIDs.length) {
                // throw new NotFoundError("Some items in your cart no longer exist.");
                console.log("Some items in your cart no longer exist.")
            };

            dbItems.forEach(dbItem => {
                if (!dbItem.inStock) {
                    // throw new BadRequestError(`${dbItem.name} is currently out of stock.`);
                    console.log(`${dbItem.name} is currently out of stock.`);
                };
            });

            // 3. PRICE & BILL RE-CALCULATION (Security Check)
            // - DB se aaye hue prices ko use karke re-calculate karo:
            //   - calculatedItemTotal = Σ(db_price * quantity) [cite: 13, 28]
            const calculatedItemTotal = dbItems.reduce((total , dbItem) => {
                const cartItem = userCart.items.find((item: any) => item.menuItemId === dbItem.id);
                return total + (dbItem.price * (cartItem?.quantity || 0));
            }, 0);

            //   - calculatedGst = calculatedItemTotal * 0.05 (ya jo bhi tere business logic mein ho) [cite: 23]
            const calculatedGst = calculatedItemTotal * 0.05;

            //   - calculatedTotal = calculatedItemTotal + deliveryFee + packagingFee + gst - discount [cite: 23]
            const calculatedTotal = calculatedItemTotal + deliveryFee + packagingFee + calculatedGst - discount;

            // - Isse userCart.bill se compare karo; agar mismatch hai, toh user ko warning do (Tampering protection)
            if((userCart.bill.itemTotal !== calculatedItemTotal) || (userCart.bill.gst !== calculatedGst) || (userCart.bill.deliveryFee !== deliveryFee) || (userCart.bill.packagingFee !== packagingFee) || (userCart.bill.total !== discount)){
                console.log("Bill Mismatch !!!");
            };

            // 4. COUPON VALIDATION (If applicable)
            // - Agar userCart.couponId exist karta hai:
            //   - Coupon fetch karo; check karo 'isActive' hai, 'validTill' past mein nahi hai, aur usage limit cross nahi hui [cite: 18, 19]
            //   - Check karo 'minOrderValue' meet ho rahi hai ya nahi [cite: 19]

            // 5. GENERATE UNIQUE ORDER NUMBER
            // - Create a string like `YUM-XXXXXXXX` using nanoid
            const order_number = generateOrderID();

            // 6. CREATE ORDER RECORD
            // - tx.order.create() use karo:
            //   - Fields: orderNumber, userId, restaurantId, addressId, orderStatus: 'PENDING', 
            //   - paymentMethod, paymentStatus: 'PENDING', itemTotal, deliveryFee, 
            //   - packagingFee, gst, total, discount, couponId, instructions: deliveryInstruction

            // 7. CREATE ORDER ITEMS
            // - tx.order_Item.createMany() use karo:
            //   - Mapping userCart.items to match Order_Item schema (orderId, menuItemId, name, price, quantity, itemTotal)

            // 8. UPDATE COUPON USAGE (If applicable)
            // - Agar coupon use hua hai, toh tx.coupon.update() karke 'currentUsage' ko increment (+1) karo

            // 9. LOG INITIAL STATUS HISTORY
            // - tx.order_Status_History.create(): orderId, status: 'PENDING'

            // 10. RETURN ORDER OBJECT
            // - Pura created order return karo taaki controller use response mein bhej sake
        });
    }
    catch (error) {
        // Error logging aur standard Error throw karna mat bhulna
        console.log(`Error While Creating Order: ${error}`);
        throw error; 
    }
};

export const updateOrderStatusService = async (orderId: number): Promise<any> => {
    try {
        
    }
    catch (error) {
        console.log(`Error While Updating Users Password : ${error}`);
        throw new Error(`Error While Updating Users Password : ${error}`);
    }
};

export const getOrdersService = async (): Promise<void> => {
    try {
        
    }
    catch (error) {
        console.log(`Error While Updating Users Password : ${error}`);
        throw new Error(`Error While Updating Users Password : ${error}`);
    }
};

export const getOrderByIdService = async (): Promise<void> => {
    try {
        
    }
    catch (error) {
        console.log(`Error While Updating Users Password : ${error}`);
        throw new Error(`Error While Updating Users Password : ${error}`);
    }
};

export const cancelOrderService = async (): Promise<void> => {
    try {
        
    }
    catch (error) {
        console.log(`Error While Updating Users Password : ${error}`);
        throw new Error(`Error While Updating Users Password : ${error}`);
    }
};

export const reorderService = async (): Promise<void> => {
    try {
        
    }
    catch (error) {
        console.log(`Error While Updating Users Password : ${error}`);
        throw new Error(`Error While Updating Users Password : ${error}`);
    }
};