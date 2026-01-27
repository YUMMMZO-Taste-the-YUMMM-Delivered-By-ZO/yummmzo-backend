import z from 'zod';

// Review Schema
export const ReviewSchema = z.object({

});

export type ReviewSchemaData = z.infer<typeof ReviewSchema>;