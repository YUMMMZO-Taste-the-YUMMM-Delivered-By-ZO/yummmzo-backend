import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { getCouponsService, validateCouponService } from "./coupon.service";
import { sendSuccess } from "@/utils/response.util";
import { UnauthorizedError, ValidationError } from "@/utils/customError.util";
import { ValidateCouponSchema } from "./coupon.dataValidation";

/**
    * API: Get Available Coupons
    * GET /api/v1/coupons
*/
export const getCouponsController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { restaurantId } = req.query;
    const parsedRestaurantId = restaurantId ? Number(restaurantId) : null;

    if (restaurantId && isNaN(parsedRestaurantId!)) {
        return next(new ValidationError([], "Invalid restaurantId"));
    };

    const coupons = await getCouponsService(parsedRestaurantId);

    return sendSuccess("Coupons fetched successfully.", coupons, 200);
});

/**
    * API: Validate Coupon (Standalone)
    * POST /api/v1/coupons/validate
*/
export const validateCouponController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = ValidateCouponSchema.safeParse(req.body);
    if (!validatedData.success) {
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const { code , restaurantId , cartTotal } = validatedData.data;

    const result = await validateCouponService({ 
        code, 
        restaurantId: restaurantId ?? null, 
        cartTotal 
    });

    return sendSuccess("Coupon is valid.", result, 200);
});