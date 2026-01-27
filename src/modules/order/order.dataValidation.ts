import z from 'zod';

// Create Order Schema 
export const CreateOrderSchema = z.object({

});

export type CreateOrderSchemaData = z.infer<typeof CreateOrderSchema>;