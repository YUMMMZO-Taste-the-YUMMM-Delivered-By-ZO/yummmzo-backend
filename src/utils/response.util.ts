export function sendSuccess(message: string ,  data: any , statusCode: number) {
    const response = {
        success: true,
        message,
        data,
        statusCode
    };

    return response;
};

export function sendError(message: string, errors: any[], statusCode: number, stack?: string) {
    const response: any = {
        success: false,
        message,
        errors,
        statusCode
    };

    if ((process.env.NODE_ENV !== "production") && stack) {
        response.stack = stack;
    };

    return response;
};