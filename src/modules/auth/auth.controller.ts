import { Request, Response, NextFunction } from "express";

export const registerController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};

export const loginController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};

export const verifyEmailController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    // logic...
};

export const googleAuthController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};

export const googleAuthCallbackController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};

export const forgotPasswordController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};

export const resetPasswordController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};

export const refreshTokenController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};

export const logoutController = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => { 
    // logic...
};