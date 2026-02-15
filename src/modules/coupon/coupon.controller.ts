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
    // 1. Extract & Parse Query Params
    const { restaurantId } = req.query;
    const parsedRestaurantId = restaurantId ? Number(restaurantId) : null;

    // 2. Validate if provided restaurantId is a valid number
    if (restaurantId && isNaN(parsedRestaurantId!)) {
        return next(new ValidationError([], "Invalid restaurantId"));
    };

    // 3. Fetch from DB
    const coupons = await getCouponsService(parsedRestaurantId);

    // 4. Response
    return sendSuccess("Coupons fetched successfully.", coupons, 200);
});

/**
    * API: Validate Coupon (Standalone)
    * POST /api/v1/coupons/validate
*/
export const validateCouponController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract: `code` and `orderValue` (and `restaurantId` if applicable) from body.
    const validatedData = ValidateCouponSchema.safeParse(req.body);
    if (!validatedData.success) {
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const { code , restaurantId , cartTotal } = validatedData.data;

    // 2. Fetch: Find the coupon in DB by `code`.
    const result = await validateCouponService({ 
        code, 
        restaurantId: restaurantId ?? null, 
        cartTotal 
    });
    
    // 3. Response: Return 200 with `isValid: true`, the calculated `discountAmount`, and a success message.
    return sendSuccess("Coupon is valid.", result, 200);
});