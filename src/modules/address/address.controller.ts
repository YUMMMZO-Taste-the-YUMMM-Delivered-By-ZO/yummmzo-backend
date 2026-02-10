import { redisConnection as redis } from "@/config/redis";
import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { createAddressService, getAddressByIdService, getAddressesService, setDefaultAddressService, updateAddressService, updateAllAddressesService } from "./address.service";
import { sendSuccess } from "@/utils/response.util";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/utils/customError.util";
import { CreateAddressSchema, UpdateAddressSchema } from "./address.dataValidation";
import { checkIfAddressBelongsToUserService } from "./address.ownershipValidation";

/**
    * API 3.1: Get All Addresses
    * GET /api/v1/users/addresses
*/
export const getAddressesController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract userId from req.user.
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    // 2. Cache Lookup: Check Redis for `user:addresses:{userId}`.
    const cacheKey = `user:addresses:${userId}`;
    const cachedAddresses = await redis.get(cacheKey);

    // 3. If Cache Hit: Return parsed JSON immediately.
    if(cachedAddresses){
        return sendSuccess("Addresses retrieved successfully", JSON.parse(cachedAddresses), 200);
    };

    // 4. If Cache Miss: Query Prisma for all addresses where userId matches.
    const addresses = await getAddressesService(Number(userId));

    // 5. Redis Store: Save result in `user:addresses:{userId}` (TTL: 10 min).
    await redis.set(cacheKey , JSON.stringify(addresses) , 'EX' , 600);

    // 6. Response: Return 200 with address array.
    return sendSuccess("Addresses retrieved successfully", addresses, 200);
});

/**
    * API 3.2: Get Single Address
    * GET /api/v1/users/addresses/:addressId
*/
export const getAddressByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract addressId from params and userId from req.user.
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const { addressId } = req.params;
    
    // 2. DB Fetch: Find unique address where id = addressId AND userId = userId.
    const address = await getAddressByIdService(Number(userId) , Number(addressId));

    // 3. Edge Case: If not found or belongs to another user, return 404 "Address not found".
    if(!address){
        return next(new NotFoundError("Address not found or unauthorized access."));
    };

    // 4. Response: Return 200 with specific address details.
    return sendSuccess("Address retrieved successfully", address, 200);
});

/**
    * API 3.3: Add Address
    * POST /api/v1/users/addresses
*/
export const createAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validation: Use Zod to validate label, pincode (6 digits), lat/long, etc.
    const validatedData = CreateAddressSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    let addressData = { ...validatedData.data };

    // 2. Limit Check: Query DB for count of addresses for this userId.
    const addresses = await getAddressesService(Number(userId));
    const totalAddresses = addresses ? addresses.length : 0; // Fixed .length
    
    // 3. Constraint: If count >= 5, return 400 "Maximum 5 addresses allowed".
    if(totalAddresses >= 5){
        console.log("you cant have more than 5 address , delete to add more");
    };
    
    // 4. Default Logic: 
    //    - If this is the user's first address, force `isDefault = true`.
    if(totalAddresses === 0){
        addressData.isDefault = true;
    }
    //    - If `isDefault` is true in request, set all existing addresses for user to `isDefault = false` first.
    else if(addressData.isDefault){
        await updateAllAddressesService(Number(userId));
    };
    
    // 5. DB Insert: Create new address record via Prisma.
    const newAddress = await createAddressService(Number(userId) , addressData);

    // 6. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    await redis.del(`user:addresses:${userId}`);

    // 7. Response: Return 201 with created address.
    return sendSuccess("Address added successfully", newAddress, 201);
});

/**
    * API 3.4: Update Address
    * PATCH /api/v1/users/addresses/:addressId
*/
export const updateAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validation: Partial update validation via Zod.
    const validatedData = UpdateAddressSchema.safeParse(req.body);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const { addressId } = req.params;
    let addressData = { ...validatedData.data };

    // 2. Ownership Check: Verify addressId belongs to current userId.
    const isOwner = await checkIfAddressBelongsToUserService(Number(userId) , Number(addressId));
    if(!isOwner){
        return next(new UnauthorizedError("You don't have permission to update this address."));
    };

    // 3. Default Logic: If updating `isDefault` to true, set all other addresses for user to false.
    if(addressData.isDefault === true){
        await updateAllAddressesService(Number(userId));
    };

    // 4. DB Update: Update fields in MySQL.
    const updatedAddress = await updateAddressService(Number(userId) , Number(addressId) , addressData);

    // 5. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    await redis.del(`user:address:${userId}`);

    // 6. Response: Return 200 with updated address.
    return sendSuccess("Address updated successfully", updatedAddress, 200);
});

/**
    * API 3.5: Set Default Address
    * PATCH /api/v1/users/addresses/:addressId/default
*/
export const setDefaultAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Ownership Check: Verify addressId belongs to userId.
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };
    
    const { addressId } = req.params;

    const isOwner = await checkIfAddressBelongsToUserService(Number(userId) , Number(addressId));
    if(!isOwner){
        return next(new UnauthorizedError("You don't have permission to delete this address."));
    };

    // 2. Transaction: 
    //    - Set all addresses for this userId to `isDefault = false`.
    //    - Set current addressId to `isDefault = true`.
    const result = await setDefaultAddressService(Number(userId) , Number(addressId));

    // 3. Cache Invalidation: Delete `user:addresses:{userId}` from Redis.
    await redis.del(`user:address:${userId}`);

    // 4. Response: Return 200 "Default address updated".
    return sendSuccess("Default address updated successfully", result[1], 200);
});

/**
    * API 3.6: Delete Address
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
