import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";

/**
    * API 3.2: Get All Addresses
    * GET /api/v1/users/addresses
*/
export const getAddressesController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract userId from req.user.
    // 2. Cache Lookup: Check Redis for `user:addresses:{userId}`.
    // 3. If Cache Hit: Return parsed JSON immediately.
    // 4. If Cache Miss: Query Prisma for all addresses where userId matches.
    // 5. Redis Store: Save result in `user:addresses:{userId}` (TTL: 10 min).
    // 6. Response: Return 200 with address array.
});

/**
    * API: Get Single Address
    * GET /api/v1/users/addresses/:addressId
*/
export const getAddressByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract addressId from params and userId from req.user.
    // 2. DB Fetch: Find unique address where id = addressId AND userId = userId.
    // 3. Edge Case: If not found or belongs to another user, return 404 "Address not found".
    // 4. Response: Return 200 with specific address details.
});

/**
    * API 3.1: Add Address
    * POST /api/v1/users/addresses
*/
export const createAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Validation: Use Zod to validate label, pincode (6 digits), lat/long, etc.
    // 2. Limit Check: Query DB for count of addresses for this userId.
    // 3. Constraint: If count >= 5, return 400 "Maximum 5 addresses allowed".
    // 4. Default Logic: 
    //    - If this is the user's first address, force `isDefault = true`.
    //    - If `isDefault` is true in request, set all existing addresses for user to `isDefault = false` first.
    // 5. DB Insert: Create new address record via Prisma.
    // 6. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    // 7. Response: Return 201 with created address.
});

/**
    * API 3.3: Update Address
    * PATCH /api/v1/users/addresses/:addressId
*/
export const updateAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Ownership Check: Verify addressId belongs to current userId.
    // 2. Validation: Partial update validation via Zod.
    // 3. Default Logic: If updating `isDefault` to true, set all other addresses for user to false.
    // 4. DB Update: Update fields in MySQL.
    // 5. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    // 6. Response: Return 200 with updated address.
});

/**
    * API 3.4: Delete Address
    * DELETE /api/v1/users/addresses/:addressId
*/
export const deleteAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Ownership Check: Verify address exists and belongs to userId.
    // 2. Pending Orders Check: If this address is linked to an order with status CONFIRMED/PREPARING/READY.
    // 3. Edge Case: If it's the only address AND has pending orders, return 400.
    // 4. Default Migration: If deleting the `isDefault` address and others exist, set the most recent one as default.
    // 5. DB Delete: Remove address record.
    // 6. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    // 7. Response: Return 200 success.
});

/**
    * API: Set Default Address
    * PATCH /api/v1/users/addresses/:addressId/default
*/
export const setDefaultAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Ownership Check: Verify addressId belongs to userId.
    // 2. Transaction: 
    //    - Set all addresses for this userId to `isDefault = false`.
    //    - Set current addressId to `isDefault = true`.
    // 3. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    // 4. Response: Return 200 "Default address updated".
});