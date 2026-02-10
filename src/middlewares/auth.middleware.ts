import { getUserByIdService } from "@/modules/auth/auth.service";
import { ForbiddenError, UnauthorizedError } from "@/utils/customError.util";
import { verifyJWT } from "@/utils/jwt.util";
import { Role } from "@prisma/client";
import { Request , Response , NextFunction } from "express";

export const authorize = (allowedRoles: Role) => {
    return async(req: Request , res: Response , next: NextFunction): Promise<any>=> {
        try {
            const token = req.cookies.jwt_token;
            if(!token){
                return next(new UnauthorizedError("JWT Token Missing !!!"));
            }

            const decoded = verifyJWT(token) as any;
            if(!decoded || !decoded.userId){
                return next(new UnauthorizedError("Invalid or Expired JWT Token !!!"));
            };

            const user = await getUserByIdService(decoded.userId);
            if(!user){
                return next(new UnauthorizedError("User no longer exists !!!"));
            };

            if(!allowedRoles.includes(user.role)){
                return next(new ForbiddenError("You do not have permission to perform this action !!!"));
            };

            (req as any).user = user;
            next();
        }
        catch (error) {
            console.error("[AUTHORIZE_ERROR]:", error);
            next(new UnauthorizedError("Not authorized"));
        };
    };
};