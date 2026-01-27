import { Request, Response, NextFunction } from "express";

export const getOrdersController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};

export const createOrderController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};

export const getOrderByIdController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};

export const cancelOrderController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};

export const reorderController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};