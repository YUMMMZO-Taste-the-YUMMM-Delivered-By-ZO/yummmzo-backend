import { prisma } from "@/config/database";

export const getCouponsService = async (restaurantId: number | null): Promise<any> => {
    try {
        const coupons = await prisma.coupon.findMany({
            where: {
                isActive: true,
                validTill: {
                    gt: new Date()
                },
                OR: [
                    { restaurantId: null },
                    { restaurantId: restaurantId }
                ]
            }
        });
        return coupons;
    } 
    catch (error) {
        console.log(`Error While Getting All Coupons : ${error}`);
        throw new Error(`Error While Getting All Coupons : ${error}`);
    }
};

export const validateCouponService = async ({code, restaurantId, cartTotal}: {code: string; restaurantId: number | null; cartTotal: number;}): Promise<any> => {
    try {
        const coupon = await prisma.coupon.findFirst({
            where: {
                code: code,
                OR: [
                    {
                        restaurantId: null
                    },
                    {
                        restaurantId: restaurantId
                    }
                ]
            },
        });

        if(!coupon){
            throw { statusCode: 400, message: "Coupon is inactive." };
        };

        if(!coupon?.isActive){
            throw { statusCode: 400, message: "Coupon is inactive." };
        };

        const now = new Date();
        if (now < coupon.validFrom) {
            throw { statusCode: 400, message: "Coupon is not yet active." };
        };

        if (now > coupon.validTill){
            throw { statusCode: 400, message: "Coupon has expired." };
        };

        if (cartTotal < coupon.minOrderValue) {
            throw { 
                statusCode: 400, 
                message: `Add ₹${coupon.minOrderValue - cartTotal} more to use this coupon.` 
            };
        };

        if ((coupon.restaurantId !== null) && (coupon.restaurantId !== restaurantId)) {
            throw { statusCode: 400, message: "Coupon not valid for this restaurant." };
        };

        let discountAmount = 0;
        if(coupon?.discountType === 'FLAT'){
            discountAmount = coupon.discountValue;
        };
        
        if(coupon?.discountType === 'PERCENTAGE'){
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            discountAmount = coupon.maxDiscount ? Math.min(discountAmount, coupon.maxDiscount) : discountAmount;
        };

        return {
            couponId: coupon.id,
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountAmount: Math.floor(discountAmount)
        };
    } 
    catch (error: any) {
        if (error.statusCode) throw error;
        console.log(`Error While Validating a Coupon : ${error}`);
        throw new Error(`Error While Validating a Coupon : ${error}`);
    }
};