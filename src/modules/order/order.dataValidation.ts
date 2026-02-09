import z from 'zod';

// Create Order Schema 
export const CreateOrderSchema = z.object({
    addressId: z.number(),
    deliveryInstruction: z.string().min(10 , "Delivery Instruction should be minimum of 10 characters.").max(100 , "Delivery Instruction should be maximum of 100 characters.").optional(),
    paymentMethod: z.enum(['ONLINE' , 'COD'])
});

export type CreateOrderSchemaData = z.infer<typeof CreateOrderSchema>;