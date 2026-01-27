import z from 'zod';

// Register Schema
export const RegisterSchema = z.object({
    
});

export type RegisterSchemaData = z.infer<typeof RegisterSchema>;

// Login Schema
export const LoginSchema = z.object({
    
});

export type LoginSchemaData = z.infer<typeof LoginSchema>;

// Password Reset Schema
export const PasswordResetSchema = z.object({

});

export type PasswordResetSchemaData = z.infer<typeof PasswordResetSchema>;