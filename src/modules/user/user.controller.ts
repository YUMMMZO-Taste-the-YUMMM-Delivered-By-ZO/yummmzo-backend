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
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    const cacheKey = `user:profile:${userId}`;

    const cachedProfile = await redis.get(cacheKey);
    if(cachedProfile){
        return sendSuccess("Successfully Retrieved User Profile", JSON.parse(cachedProfile), 200);
    };

    const user = await getProfileService(Number(userId));
    if (!user) {
        return next(new NotFoundError("User doesn't exist"));
    };

    await redis.set(cacheKey , JSON.stringify(user) , 'EX' , 300);

    return sendSuccess("Successfully Retrieved User Profile" , user , 200);
});

/**
    * API 2.2: Update Profile Name
    * PATCH /api/v1/users/profile
*/
export const updateProfileNameController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = UpdateProfileNameSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    if (Object.keys(validatedData.data).length === 0) {
        return next(new ValidationError([] , "At least one field must be provided for update."));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;

    const updatedUser = await updateProfileNameService(Number(userId) , validatedData.data);

    await redis.del(`user:profile:${userId}`);

    return sendSuccess("Profile Name updated successfully", updatedUser, 200);
});

/**
    * API 2.3: Upload Avatar
    * POST /api/v1/users/avatar
*/
export const uploadAvatarController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const user = await uploadAvatarService(Number(userId) , avatar);
    if(!user){
        console.log("user doesnt exist");
    };

    await redis.del(`user:profile:${userId}`);

    return sendSuccess("Avatar updated successfully", { avatar }, 200);
});

/**
    * API 2.4: Change Password
    * POST /api/v1/users/change-password
*/
export const changePasswordController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const user = await getUserByIdService(Number(userId));
    if(!user){
        return next(new NotFoundError("User not found"));
    };

    const userHashedPassword = user.password;

    const isMatch = await comparePassword(oldPassword , userHashedPassword);
    if(!isMatch){
        return next(new UnauthorizedError("Current password is incorrect."));
    };

    if(oldPassword === newPassword){
        return next(new ValidationError([], "New password cannot be the same as the old one."));
    };

    const hashedPassword = await hashPassword(newPassword);

    await changePasswordService(Number(userId) , newPassword);

    await emailQueue.add('PASSWORD_CHANGE_NOTIFICATION' , {
        name: user.firstName,
        email: user.email
    });

    return sendSuccess("Password changed successfully.", {}, 200);
});