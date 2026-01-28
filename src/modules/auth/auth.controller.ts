import crypto from 'crypto';
import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { RegisterSchema } from "./auth.dataValidation";
import { sendError, sendSuccess } from "@/utils/response.util";
import { redisConnection as redis } from '../../config/redis'
import { hashPassword } from '@/utils/hash.util';
import { ConflictError, ValidationError } from '@/utils/customError.util';
import { checkIfUserExistService, registerService } from './auth.service';
import { emailQueue } from '@/queues/email.queue';
import { checkRateLimit } from '@/utils/rateLimit.util';

/**
    * API 1.1: Register User
    * POST /api/v1/auth/register
*/
export const registerController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validate request body (name, email, phone, password) using Zod/Joi.
    const validatedData = RegisterSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const {firstName , lastName , email , phone , password} = validatedData.data;

    // 2. Check Redis for rate limiting: `ratelimit:register:{ip}` (Max 5/15min).
    await checkRateLimit(`rateLimit:register:${req.ip}` , 5);

    // 3. Database Check: Ensure email and phone do not already exist (Return 409 if they do).
    const existingUser = await checkIfUserExistService(email , phone);
    if(existingUser){
        const field = existingUser.email === email ? "Email" : "Phone";
        return next(new ConflictError(`${field} already exists !!!`));
    };

    // 4. Security: Hash password using bcrypt (Salt rounds: 12).
    const hashedPassword = await hashPassword(password);

    // 5. Transaction: Create User record in MySQL via Prisma.
    const newUser = await registerService({firstName , lastName , email , phone , password: hashedPassword});

    // 6. Token Generation: Create a secure email verification token (crypto.randomBytes).
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 7. Redis Store: Save token `emailVerify:{token} -> userId` with 24hr TTL.
    await redis.set(`emailVerify:${verificationToken}` , newUser.id , 'EX' , 24 * 60 * 60);

    // 8. Queue Job: Add 'VERIFICATION' email task to BullMQ (email-notifications queue).
    await emailQueue.add('VERIFICATION_EMAIL' , {
        email: newUser.email,
        name: newUser.firstName,
        token: verificationToken
    });

    // 9. Response: Return 201 with userId and success message.
    return sendSuccess("Registration successful. Please verify your email.", { userId: newUser.id }, 201);
});

/**
    * API 1.2: Login
    * POST /api/v1/auth/login
*/
export const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Check Rate Limit: Verify against `ratelimit:login:{ip}`.
    // 2. Security: Check if account is locked in Redis `loginAttempts:{email}` (5 fails = 30min lock).
    // 3. DB Fetch: Find user by email.
    // 4. Edge Case: If not found, return 401 "Invalid credentials" (Generic for security).
    // 5. Verification Check: If `isEmailVerified` is false, return 403.
    // 6. Password Match: Compare provided password with hashed DB password via bcrypt.
    // 7. On Failure: Increment Redis `loginAttempts`, return 401.
    // 8. JWT Generation: Sign Access Token (15min) and Refresh Token (7 days).
    // 9. Session Store: Save refresh token in Redis `refreshToken:{userId}:{tokenId}`.
    // 10. Logging: Log login attempt with IP and User-Agent.
    // 11. Response: Return 200 with tokens and user object.
});

/**
    * API 1.3: Logout
    * POST /api/v1/auth/logout
*/
export const logoutController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
    // 1. Extract accessToken and refreshToken.
    // 2. Blacklist: Add accessToken to Redis `blacklist:{token}` with remaining TTL.
    // 3. Session Removal: Delete refreshToken from Redis `refreshToken:{userId}:{tokenId}`.
    // 4. Logging: Log logout event.
    // 5. Response: Return 200 "Logged out successfully".
});

/**
    * API 1.4: Verify Email
    * GET /api/v1/auth/verify-email?token={token}
*/
export const verifyEmailController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract token from query params.
    // 2. Redis Check: Retrieve userId from `emailVerify:{token}`.
    // 3. Edge Case: If no token/expired, return 400 "Invalid or Expired token".
    // 4. Update DB: Set `isEmailVerified = true` for the user.
    // 5. Cleanup: Delete the verification token from Redis.
    // 6. Response: Return 200 and redirect or notify success.
});

/**
    * API 1.5: Forgot Password
    * POST /api/v1/auth/forgot-password
*/
export const forgotPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
    // 1. Rate Limit Check: 3 requests/hour per email.
    // 2. DB Check: Find user by email.
    // 3. Security: Always return 200 "Link sent" even if email doesn't exist.
    // 4. Token Generation: Create secure reset token.
    // 5. Redis Store: Save `resetPassword:{token} -> userId` (TTL: 1 hour).
    // 6. Cleanup: Invalidate any existing reset tokens for this user.
    // 7. Queue Job: Add 'PASSWORD_RESET' email task to BullMQ.
});

/**
    * API 1.6: Reset Password
    * POST /api/v1/auth/reset-password
*/
export const resetPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
    // 1. Redis Check: Validate token exists in `resetPassword:{token}`.
    // 2. Strength Check: Validate new password against Zod schema (min 8 chars, 1 upper, 1 spec).
    // 3. Security: Hash new password (bcrypt).
    // 4. DB Update: Update user password.
    // 5. Session Wipe: Delete all `refreshToken:{userId}:*` from Redis (Logout everywhere).
    // 6. Cleanup: Delete reset token from Redis.
    // 7. Queue Job: Send password change confirmation email.
});