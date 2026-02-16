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
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const cacheKey = `user:addresses:${userId}`;
    const cachedAddresses = await redis.get(cacheKey);

    if(cachedAddresses){
        return sendSuccess("Addresses retrieved successfully", JSON.parse(cachedAddresses), 200);
    };

    const addresses = await getAddressesService(Number(userId));

    await redis.set(cacheKey , JSON.stringify(addresses) , 'EX' , 300);

    return sendSuccess("Addresses retrieved successfully", addresses, 200);
});

/**
    * API 3.2: Get Single Address
    * GET /api/v1/users/addresses/:addressId
*/
export const getAddressByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };

    const userId = authUser.id;
    if (!userId){
        return next(new ValidationError([] , "User ID is required"));
    };

    const { addressId } = req.params;

    const address = await getAddressByIdService(Number(userId) , Number(addressId));
    if(!address){
        return next(new NotFoundError("Address not found or unauthorized access."));
    };

    return sendSuccess("Address retrieved successfully", address, 200);
});

/**
    * API 3.3: Add Address
    * POST /api/v1/users/addresses
*/
export const createAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const addresses = await getAddressesService(Number(userId));
    const totalAddresses = addresses ? addresses.length : 0; 

    if(totalAddresses >= 5){
        console.log("you cant have more than 5 address , delete to add more");
    };
    
    if(totalAddresses === 0){
        addressData.isDefault = true;
    }
    else if(addressData.isDefault){
        await updateAllAddressesService(Number(userId));
    };

    const newAddress = await createAddressService(Number(userId) , addressData);

    await redis.del(`user:addresses:${userId}`);

    return sendSuccess("Address added successfully", newAddress, 201);
});

/**
    * API 3.4: Update Address
    * PATCH /api/v1/users/addresses/:addressId
*/
export const updateAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const isOwner = await checkIfAddressBelongsToUserService(Number(userId) , Number(addressId));
    if(!isOwner){
        return next(new UnauthorizedError("You don't have permission to update this address."));
    };

    if(addressData.isDefault === true){
        await updateAllAddressesService(Number(userId));
    };

    const updatedAddress = await updateAddressService(Number(userId) , Number(addressId) , addressData);

    await redis.del(`user:addresses:${userId}`);

    return sendSuccess("Address updated successfully", updatedAddress, 200);
});

/**
    * API 3.5: Set Default Address
    * PATCH /api/v1/users/addresses/:addressId/default
*/
export const setDefaultAddressController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

    const result = await setDefaultAddressService(Number(userId) , Number(addressId));

    await redis.del(`user:addresses:${userId}`);

    return sendSuccess("Default address updated successfully", result[1], 200);
});