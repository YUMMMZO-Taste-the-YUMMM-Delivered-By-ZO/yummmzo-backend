import { ApiError } from "./apiError.util";

export class NotFoundError extends ApiError{
    constructor(message: string = "Resource Not Found"){
        super(message , 404);
    };
};

export class BadRequestError extends ApiError{
    constructor(message: string = "Input Invalid"){
        super(message , 400);
    };
};

export class TooManyRequestsError extends ApiError {
    constructor(message: string = "Too many requests, please try again later") {
        super(message, 429);
    };
};

export class ValidationError extends ApiError{
    constructor(errors: any[] , message: string = "Validation Failed"){
        super(message , 400 , errors);
    };
};

export class UnauthorizedError extends ApiError{
    constructor(message: string = "User Not Logged In"){
        super(message , 401);
    }
};

export class ForbiddenError extends ApiError{
    constructor(message: string = "Access Forbidden"){
        super(message , 403);
    };
};

export class ConflictError extends ApiError{
    constructor(message: string = "Duplicate Data"){
        super(message , 409);
    };
};

export class TokenExpiredError extends ApiError{
    constructor(message: string = "JWT Expired"){
        super(message , 401);
    };
};

export class InvalidTokenError extends ApiError{
    constructor(message: string = "Token Invalid"){
        super(message , 401);
    };
};

export class InternalServerError extends ApiError{
    constructor(message: string = "Internal Server Error"){
        super(message , 500);
    };
};

export class ServiceUnavailableError extends ApiError{
    constructor(message: string = "DB or External Service Down"){
        super(message , 503);
    };
};