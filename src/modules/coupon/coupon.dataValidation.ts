import z from 'zod';

export const ValidateCouponSchema = z.object({
    code: z.string().min(1, "Coupon code is required"),
    restaurantId: z.number().optional().nullable(),
    cartTotal: z.number().min(1, "Cart total must be greater than 0")
});

export type ValidateCouponSchemaData = z.infer<typeof ValidateCouponSchema>;