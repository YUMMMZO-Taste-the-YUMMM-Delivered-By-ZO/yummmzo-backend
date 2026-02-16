import { prisma } from "@/config/database";

export const getAddressesService = async (userId: number): Promise<any> => {
    try {
        const addresses = await prisma.address.findMany({
            where: {
                userId: userId
            }
        });

        return addresses;
    }
    catch (error) {
        console.log(`Error While Getting User Addresses : ${error}`);
        throw new Error(`Error While Getting User Addresses : ${error}`);
    };
};

export const getAddressByIdService = async (userId: number , addressId: number): Promise<any> => {
    try {
        const address = await prisma.address.findFirst({
            where: {
                AND: [
                    {userId: userId},
                    {id: addressId}
                ]
            }
        });

        return address;
    }
    catch (error) {
        console.log(`Error While Getting User Address : ${error}`);
        throw new Error(`Error While Getting User Address : ${error}`);
    }
};

export const updateAllAddressesService = async (userId: number): Promise<any> => {
    try {
        const addresses = await prisma.address.updateMany({
            where: {
                userId: userId
            },
            data: {
                isDefault: false
            }
        });
    }
    catch (error) {
        console.log(`Error While Updating User Addresses : ${error}`);
        throw new Error(`Error While Getting User Addresses : ${error}`);
    }
};

export const createAddressService = async (userId: number , newAddress: any): Promise<any> => {
    try {
        const address = await prisma.address.create({
            data: {
                ...newAddress,
                userId: userId
            }
        });

        return address;
    }
    catch (error) {
        console.log(`Error While Adding a New User Address : ${error}`);
        throw new Error(`Error While Adding a New User Address : ${error}`);
    }
};

export const updateAddressService = async (userId: number , addressId: number , updatedAddress: any): Promise<any> => {
    try {
        const updatedAddressData = await prisma.address.update({
            where: {
                id: addressId
            },
            data: updatedAddress
        });

        return updatedAddressData;
    }
    catch (error) {
        console.log(`Error While Updating a User Address : ${error}`);
        throw new Error(`Error While Updating a User Address : ${error}`);
    }
};

export const setDefaultAddressService = async (userId: number, addressId: number): Promise<any> => {
    try {
        return await prisma.$transaction([
            prisma.address.updateMany({
                where: { 
                    userId: userId 
                },
                data: { 
                    isDefault: false 
                }
            }),
            prisma.address.update({
                where: { 
                    id: addressId 
                },
                data: { 
                    isDefault: true 
                }
            })
        ]);
    } 
    catch (error) {
        console.log(`Error While Deleting a User Address : ${error}`);
        throw new Error(`Error While Deleting a User Address : ${error}`);
    }
};