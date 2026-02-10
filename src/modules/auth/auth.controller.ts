import crypto from 'crypto';
import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { ForgotPasswordSchema, LoginSchema, PasswordResetSchema, RegisterSchema } from "./auth.dataValidation";
import { sendSuccess } from "@/utils/response.util";
import { redisConnection as redis } from '../../config/redis'
import { comparePassword, hashPassword } from '@/utils/hash.util';
import { ConflictError, ForbiddenError, UnauthorizedError, ValidationError } from '@/utils/customError.util';
import { checkIfUserExistService, getUserByEmailService, registerService, resetPasswordService, verifyEmailService } from './auth.service';
import { emailQueue } from '@/queues/email.queue';
import { checkRateLimit } from '@/utils/rateLimit.util';
import { generateJWT } from '@/utils/jwt.util';

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
    await checkRateLimit(`rateLimit:register:ip:${req.ip}` , 10);
    await checkRateLimit(`rateLimit:register:email:${email}` , 3);

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
    * API 1.2: Verify Email
    * GET /api/v1/auth/verify-email?token={token}
*/
export const verifyEmailController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract token from query params.
    const token = req.query.token as string;
    if(!token){
        return next(new ValidationError([] , "Verification token is required."));
    };
    
    // 2. Redis Check: Retrieve userId from `emailVerify:{token}`.
    const userId = await redis.get(`emailVerify:${token}`);

    // 3. Edge Case: If no token/expired, return 400 "Invalid or Expired token".
    if(!userId){
        return next(new ValidationError([] , "Invalid or expired verification token."));
    };

    // 4. Update DB: Set `isEmailVerified = true` for the user.
    const user = await verifyEmailService(Number(userId));

    // 5. Cleanup: Delete the verification token from Redis.
    await redis.del(`emailVerify:${token}`);

    // 6. Response: Return 200 and redirect or notify success.
    return sendSuccess("Email verified successfully. You can now login.", user, 200);
});

/**
    * API 1.3: Login
    * POST /api/v1/auth/login
*/
export const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validate request body (email, password) using Zod/Joi.
    const validatedData = LoginSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const {email , password} = validatedData.data;

    // 2. Check Rate Limit: Verify against `ratelimit:login:{ip}` & `ratelimit:login:{email}`.
    await checkRateLimit(`rateLimit:login:ip:${req.ip}` , 10);
    await checkRateLimit(`rateLimit:login:email:${email}` , 3);

    // 3. Security: Check if account is locked in Redis (5 fails = 30min lock)

    // 4. Single DB Fetch: User and verification status
    const user = await getUserByEmailService(email);

    // 5. Generic Error for non-existent users
    if(!user){
        return next(new UnauthorizedError("Invalid credentials."));
    };

    // 6. Verification Check
    if(!user.isEmailVerified){
        return next(new ForbiddenError("Please verify your email to continue."));
    };

    // 7. Password Match: Compare provided password with hashed DB password via bcrypt.
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        // 8. On Failure: Increment Redis `loginAttempts`, return 401.
        await redis.incr(`loginAttempts:${email}`);
        await redis.expire(`loginAttempts:${email}` , 1800);
        return next(new UnauthorizedError("Invalid credentials."));
    };

    // 9. Success: Reset login attempts on successful login
    await redis.del(`loginAttempts:${email}`);

    // 10. JWT Generation: Sign Access Token (15min)
    const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    };
    const token =  generateJWT(payload);

    // 11. Cookie Store (HttpOnly for security)
    res.cookie('jwt_token' , token);

    // 12. Logging: Log login attempt with IP and User-Agent.
    console.log(`[LOGIN_SUCCESS]: User ${email} logged in from IP ${req.ip} using ${req.get('User-Agent')}`);

    // 13. Queue Job: Add 'WELCOME_EMAIL' email task to BullMQ (email-notifications queue).
    await emailQueue.add('WELCOME_EMAIL' , {
        email: user.email,
        name: user.firstName
    });

    // 14. Response: Return 200 with tokens and user object.
    return sendSuccess("Login successful", { token, user: { name: user.firstName, email: user.email, role: user.role } }, 200);
});

