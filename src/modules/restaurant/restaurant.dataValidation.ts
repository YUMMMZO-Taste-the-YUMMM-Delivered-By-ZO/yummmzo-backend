import z from 'zod';

// Top Picks Schema
export const TopPicksSchema = z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
});

export type TopPicksSchemaData = z.infer<typeof TopPicksSchema>;

// Restaurant Filter Schema
export const RestaurantFilterSchema = z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
    search: z.string().optional(),
    cuisine: z.string().optional(), 
    dietary: z.string().optional(),
    rating: z.string().optional().transform((val) => val ? Number(val) : undefined),
    priceRange: z.string().optional(),
    maxTime: z.string().optional().transform((val) => val ? Number(val) : undefined),
    freeDelivery: z.string().optional().transform((val) => val === 'true'),
    sort: z.enum(["RECOMMENDED", "FASTEST_DELIVERY", "RATING", "DISTANCE"]).optional().default("DISTANCE"),
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("12").transform(Number)
});

export type RestaurantFilterSchemaData = z.infer<typeof RestaurantFilterSchema>;

// Restaurant Detail Schema
export const RestaurantDetailSchema = z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
});

export type RestaurantDetailSchemaData = z.infer<typeof RestaurantDetailSchema>;

// Menu Schema
export const MenuSchema = z.object({
    search: z.string().optional(),
    sort: z.enum(["RECOMMENDED", "PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW", "RATING"]).optional().default("RECOMMENDED"),
    isVeg: z.string().optional().transform((val) => val === 'true'),
    isBestseller: z.string().optional().transform((val) => val === 'true'),
    spiceLevel: z.enum(["NORMAL", "MILD", "MEDIUM", "HOT", "EXTRA_SPICY"]).optional().default("NORMAL"),
});

export type MenuSchemaData = z.infer<typeof MenuSchema>;

// Smart Order Schema
export const SmartOrderSchema = z.object({
    craving: z.string().min(5, "Craving is too short to process")
});

export type SmartOrderSchemaData = z.infer<typeof SmartOrderSchema>;