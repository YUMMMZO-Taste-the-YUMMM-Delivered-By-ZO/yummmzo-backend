import { Request, Response, NextFunction } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = (fn: AsyncController) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next))
            .then((result) => {
                if (result && result.success) {
                    res.status(result.statusCode || 200).json(result);
                }
            })
            .catch(next);
    };
};