import z from 'zod';

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
    sort: z.enum(["distance", "rating", "deliveryTime", "recommended"]).default("distance"),
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("12").transform(Number)
});

export type RestaurantFilterSchemaData = z.infer<typeof RestaurantFilterSchema>;