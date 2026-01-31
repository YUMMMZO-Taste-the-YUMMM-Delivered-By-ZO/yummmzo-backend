import z from 'zod';

// Add to Cart Schema
export const AddItemToCartSchema = z.object({
    restaurantId: z.number(),
    menuItemId: z.number(),
    quantity: z.number().min(1).max(10)
});

export type AddItemToCartSchemaData = z.infer<typeof AddItemToCartSchema>;

// Update Cart Schema
export const UpdateCartItemSchema = z.object({
    quantity: z.number().min(1).max(10)
});

export type UpdateCartItemSchemaData = z.infer<typeof UpdateCartItemSchema>;