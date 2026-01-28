import z from "zod";

// Register Schema
export const RegisterSchema = z.object({
    firstName: z.string().min(5 , "First Name should be atleast of 5 characters").max(50 , "First Name cannot be more than 50 characters"),
    lastName: z.string().min(5 , "Last Name should be atleast of 5 characters").max(100 , "Last Name cannot be more than 100 characters"),
    email: z.string(),
    phone: z.string().min(10 , "Phone Number should be atleast of 10 characters").max(15 , "Phone Number cannot be more than 15 characters"),
    password: z.string().min(8 , "Password should be atleast of 8 characters").max(16 , "Password cannot be more than 16 characters")
});

export type RegisterSchemaData = z.infer<typeof RegisterSchema>;

// Login Schema
export const LoginSchema = z.object({
    email: z.string(),
    password: z.string().min(8 , "Password should be atleast of 8 characters").max(16 , "Password cannot be more than 16 characters")
});

export type LoginSchemaData = z.infer<typeof LoginSchema>;

// Password Reset Schema
export const PasswordResetSchema = z.object({
    
});

export type PasswordResetSchemaData = z.infer<typeof PasswordResetSchema>;