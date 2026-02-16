import { redisConnection as redis } from "@/config/redis";
import { catchAsync } from "@/utils/catchAsync.util";
import { UnauthorizedError, NotFoundError, BadRequestError } from "@/utils/customError.util";
import { Request, Response, NextFunction } from "express";
import { checkIfFavouriteExistService, getFavouriteIdsService, getFavouritesService, toggleFavouriteService } from "./favourite.service";
import { sendSuccess } from "@/utils/response.util";
import { getRestaurantByIdService } from "../restaurant/restaurant.service";

/**
    * API: Get All Favourites
    * GET /api/v1/favourites
*/
export const getFavouritesController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };
    
    const userId = authUser.id;
    const cacheKey = `favourites:${userId}`;

    const cachedFavourites = await redis.get(cacheKey);
    if(cachedFavourites){
        return sendSuccess("Favourites fetched successfully", JSON.parse(cachedFavourites), 200);
    };

    const favourites = await getFavouritesService(Number(userId));

    await redis.set(cacheKey, JSON.stringify(favourites), 'EX', 300);

    return sendSuccess("Favourites fetched successfully", favourites, 200);
});

/**
    * API: Get Favourite Restaurant IDs
    * GET /api/v1/favourites/ids
*/
export const getFavouriteIdsController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };
    
    const userId = authUser.id;

    const cacheKey = `favourites:ids:${userId}`;

    const cachedIds = await redis.get(cacheKey);
    if(cachedIds){
        if(cachedIds){
            return sendSuccess("Fetched", JSON.parse(cachedIds), 200);  
        };
    };

    const ids = await getFavouriteIdsService(Number(userId));

    await redis.set(cacheKey , JSON.stringify(ids) , 'EX' , 300);

    return sendSuccess("Favourite IDs fetched", ids, 200);
});

/**
    * API: Toggle Favourite (Add / Remove)
    * POST /api/v1/favourites/toggle/:restaurantId
*/
export const toggleFavouriteController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };
    
    const userId = authUser.id;
    const cacheKey = `favourites:${userId}`;

    const { restaurantId } = req.params;
    if(!restaurantId){
        return next(new BadRequestError("Restaurant ID is required"));
    };

    const restaurant = await getRestaurantByIdService(Number(restaurantId));
    if(!restaurant){
        return next(new NotFoundError("Restaurant not found"));
    };

    const favourite = await checkIfFavouriteExistService(Number(userId), Number(restaurantId));

    let toggleFavourite;
    let action: 'added' | 'removed';

    if(favourite){
        toggleFavourite = await toggleFavouriteService({ favouriteId: favourite.id, action: 'REMOVE' });
        action = 'removed';
    }
    else{
        toggleFavourite = await toggleFavouriteService({ userId: Number(userId), restaurantId: Number(restaurantId), action: 'ADD' });
        action = 'added';
    };

    await redis.del(cacheKey);
    await redis.del(`favourites:ids:${userId}`);

    return sendSuccess("Favourite toggled successfully", { action, restaurantId: Number(restaurantId) }, 200);
});