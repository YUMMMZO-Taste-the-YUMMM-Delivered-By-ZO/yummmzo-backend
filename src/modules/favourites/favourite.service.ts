import { prisma } from '../../config/database';

export const getFavouritesService = async (userId: number): Promise<any> => {
    try {
        const favourites = await prisma.favourite.findMany({
            where: {
                userId: userId
            },
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        rating: true,
                        deliveryTime: true,
                        priceForTwo: true,
                        status: true,
                        location: true,
                        cuisines: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return favourites;
    } 
    catch (error) {
        console.log(`Error While Getting User Favourites : ${error}`);
        throw new Error(`Error While Getting User Favourites : ${error}`);   
    };
};

export const checkIfFavouriteExistService = async (userId: number, restaurantId: number): Promise<any> => {
    try {
        const favourite = await prisma.favourite.findFirst({
            where: {
                userId: userId,
                restaurantId: restaurantId
            }
        });
        return favourite;
    } 
    catch (error) {
        console.log(`Error While Checking If Favourite Exist : ${error}`);
        throw new Error(`Error While Checking If Favourite Exist : ${error}`);   
    };
};

export const getFavouriteIdsService = async (userId: number): Promise<any> => {
    try {
        const favourites = await prisma.favourite.findMany({
            where: {
                userId: userId
            },
            select: {
                restaurantId: true
            }
        });
        return favourites.map(f => f.restaurantId);
    } 
    catch (error) {
        console.log(`Error While Getting Favourites IDs : ${error}`);
        throw new Error(`Error While Getting Favourites IDs : ${error}`);   
    }
};


export const toggleFavouriteService = async ({ favouriteId, userId, restaurantId, action }: { favouriteId?: number; userId?: number; restaurantId?: number; action: 'ADD' | 'REMOVE'; }): Promise<any> => {
    try {
        let favourite;

        if(action === 'ADD'){
            favourite = await prisma.favourite.create({
                data: {
                    userId: userId!,
                    restaurantId: restaurantId!
                }
            });
        };

        if(action === 'REMOVE'){
            favourite = await prisma.favourite.delete({
                where: {
                    id: favouriteId!
                }
            });
        };

        return favourite;
    }
    catch (error) {
        console.log(`Error While Toggling Favourite : ${error}`);
        throw new Error(`Error While Toggling Favourite : ${error}`);   
    };
};