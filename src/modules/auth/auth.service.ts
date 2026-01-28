import { prisma } from '../../config/database';

export const checkIfUserExistService = async (email: string , phone: string): Promise<any> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: email},
                    {phone: phone}
                ]
            }
        });

        return user;
    } 
    catch (error) {
        console.log(`Error While Checking If a User Already Exist or Not : ${error}`);
        throw new Error(`Error While Checking If a User Already Exist or Not : ${error}`);
    }
};

export const registerService = async (userData: any): Promise<any> => {
    try {
        const newUser = await prisma.user.create({
            data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                password: userData.password
            }
        });

        return newUser;
    } 
    catch (error) {
        console.log(`Error While Registering a User : ${error}`);
        throw new Error(`Error While Registering a User : ${error}`);
    };
};

export const loginService = async (): Promise<void> => {
    try {
        // logic...
    } 
    catch (error) {
        console.log(error);
    }
};

export const logoutService = async (): Promise<void> => {
    try {
        // logic...
    } 
    catch (error) {
        console.log(error);
    }
};

export const verifyEmailService = async (): Promise<void> => {
    try {
        // logic...
    } 
    catch (error) {
        console.log(error);
    }
};

export const forgotPasswordService = async (): Promise<void> => {
    try {
        // logic...
    } 
    catch (error) {
        console.log(error);
    }
};

export const resetPasswordService = async (): Promise<void> => {
    try {
        // logic...
    } 
    catch (error) {
        console.log(error);
    }
};