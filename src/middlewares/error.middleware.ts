import { Request , Response , NextFunction } from 'express';
import { ApiError } from '@/utils/apiError.util';
import { sendError } from '@/utils/response.util';

export function globalErrorHandler(err: any , req: Request , res: Response , next: NextFunction) {
    if(err instanceof ApiError){
        const response = sendError(
            err.message,
            err.errors,
            err.statusCode,
            err.stack
        );

        return res.status(err.statusCode).json(response);
    };

    console.error("🔥 UNEXPECTED ERROR:", err);

    const response = sendError(
        "Something Went Wrong",
        [],
        500,
        err.stack
    );

    return res.status(500).json(response);
};