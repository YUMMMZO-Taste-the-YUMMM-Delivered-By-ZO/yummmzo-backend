import { prisma } from "@/config/database";

export const checkIfAddressBelongsToUserService = async (userId: number , addressId: number): Promise<any> => {
    try {
        const isAllowed = await prisma.address.findFirst({
            where: {
                userId: userId,
                id: addressId
            }
        });

        return isAllowed === null ? false : true;
    }
    catch (error) {
        console.log(`Error While Adding a New User Address : ${error}`);
        throw new Error(`Error While Adding a New User Address : ${error}`);
    }
};