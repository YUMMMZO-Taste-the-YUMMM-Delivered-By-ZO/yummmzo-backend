import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { RestaurantFilterSchema } from "./restaurant.dataValidation";
import { ValidationError } from "@/utils/customError.util";
import { redisConnection as redis } from "@/config/redis";
import { sendSuccess } from "@/utils/response.util";
import crypto from 'crypto';
import { getRestaurantsService } from "./restaurant.service";

/**
    * API 4.1: List Restaurants (with Search & Filters)
    * GET /api/v1/restaurants
    
    * Query Params:
        *   - lat, lng (required): User's current location
        *   - cuisine (optional): Comma-separated cuisine names - "Indian,Chinese"
        *   - rating (optional): Minimum rating filter - 4
        *   - isVeg (optional): Boolean - show only veg restaurants
        *   - sort (optional): "rating" | "deliveryTime" | "distance" (default: distance)
        *   - page, limit (optional): Pagination - default page=1, limit=12
*/
export const getRestaurantsController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // 1. Validate lat/lng presence
    const validatedData = RestaurantFilterSchema.safeParse(req.query); 
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    // 2. Build cache key: `restaurants:list:${md5(queryParams)}`
    const queryString = JSON.stringify(validatedData.data);
    const hash = crypto.createHash('md5').update(queryString).digest('hex');
    const cacheKey = `restaurants:list:${hash}`;

    // 3. If cache hit → return cached response
    const cachedData = await redis.get(cacheKey);
    if(cachedData){
        const parsedData = JSON.parse(cachedData);
        return sendSuccess("Restaurants fetched successfully From Cache." , parsedData , 200);
    };

    // 4. cache miss -> Call Service
    const restaurants = await getRestaurantsService(validatedData.data);

    // 6. Cache result (TTL: 5 min)
    await redis.set(cacheKey , JSON.stringify(restaurants) , 'EX' , 300);

    // 7. Return { restaurants, pagination: { page, limit, total, hasMore } }
    return sendSuccess("Restaurants fetched successfully" , { restaurants } , 200);
});

/**
    * API 4.2: Get Restaurant Details
    * GET /api/v1/restaurants/:restaurantId
    
    * Params: restaurantId
    * Query: lat, lng (optional - for distance calculation)
*/
export const getRestaurantByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //  * Flow:
        //  *   1. Validate restaurantId
        //  *   2. Cache key: `restaurant:details:${restaurantId}`
        //  *   3. If cache hit → return (still calculate isOpen dynamically)
        //  *   4. If cache miss:
        //  *      a. Fetch restaurant with cuisines relation
        //  *      b. If not found OR isActive=false → 404
        //  *   5. Calculate isOpen from openingTime/closingTime
        //  *   6. Calculate distance if lat/lng provided
        //  *   7. Cache result (TTL: 10 min)
        //  *   8. Return { restaurant: { ...details, isOpen, distance, cuisines } }
});

/**
    * API 4.3: Get Restaurant Menu
    * GET /api/v1/restaurants/:restaurantId/menu
    
    * Params: restaurantId
*/
export const getRestaurantMenuController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // * Flow:
    //     *   1. Cache key: `restaurant:menu:${restaurantId}`
    //     *   2. If cache hit → return
    //     *   3. If cache miss:
    //     *      a. Fetch categories where restaurantId, ordered by sortOrder
    //     *      b. For each category, fetch menuItems where inStock=true
    //     *      c. Sort items: bestsellers first, then by rating
    //     *   4. Structure: [{ id, name, items: [{ id, name, price, isVeg, isBestseller, ... }] }]
    //     *   5. Cache result (TTL: 15 min)
    //     *   6. Return { menu: categories }
});

/**
    * API 4.2: Get Restaurant Reviews
    * GET /api/v1/restaurants/:restaurantId/reviews
    
    * Params: restaurantId
    * Query: page (default 1), limit (default 10)
*/
export const getRestaurantReviewsController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // * Flow:
    //     *   1. Cache key: `restaurant:reviews:${restaurantId}:${page}`
    //     *   2. If cache hit → return
    //     *   3. If cache miss:
    //     *      a. Fetch reviews with user (firstName, avatar) relation
    //     *      b. Order by createdAt DESC
    //     *      c. Paginate
    //     *      d. Aggregate: averageRating, totalReviews, ratingDistribution {1: x, 2: y, ...}
    //     *   4. Cache result (TTL: 5 min)
    //     *   5. Return { reviews, stats: { average, total, distribution }, pagination }
});