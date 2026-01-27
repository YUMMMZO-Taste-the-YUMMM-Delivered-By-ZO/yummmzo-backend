import z from 'zod';

// Restaurant Filter Schema
export const RestaurantFilterSchema = z.object({

});

export type RestaurantFilterSchemaData = z.infer<typeof RestaurantFilterSchema>;