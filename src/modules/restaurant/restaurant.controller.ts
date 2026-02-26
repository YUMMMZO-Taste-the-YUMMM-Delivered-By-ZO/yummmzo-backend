import axios from 'axios';
import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";
import { MenuSchema, RestaurantDetailSchema, RestaurantFilterSchema, SmartOrderSchema, TopPicksSchema } from "./restaurant.dataValidation";
import { NotFoundError, ValidationError } from "@/utils/customError.util";
import { redisConnection as redis } from "@/config/redis";
import { sendSuccess } from "@/utils/response.util";
import crypto from 'crypto';
import { getCuisinesService, getMenuContextService, getRestaurantByIdService, getRestaurantMenuService, getRestaurantsService, getTopPicksService, syncSmartCartToRedisService } from "./restaurant.service";
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

/**
    * API 4.6: Build Smart Cart
    * GET /api/v1/restaurants/:restaurantId/smart-cart
    
    * Params: restaurantId
*/
export const buildSmartCartController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const validatedData = SmartOrderSchema.safeParse(req.body);
    if (!validatedData.success){
        return next(new ValidationError(validatedData.error.issues));
    };

    const { restaurantId } = req.params;
    const { craving } = validatedData.data;
    const userId = (req as any).user.id;

    const menuContext = await getMenuContextService(Number(restaurantId));

    const query = `
        query ExecuteWorkflow($workflowId: String!, $user_craving: String, $menu_context: String) {
            executeWorkflow(
                workflowId: $workflowId
                payload: { user_craving: $user_craving, menu_context: $menu_context }
            ) {
                status
                result
            }
        }`;

    const variables = {
        workflowId: process.env.LAMATIC_WORKFLOW_ID, 
        user_craving: craving,
        menu_context: JSON.stringify(menuContext)
    };

    try {
        const response = await axios.post(process.env.LAMATIC_GRAPHQL_URL!, 
            { query, variables },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.LAMATIC_API_KEY}`, 
                    'Content-Type': 'application/json',
                    'x-project-id': process.env.LAMATIC_PROJECT_ID 
                }
            }
        );

        if (response.data.errors) {
            console.error("Lamatic Error:", response.data.errors);
            throw new Error(response.data.errors[0].message);
        }

        const workflowData = response.data.data?.executeWorkflow;
        const aiRawResult = workflowData?.result;

        if (!aiRawResult){
            throw new Error("AI return empty result.");
        };

        const parsedResult = typeof aiRawResult === 'string' ? JSON.parse(aiRawResult) : aiRawResult;

        let itemsToSync = [];
        if (Array.isArray(parsedResult)) {
            itemsToSync = parsedResult;
        } 
        else if (parsedResult.response?.cart) {
            itemsToSync = parsedResult.response.cart;
        } 
        else if (parsedResult.cart) {
            itemsToSync = parsedResult.cart;
        } 
        else if (parsedResult.response && Array.isArray(parsedResult.response)) {
            itemsToSync = parsedResult.response;
        };

        if (!Array.isArray(itemsToSync)) {
            console.error("Data structure mismatch:", parsedResult);
            itemsToSync = [];
        }

        const syncedCart = await syncSmartCartToRedisService(
            Number(userId), 
            Number(restaurantId), 
            itemsToSync
        );

        return sendSuccess("Magic happened! ✨", syncedCart, 201);
    } 
    catch (error: any) {
        console.error("SMART CART FATAL:", error.message);
        return res.status(500).json({ 
            message: "AI Concierge is busy.",
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});