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

export const verifyEmailService = async (userId: number): Promise<any> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isEmailVerified: true
            }
        });

        return user;
    } 
    catch (error) {
        console.log(`Error While Verifying Email : ${error}`);
        throw new Error(`Error While Verifying Email : ${error}`);
    }
};

export const getUserService = async (email: string): Promise<any> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        return user;
    } 
    catch (error) {
        console.log(`Error While Getting a User By Email : ${error}`);
        throw new Error(`Error While Getting a User By Email : ${error}`);
    }
};

export const resetPasswordService = async (userId: number , hashedPassword: string): Promise<any> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });

        return user;
    } 
    catch (error) {
        console.log(`Error While Updating Users Password : ${error}`);
        throw new Error(`Error While Updating Users Password : ${error}`);
    }
};