/**
    * API 1.4: Logout
    * POST /api/v1/auth/logout
*/
export const logoutController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    // 1. Extract JWT Token from cookies
    const token = req.cookies['jwt_token'];
    console.log(token);

    // 2. Blacklist: Add token to Redis
    if(token){
        await redis.set(`blacklist:${token}` , 'logged_out' , 'EX' , 24 * 60 * 60);
        // 3. Logging: Log logout event.
        console.log(`[LOGOUT]: User with token ending in ...${token.slice(-5)} logged out.`);
    };

    // 4. Clear the Cookie from browser
    res.clearCookie('jwt_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    // 5. Response: Return 200 "Logged out successfully".
    return sendSuccess("Logged out successfully", {}, 200);
});

/**
    * API 1.5: Forgot Password
    * POST /api/v1/auth/forgot-password
*/
export const forgotPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    // 1. Validate request body (email) using Zod/Joi.
    const validatedData = ForgotPasswordSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { email } = validatedData.data;

    // 2. Rate Limit Check: 3 requests/hour per email.
    await checkRateLimit(`rateLimit:forgotPassword:ip:${req.ip}` , 10);
    await checkRateLimit(`rateLimit:forgotPassword:email:${email}` , 3);

    // 3. DB Check: Find user by email.
    const user = await getUserByEmailService(email);

    // 4. Security: Always return 200 "Link sent" even if email doesn't exist.
    if(!user) {
        // Hum link nahi bhejenge, par response 200 hi denge
        return sendSuccess("If an account exists with this email, a reset link has been sent.", {}, 200);
    };

    // 5. Token Generation: Create secure reset token.
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 6. Redis Store: Save `resetPassword:{token} -> userId` (TTL: 1 hour).
    await redis.set(`resetPassword:${resetToken}` , user.id , 'EX' , 3600);

    // 7. Queue Job: Add 'PASSWORD_RESET' email task to BullMQ.
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await emailQueue.add('PASSWORD_RESET' , {
        email: user.email,
        name: user.firstName,
        data: { resetLink }
    });

    // 8. Response: Return 200 "Reset Link Sent to your Email".
    return sendSuccess("Reset link sent to your email.", {}, 200);
});

/**
    * API 1.6: Reset Password
    * POST /api/v1/auth/reset-password
*/
export const resetPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    // 1. Validate request body (token , password , confirmPassword) using Zod/Joi.
    const validatedData = PasswordResetSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { resetToken , password , confirmPassword } = validatedData.data;

    if(password !== confirmPassword){
        return next(new ValidationError([] , "Password and Confirm Password do not match."));
    };

    // 2. Redis Check & Fetch userId
    const userId = await redis.get(`resetPassword:${resetToken}`);
    if(!userId) {
        return next(new ValidationError([] , "Invalid or expired reset token."));
    };

    // 3. Security: Hash new password (bcrypt).
    const hashedPassword = await hashPassword(password);

    const isTokenPresent = await redis.exists(`resetPassword:${resetToken}`);
    if(isTokenPresent === 0){
        console.log("token doesnt exit...");
    };

    // 4. DB Update: Update user password.
    const updatedUser = await resetPasswordService(Number(userId) , hashedPassword);

    // 5. Cleanup: Delete reset token from Redis.
    await redis.del(`resetToken:${resetToken}`);

    // 6. Queue Job: Send password change confirmation email.
    await emailQueue.add('PASSWORD_UPDATED' , {
        email: updatedUser.email,
        name: updatedUser.firstName,
    });
    
    // 7. Response: Return 200 "Password Updated".
    return sendSuccess("Password updated successfully. Please login with your new password.", {}, 200);
});