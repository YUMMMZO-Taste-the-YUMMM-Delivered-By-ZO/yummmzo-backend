import z from 'zod';

// Create Address Schema
export const CreateAddressSchema = z.object({
    type: z.string().optional(),
    address: z.string().min(10 , "Address should be minimum of 10 characters.").max(200 , "Address should be maximum of 200 characters."),
    city: z.string().min(3 , "City should be minimum of 3 characters.").max(50 , "City should be maximum of 50 characters."),
    state: z.string().min(3 , "State should be minimum of 3 characters.").max(50 , "State should be maximum of 50 characters."),
    pincode: z.string().length(6, "Pincode must be 6 digits"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    name: z.string().min(3 , "Name should be minimum of 3 characters.").max(50 , "Name should be maximum of 50 characters."),
    phone: z.string().min(10 , "Phone Number should be atleast of 10 characters").max(15 , "Phone Number cannot be more than 15 characters"),
    isDefault: z.boolean().optional()
});

export type CreateAddressSchemaData = z.infer<typeof CreateAddressSchema>;

// Update Address Schema
export const UpdateAddressSchema = z.object({
    type: z.string().optional(),
    address: z.string().min(10 , "Address should be minimum of 10 characters.").max(200 , "Address should be maximum of 200 characters.").optional(),
    city: z.string().min(3 , "City should be minimum of 3 characters.").max(50 , "City should be maximum of 50 characters.").optional(),
    state: z.string().min(3 , "State should be minimum of 3 characters.").max(50 , "State should be maximum of 50 characters.").optional(),
    pincode: z.string().length(6, "Pincode must be 6 digits").optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    name: z.string().min(3 , "Name should be minimum of 3 characters.").max(50 , "Name should be maximum of 50 characters.").optional(),
    phone: z.string().min(10 , "Phone Number should be atleast of 10 characters").max(15 , "Phone Number cannot be more than 15 characters").optional(),
    isDefault: z.boolean().optional()
});

export type UpdateAddressSchemaData = z.infer<typeof UpdateAddressSchema>;