
export class ApiError extends Error{
    statusCode: number;
    isOperational: boolean;
    errors: any[];

    constructor(message: string , statusCode: number , errors: any[] = [] , isOperational: boolean = true){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = isOperational;
        Error.captureStackTrace(this , this.constructor);
    };
};