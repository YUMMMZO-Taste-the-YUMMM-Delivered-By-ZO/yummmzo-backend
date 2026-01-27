import z from 'zod';

// Search Query Schema
export const SearchQuerySchema = z.object({

});

export type SearchQuerySchemaData = z.infer<typeof SearchQuerySchema>;