import { catchAsync } from "@/utils/catchAsync.util";
import { sendSuccess } from "@/utils/response.util";
import { Request, Response, NextFunction } from "express";
import { changePasswordService, getProfileService, updateProfileNameService, uploadAvatarService } from "./user.service";
import { redisConnection as redis } from "@/config/redis";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/utils/customError.util";
import { ChangePasswordSchema, UpdateProfileAvatarSchema, UpdateProfileNameSchema } from "./user.dataValidation";
import { getUserByIdService } from "../auth/auth.service";
import { comparePassword, hashPassword } from "@/utils/hash.util";
import { emailQueue } from "@/queues/email.queue";

/**
    * API 2.1: Get Profile
    * GET /api/v1/users/profile
*/
export const getProfileController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract userId from req.user (populated by Auth Middleware).
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const cacheKey = `user:profile:${userId}`;
    
    // 2. Cache Lookup: Check Redis for `user:profile:{userId}`.
    const cachedProfile = await redis.get(cacheKey);

    // 3. If Cache Hit: Return JSON data immediately (Performance target: < 50ms).
    if(cachedProfile){
        return sendSuccess("Successfully Retrieved User Profile", JSON.parse(cachedProfile), 200);
    };

    // 4. If Cache Miss: 
    //    - Query MySQL via Prisma for user details (Exclude sensitive fields like password).
    const user = await getProfileService(Number(userId));
    if (!user) {
        return next(new NotFoundError("User doesn't exist"));
    };
    
    //    - Store result in Redis `user:profile:{userId}` with 5 min TTL.
    await redis.set(`user:profile:${userId}` , JSON.stringify(user) , 'EX' , 300);

    // 5. Response: Return 200 with user data.
    return sendSuccess("Successfully Retrieved User Profile" , user , 200);
});

/**
    * API 2.2: Update Profile Name
    * PATCH /api/v1/users/profile
*/
export const updateProfileNameController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validation: Use Zod to validate optional fields (name, phone).
    const validatedData = UpdateProfileNameSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    // 2. Check if body is empty (At least one field required)
    if (Object.keys(validatedData.data).length === 0) {
        return next(new ValidationError([] , "At least one field must be provided for update."));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;

    // 3. DB Update: Update user record in MySQL.
    const updatedUser = await updateProfileNameService(Number(userId) , validatedData.data);

    // 4. Cache Invalidation: Delete `user:profile:{userId}` from Redis.
    await redis.del(`user:profile:${userId}`);

    // 5. Logging: Log the profile update event for audit.
    console.log(`[PROFILE_NAME_UPDATE]: User ${userId} updated their profile name.`);

    // 6. Response: Return 200 with updated user data.
    return sendSuccess("Profile Name updated successfully", updatedUser, 200);
});

/**
    * API 2.3: Upload Avatar
    * POST /api/v1/users/avatar
*/
export const uploadAvatarController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validation: Check if 'avatar' string is present
    const validatedData = UpdateProfileAvatarSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const { avatar } = validatedData.data;
    
    // 2. DB Update via Service
    const user = await uploadAvatarService(Number(userId) , avatar);
    if(!user){
        console.log("user doesnt exist");
    };

    // 3. Cache Invalidation: Refresh the profile cache
    await redis.del(`user:profile:${userId}`);

    // 4. Response
    return sendSuccess("Avatar updated successfully", { avatar }, 200);
});

/**
    * API 2.4: Change Password
    * POST /api/v1/users/change-password
*/
export const changePasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validation: Check `currentPassword` and `newPassword` strength.
    const validatedData = ChangePasswordSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const { oldPassword , newPassword , confirmPassword } = validatedData.data;
    
    if(newPassword !== confirmPassword){
        console.log("passwords doesnt match");
    };

    // 2. DB Fetch: Get user's current hashed password from DB.
    const user = await getUserByIdService(Number(userId));
    if(!user){
        return next(new NotFoundError("User not found"));
    };

    const userHashedPassword = user.password;

    // 3. Verification: Compare `currentPassword` with DB hash via bcrypt.
    const isMatch = await comparePassword(oldPassword , userHashedPassword);
    if(!isMatch){
        return next(new UnauthorizedError("Current password is incorrect."));
    };

    // 4. Edge Case: New password shouldn't be same as old
    if(oldPassword === newPassword){
        return next(new ValidationError([], "New password cannot be the same as the old one."));
    };

    // 6. DB Update: Hash `newPassword` (12 salt rounds) and save to DB.
    const hashedPassword = await hashPassword(newPassword);

    await changePasswordService(Number(userId) , newPassword);

    // 7. Session Management: Invalidate all other refresh tokens in Redis EXCEPT the current session.

    // 8. Queue Job: Add 'PASSWORD_CHANGE_NOTIFICATION' to BullMQ.
    await emailQueue.add('PASSWORD_CHANGE_NOTIFICATION' , {
        name: user.firstName,
        email: user.email
    });

    // 9. Response: Return 200 success.
    return sendSuccess("Password changed successfully.", {}, 200);
});

/**
    * API 2.5: Update Email
    * POST /api/v1/users/email
*/
export const updateEmailController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
});

/**
    * API 2.6: Update Phone
    * POST /api/v1/users/phone
*/
export const updatePhoneController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
});

/**
    * API 2.7: Delete Account
    * DELETE /api/v1/users/profile
*/
export const deleteAccountController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Security Check: (Optional) Re-verify password or send a final confirmation OTP.
    // 2. Active Orders Check: Query DB for orders in [PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY] status.
    // 3. Edge Case: If active orders exist, return 400 "Cannot delete account with ongoing orders".
    // 4. DB Transaction: 
    //    - Delete/Anonymize User record (onDelete: Cascade handles addresses/reviews).
    // 5. Cleanup: Delete all Redis keys associated with user (profile, addresses, cart, sessions).
    // 6. Response: Return 200 success.
});