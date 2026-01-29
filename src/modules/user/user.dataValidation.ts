import z from 'zod';

// Update Profile Name Schema
export const UpdateProfileNameSchema = z.object({
    firstName: z.string().min(2 , "First Name should be atleast of 2 characters").max(50 , "First Name cannot be more than 50 characters").optional(),
    lastName: z.string().min(5 , "Last Name should be atleast of 5 characters").max(100 , "Last Name cannot be more than 100 characters").optional(),
});

export type UpdateProfileNameSchemaData = z.infer<typeof UpdateProfileNameSchema>;

// Update Profile Avatar Schema
export const UpdateProfileAvatarSchema = z.object({
    avatar: z.string()
});

export type UpdateProfileAvatarSchemaData = z.infer<typeof UpdateProfileAvatarSchema>;

// Change Password Schema
export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(8 , "Password should be atleast of 8 characters").max(16 , "Password cannot be more than 16 characters"),
    newPassword: z.string().min(8 , "Password should be atleast of 8 characters").max(16 , "Password cannot be more than 16 characters"),
    confirmPassword: z.string().min(8 , "Password should be atleast of 8 characters").max(16 , "Password cannot be more than 16 characters"),
});

export type ChangePasswordSchemaData = z.infer<typeof ChangePasswordSchema>;

// Address Schema
export const AddressSchema = z.object({

});

export type AddressSchemaData = z.infer<typeof AddressSchema>;