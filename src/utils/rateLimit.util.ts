import { redisConnection as redis } from "@/config/redis";
import { TooManyRequestsError } from "./customError.util";
import { ApiError } from "./apiError.util";

export async function checkRateLimit(key: string , limit: number , windowInSeconds: number = 900) {
    try {
        const current = await redis.incr(key);

        if(Number(current) === 1){
            await redis.expire(key , windowInSeconds);
        };

        if(Number(current) > limit){
            throw new TooManyRequestsError();
        };

        return true;
    }
    catch (error) {
        if (error instanceof ApiError){
            throw error;
        };
        console.error(`Rate Limit Error [${key}]: `, error);
        return true;
    }
};