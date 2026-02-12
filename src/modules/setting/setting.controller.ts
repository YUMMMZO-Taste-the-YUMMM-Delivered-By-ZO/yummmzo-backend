import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";

/**
    * API: Get User Settings
    * GET /api/v1/settings
*/
export const getUserSettingsController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
});