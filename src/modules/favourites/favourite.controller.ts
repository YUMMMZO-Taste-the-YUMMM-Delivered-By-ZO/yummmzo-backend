import { redisConnection as redis } from "@/config/redis";
import { catchAsync } from "@/utils/catchAsync.util";
import { UnauthorizedError, NotFoundError, BadRequestError } from "@/utils/customError.util";
import { Request, Response, NextFunction } from "express";
import { checkIfFavouriteExistService, getFavouritesService, toggleFavouriteService } from "./favourite.service";
import { sendSuccess } from "@/utils/response.util";
import { getRestaurantByIdService } from "../restaurant/restaurant.service";

/**
    * API: Get All Favourites
    * GET /api/v1/favourites
*/
export const getFavouritesController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract userId from req.user (set by authMiddleware).
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };
    
    const userId = authUser.id;
    const cacheKey = `favourites:${userId}`;

    // 2. Redis check: key = `favourites:${userId}` → cache hit? Return directly.
    const cachedFavourites = await redis.get(cacheKey);
    if(cachedFavourites){
        return sendSuccess("Favourites fetched successfully", JSON.parse(cachedFavourites), 200);
    };

    // 3. Cache miss → DB Query (Prisma)
    const favourites = await getFavouritesService(Number(userId));

    // 4. Store result in Redis with TTL 300 (5 min)
    await redis.set(cacheKey, JSON.stringify(favourites), 'EX', 300);

    // 5. Response: Return 200 with list of favourite restaurants.
    return sendSuccess("Favourites fetched successfully", favourites, 200);
});

/**
    * API: Toggle Favourite (Add / Remove)
    * POST /api/v1/favourites/toggle/:restaurantId
*/
export const toggleFavouriteController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Extract userId from req.user (set by authMiddleware).
    const authUser = (req as any).user;
    if (!authUser) {
        return next(new UnauthorizedError("User session not found"));
    };
    
    const userId = authUser.id;
    const cacheKey = `favourites:${userId}`;

    // 2. Extract restaurantId from req.params. Parse to Int.
    const { restaurantId } = req.params;
    if(!restaurantId){
        return next(new BadRequestError("Restaurant ID is required"));
    };

    // 3. Validate: Check if restaurant exists in DB. If not → 404.
    const restaurant = await getRestaurantByIdService(Number(restaurantId));
    if(!restaurant){
        return next(new NotFoundError("Restaurant not found"));
    };

    // 4. DB Query (Prisma): Check if Favourite record exists with this userId + restaurantId.
    const favourite = await checkIfFavouriteExistService(Number(userId), Number(restaurantId));

    // 5. Toggle Logic:
    let toggleFavourite;
    let action: 'added' | 'removed';

    //    - If EXISTS → delete it → action = "removed"
    if(favourite){
        toggleFavourite = await toggleFavouriteService({ favouriteId: favourite.id, action: 'REMOVE' });
        action = 'removed';
    }
    //    - If NOT EXISTS → create it → action = "added"
    else{
        toggleFavourite = await toggleFavouriteService({ userId: Number(userId), restaurantId: Number(restaurantId), action: 'ADD' });
        action = 'added';
    };

    // 6. Redis: Delete cache key `favourites:${userId}` (invalidate stale data)
    await redis.del(cacheKey);

    // 7. Response: Return 200 with { action: "added" | "removed", restaurantId }
    return sendSuccess("Favourite toggled successfully", { action, restaurantId: Number(restaurantId) }, 200);
});