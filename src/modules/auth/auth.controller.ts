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
    const validatedData = RegisterSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const {firstName , lastName , email , phone , password} = validatedData.data;

    await checkRateLimit(`rateLimit:register:ip:${req.ip}` , 10);
    await checkRateLimit(`rateLimit:register:email:${email}` , 3);

    const existingUser = await checkIfUserExistService(email , phone);
    if(existingUser){
        const field = existingUser.email === email ? "Email" : "Phone";
        return next(new ConflictError(`${field} already exists !!!`));
    };

    const hashedPassword = await hashPassword(password);

    const newUser = await registerService({firstName , lastName , email , phone , password: hashedPassword});

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await redis.set(`emailVerify:${verificationToken}` , newUser.id , 'EX' , 24 * 60 * 60);

    await emailQueue.add('VERIFICATION_EMAIL' , {
        email: newUser.email,
        name: newUser.firstName,
        token: verificationToken
    });

    return sendSuccess("Registration successful. Please verify your email.", { userId: newUser.id }, 201);
});

/**
    * API 1.2: Verify Email
    * GET /api/v1/auth/verify-email?token={token}
*/
export const verifyEmailController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.query.token as string;
    if(!token){
        return next(new ValidationError([] , "Verification token is required."));
    };

    const userId = await redis.get(`emailVerify:${token}`);
    if(!userId){
        return next(new ValidationError([] , "Invalid or expired verification token."));
    };

    const user = await verifyEmailService(Number(userId));

    await redis.del(`emailVerify:${token}`);

    return sendSuccess("Email verified successfully. You can now login.", user, 200);
});

/**
    * API 1.3: Login
    * POST /api/v1/auth/login
*/
export const loginController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = LoginSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const {email , password} = validatedData.data;

    await checkRateLimit(`rateLimit:login:ip:${req.ip}` , 10);
    await checkRateLimit(`rateLimit:login:email:${email}` , 3);

    const user = await getUserByEmailService(email);
    if(!user){
        return next(new UnauthorizedError("Invalid credentials."));
    };

    if(!user.isEmailVerified){
        return next(new ForbiddenError("Please verify your email to continue."));
    };

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        await redis.incr(`loginAttempts:${email}`);
        await redis.expire(`loginAttempts:${email}` , 1800);
        return next(new UnauthorizedError("Invalid credentials."));
    };

    await redis.del(`loginAttempts:${email}`);

    const payload = {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    };
    const token =  generateJWT(payload);

    res.cookie('jwt_token' , token);

    console.log(`[LOGIN_SUCCESS]: User ${email} logged in from IP ${req.ip} using ${req.get('User-Agent')}`);

    await emailQueue.add('WELCOME_EMAIL' , {
        email: user.email,
        name: user.firstName
    });

    return sendSuccess("Login successful", { token, user: { id: user.id , name: user.firstName, email: user.email, role: user.role } }, 200);
});

/**
    * API 1.4: Logout
    * POST /api/v1/auth/logout
*/
export const logoutController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    const token = req.cookies['jwt_token']; 

    if(token){
        await redis.set(`blacklist:${token}` , 'logged_out' , 'EX' , 24 * 60 * 60);
        console.log(`[LOGOUT]: User with token ending in ...${token.slice(-5)} logged out.`);
    };

    res.clearCookie('jwt_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    return sendSuccess("Logged out successfully", {}, 200);
});

/**
    * API 1.5: Forgot Password
    * POST /api/v1/auth/forgot-password
*/
export const forgotPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    const validatedData = ForgotPasswordSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { email } = validatedData.data;

    await checkRateLimit(`rateLimit:forgotPassword:ip:${req.ip}` , 10);
    await checkRateLimit(`rateLimit:forgotPassword:email:${email}` , 3);

    const user = await getUserByEmailService(email);

    if(!user) {
        return sendSuccess("If an account exists with this email, a reset link has been sent.", {}, 200);
    };

    const resetToken = crypto.randomBytes(32).toString('hex');

    await redis.set(`resetPassword:${resetToken}` , user.id , 'EX' , 3600);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await emailQueue.add('PASSWORD_RESET' , {
        email: user.email,
        name: user.firstName,
        data: { resetLink }
    });

    return sendSuccess("Reset link sent to your email.", {}, 200);
});

/**
    * API 1.6: Reset Password
    * POST /api/v1/auth/reset-password
*/
export const resetPasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    const validatedData = PasswordResetSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { resetToken , password , confirmPassword } = validatedData.data;

    if(password !== confirmPassword){
        return next(new ValidationError([] , "Password and Confirm Password do not match."));
    };

    const userId = await redis.get(`resetPassword:${resetToken}`);
    if(!userId) {
        return next(new ValidationError([] , "Invalid or expired reset token."));
    };

    const hashedPassword = await hashPassword(password);

    const isTokenPresent = await redis.exists(`resetPassword:${resetToken}`);
    if(isTokenPresent === 0){
        console.log("token doesnt exit...");
    };

    const updatedUser = await resetPasswordService(Number(userId) , hashedPassword);

    await redis.del(`resetToken:${resetToken}`);

    await emailQueue.add('PASSWORD_UPDATED' , {
        email: updatedUser.email,
        name: updatedUser.firstName,
    });
    
    return sendSuccess("Password updated successfully. Please login with your new password.", {}, 200);
});