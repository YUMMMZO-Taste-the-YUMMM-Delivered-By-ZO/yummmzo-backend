export interface CouponTemplate {
    code: string;
    description: string;
    discountType: "FLAT" | "PERCENTAGE";
    discountValue: number;
    maxDiscount?: number;
    minOrderValue: number;
    validDays: number; // days from now
}

export const globalCoupons: CouponTemplate[] = [
    // Platform-wide coupons (no restaurantId)
    { code: "WELCOME50", description: "50% off on your first order", discountType: "PERCENTAGE", discountValue: 50, maxDiscount: 100, minOrderValue: 199, validDays: 30 },
    { code: "YUMMMZO100", description: "Flat ₹100 off on orders above ₹299", discountType: "FLAT", discountValue: 100, minOrderValue: 299, validDays: 60 },
    { code: "FREEDEL", description: "Free delivery on orders above ₹149", discountType: "FLAT", discountValue: 40, minOrderValue: 149, validDays: 30 },
    { code: "WEEKEND20", description: "20% off on weekend orders", discountType: "PERCENTAGE", discountValue: 20, maxDiscount: 150, minOrderValue: 249, validDays: 90 },
    { code: "PARTY500", description: "Flat ₹500 off on orders above ₹2000", discountType: "FLAT", discountValue: 500, minOrderValue: 2000, validDays: 60 },
    { code: "SAVE150", description: "Flat ₹150 off on orders above ₹499", discountType: "FLAT", discountValue: 150, minOrderValue: 499, validDays: 45 },
    { code: "TASTY30", description: "30% off up to ₹120", discountType: "PERCENTAGE", discountValue: 30, maxDiscount: 120, minOrderValue: 299, validDays: 30 },
    { code: "LUNCH25", description: "25% off on lunch orders (11AM-3PM)", discountType: "PERCENTAGE", discountValue: 25, maxDiscount: 100, minOrderValue: 199, validDays: 60 },
];

export const restaurantCouponTemplates: CouponTemplate[] = [
    // Templates for restaurant-specific coupons
    { code: "FLAT50", description: "Flat ₹50 off on this restaurant", discountType: "FLAT", discountValue: 50, minOrderValue: 199, validDays: 30 },
    { code: "FLAT75", description: "Flat ₹75 off on this restaurant", discountType: "FLAT", discountValue: 75, minOrderValue: 249, validDays: 30 },
    { code: "FLAT100", description: "Flat ₹100 off on this restaurant", discountType: "FLAT", discountValue: 100, minOrderValue: 299, validDays: 45 },
    { code: "OFF10", description: "10% off on this restaurant", discountType: "PERCENTAGE", discountValue: 10, maxDiscount: 80, minOrderValue: 149, validDays: 30 },
    { code: "OFF15", description: "15% off on this restaurant", discountType: "PERCENTAGE", discountValue: 15, maxDiscount: 100, minOrderValue: 199, validDays: 30 },
    { code: "OFF20", description: "20% off on this restaurant", discountType: "PERCENTAGE", discountValue: 20, maxDiscount: 120, minOrderValue: 249, validDays: 45 },
    { code: "SPECIAL25", description: "Special 25% off", discountType: "PERCENTAGE", discountValue: 25, maxDiscount: 150, minOrderValue: 299, validDays: 60 },
    { code: "DEAL200", description: "Flat ₹200 off on orders above ₹599", discountType: "FLAT", discountValue: 200, minOrderValue: 599, validDays: 30 },
];