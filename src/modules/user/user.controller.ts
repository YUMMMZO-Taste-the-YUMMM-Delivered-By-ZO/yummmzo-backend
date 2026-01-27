import { Request, Response, NextFunction } from "express";

/**
    * API 2.1: Get Profile
    * GET /api/v1/users/profile
*/
export const getProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract userId from req.user (populated by Auth Middleware).
    // 2. Cache Lookup: Check Redis for `user:profile:{userId}`.
    // 3. If Cache Hit: Return JSON data immediately (Performance target: < 50ms).
    // 4. If Cache Miss: 
    //    - Query MySQL via Prisma for user details (Exclude sensitive fields like password).
    //    - Store result in Redis `user:profile:{userId}` with 5 min TTL.
    // 5. Response: Return 200 with user data.
};

/**
    * API 2.2: Update Profile
    * PATCH /api/v1/users/profile
*/
export const updateProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Validation: Use Zod to validate optional fields (name, phone).
    // 2. Edge Case: If no fields provided in body, return 400.
    // 3. Uniqueness Check: If phone is being updated, check if new phone already exists in DB.
    // 4. DB Update: Update user record in MySQL.
    // 5. Cache Invalidation: Delete `user:profile:{userId}` from Redis.
    // 6. Logging: Log the profile update event for audit.
    // 7. Response: Return 200 with updated user data.
};

/**
    * API 2.3: Change Password
    * POST /api/v1/users/change-password
*/
export const changePasswordController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Validation: Check `currentPassword` and `newPassword` strength.
    // 2. DB Fetch: Get user's current hashed password from DB.
    // 3. Verification: Compare `currentPassword` with DB hash via bcrypt.
    // 4. Edge Case: If it doesn't match, return 401 "Current password incorrect".
    // 5. Edge Case: If `newPassword` is same as `currentPassword`, return 400.
    // 6. DB Update: Hash `newPassword` (12 salt rounds) and save to DB.
    // 7. Session Management: Invalidate all other refresh tokens in Redis EXCEPT the current session.
    // 8. Queue Job: Add 'PASSWORD_CHANGE_NOTIFICATION' to BullMQ.
    // 9. Response: Return 200 success.
};

/**
    * API 2.4: Upload Avatar
    * POST /api/v1/users/avatar
*/
export const uploadAvatarController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Middleware: Use Multer to handle `multipart/form-data`.
    // 2. File Validation: Check type (jpg, png, webp) and size (Max 2MB).
    // 3. Image Processing: Resize image to 200x200 (using Sharp).
    // 4. Storage: Upload processed image to AWS S3/Cloudinary.
    // 5. Cleanup: If user already has an avatar URL, delete the old file from S3.
    // 6. DB Update: Update `avatar` URL in User table.
    // 7. Cache Invalidation: Delete `user:profile:{userId}` from Redis.
    // 8. Response: Return 200 with the new avatar URL.
};

/**
    * API 2.5: Delete Account
    * DELETE /api/v1/users/profile
*/
export const deleteAccountController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Security Check: (Optional) Re-verify password or send a final confirmation OTP.
    // 2. Active Orders Check: Query DB for orders in [PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY] status.
    // 3. Edge Case: If active orders exist, return 400 "Cannot delete account with ongoing orders".
    // 4. DB Transaction: 
    //    - Delete/Anonymize User record (onDelete: Cascade handles addresses/reviews).
    // 5. Cleanup: Delete all Redis keys associated with user (profile, addresses, cart, sessions).
    // 6. Response: Return 200 success.
};