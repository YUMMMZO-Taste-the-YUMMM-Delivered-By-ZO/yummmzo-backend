import { prisma } from '../../config/database';

export const getProfileService = async (userId: number): Promise<any> => {
    try {
        const profile = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        return profile;
    }
    catch (error) {
        console.log(`Error While Getting User Profile : ${error}`);
        throw new Error(`Error While Getting User Profile : ${error}`);
    }
};

export const updateProfileNameService = async (userId: number , updatedData: any): Promise<any> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: updatedData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        });

        return user;
    }
    catch (error) {
        console.log(`Error While Updating User Profile : ${error}`);
        throw new Error(`Error While Updating User Profile : ${error}`);
    }
};

export const uploadAvatarService = async (userId: number , avatar: string): Promise<any> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatar: avatar
            }
        });

        return user;
    }
    catch (error) {
        console.log(`Error While Updating User Avatar : ${error}`);
        throw new Error(`Error While Updating User Avatar : ${error}`);
    }
};


export const changePasswordService = async (userId: number , newPassword: string): Promise<any> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPassword
            }
        });

        return user;
    }
    catch (error) {
        console.log(`Error While Updating User Password : ${error}`);
        throw new Error(`Error While Updating User Password : ${error}`);
    }
};

export const deleteAccountService = async (): Promise<void> => {
    try {
        
    }
    catch (error) {
        
    }
};