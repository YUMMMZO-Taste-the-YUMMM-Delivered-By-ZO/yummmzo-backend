import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { MenuSchema, RestaurantDetailSchema, RestaurantFilterSchema, TopPicksSchema } from "./restaurant.dataValidation";
import { NotFoundError, ValidationError } from "@/utils/customError.util";
import { redisConnection as redis } from "@/config/redis";
import { sendSuccess } from "@/utils/response.util";
import crypto from 'crypto';
import { getCuisinesService, getRestaurantByIdService, getRestaurantMenuService, getRestaurantsService, getTopPicksService } from "./restaurant.service";
import { calculateHaversineJS } from "@/utils/distance.util";

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
    const validatedData = RestaurantFilterSchema.safeParse(req.query); 
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const queryString = JSON.stringify(validatedData.data);
    const hash = crypto.createHash('md5').update(queryString).digest('hex');
    const cacheKey = `restaurants:list:${hash}`;

    const cachedData = await redis.get(cacheKey);
    if(cachedData){
        const parsedData = JSON.parse(cachedData);
        return sendSuccess("Restaurants fetched successfully from cache." , parsedData , 200);
    };

    const data = await getRestaurantsService(validatedData.data);

    await redis.set(cacheKey , JSON.stringify(data) , 'EX' , 300);

    return sendSuccess("Restaurants fetched successfully" , data , 200);
});

/**
    * API 4.2: Get All Cuisines
    * GET /api/v1/cuisines
*/
export const getCuisinesController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const cacheKey = `cuisines:list:all`;

    const cachedData = await redis.get(cacheKey);
    if(cachedData){
        const parsedData = JSON.parse(cachedData);
        return sendSuccess("Cuisines fetched successfully from cache." , parsedData , 200);
    };

    const cuisines = await getCuisinesService();

    await redis.set(cacheKey , JSON.stringify({ cuisines }) , 'EX' , 3600);
    return sendSuccess("Cuisines fetched successfully" , { cuisines } , 200);
});

/**
    * API 4.3: List Top Picks
    * GET /api/v1/top-picks
    
    * Query Params:
        *   - lat, lng (required): User's current location
*/
export const getTopPicksController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
    const validatedData = TopPicksSchema.safeParse(req.query); 
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const queryString = JSON.stringify(validatedData.data);
    const hash = crypto.createHash('md5').update(queryString).digest('hex');
    const cacheKey = `topPicks:list:${hash}`;

    const cachedData = await redis.get(cacheKey);
    if(cachedData){
        const parsedData = JSON.parse(cachedData);
        return sendSuccess("Top Picks fetched successfully from cache." , parsedData , 200);
    };

    const topPicks = await getTopPicksService(validatedData.data);

    await redis.set(cacheKey , JSON.stringify({ topPicks }) , 'EX' , 300);

    return sendSuccess("Top Picks fetched successfully" , { topPicks } , 200);
});

/**
    * API 4.4: Get Restaurant Details
    * GET /api/v1/restaurants/:restaurantId
    
    * Params: restaurantId
    * Query: lat, lng (optional - for distance calculation)
*/
export const getRestaurantByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = RestaurantDetailSchema.safeParse(req.query);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { lat , lng } = validatedData.data;

    const { restaurantId } = req.params;
    if(!restaurantId){
        return next(new ValidationError([] , "Restaurant ID Doesnt Exist."));
    };

    const cacheKey = `restaurant:details:${restaurantId}`;

    const cachedData = await redis.get(cacheKey);

    let restaurant;
    if(cachedData){
        restaurant = JSON.parse(cachedData);
    }
    else{
        restaurant = await getRestaurantByIdService(Number(restaurantId));

        if (!restaurant){
            return next(new NotFoundError("Restaurant not found"));
        };

        await redis.set(cacheKey , JSON.stringify(restaurant) , 'EX' , 600);
    };

    const now = new Date();
    const restaurantOpeningTime = restaurant.openingTime;
    const restaurantClosingTime = restaurant.closingTime;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isOpen = (currentTime >= restaurantOpeningTime) && (currentTime <= restaurantClosingTime);

    let distance = null;
    if(lat && lng){ 
        distance = calculateHaversineJS(Number(lat), Number(lng), restaurant.latitude, restaurant.longitude);
    };

    const finalResult = {
        ...restaurant,
        isOpen,
        distance
    };

    return sendSuccess("Restaurant details fetched" , finalResult , 200);
});

/**
    * API 4.5: Get Restaurant Menu
    * GET /api/v1/restaurants/:restaurantId/menu
    
    * Params: restaurantId
*/
export const getRestaurantMenuController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = MenuSchema.safeParse(req.query);
    if(!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { restaurantId } = req.params;
    if(!restaurantId){
        return next(new ValidationError([], "Restaurant ID Doesnt Exist."));
    };

    const queryString = JSON.stringify({ restaurantId, ...validatedData.data });
    const hash = crypto.createHash('md5').update(queryString).digest('hex');
    const cacheKey = `restaurants:menu:${hash}`;

    let menu;
    const cachedData = await redis.get(cacheKey);
    
    if(cachedData){
        menu = JSON.parse(cachedData);
        return sendSuccess("Menu fetched from cache" , menu , 200);
    }
    else{
        const categories = await getRestaurantMenuService(Number(restaurantId) , validatedData.data);
        menu = categories;
    };
    
    await redis.set(cacheKey , JSON.stringify(menu) , 'EX' , 900);
    return sendSuccess("Menu fetched successfully" , menu , 200);
});