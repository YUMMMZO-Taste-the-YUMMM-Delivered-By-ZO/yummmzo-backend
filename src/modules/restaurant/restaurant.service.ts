import { prisma } from "@/config/database";
import { Prisma } from "@prisma/client";

export const getRestaurantsService = async (filters: any): Promise<any> => {
    try {
        const { lat, lng, search, cuisine, rating, priceRange, freeDelivery, sort, page, limit } = filters;
        const offset = (page - 1) * limit;

        const searchFilter = search ? Prisma.sql`AND r.name LIKE ${`%${search}%`}` : Prisma.empty;
        const ratingFilter = rating ? Prisma.sql`AND r.rating >= ${rating}` : Prisma.empty;
        const freeDeliveryFilter = Prisma.empty; 

        let cuisineJoin = Prisma.empty;
        let cuisineFilter = Prisma.empty;

        if (cuisine) {
            const cuisineList = cuisine.split(',');
            cuisineJoin = Prisma.sql`
                INNER JOIN _CuisineToRestaurant ctr ON r.id = ctr.B
                INNER JOIN Cuisine c ON ctr.A = c.id
            `; 
            cuisineFilter = Prisma.sql`AND c.name IN (${Prisma.join(cuisineList)})`;
        };

        let priceFilter = Prisma.empty;
        if (priceRange === "1"){
            priceFilter = Prisma.sql`AND r.priceForTwo <= 300`;
        }
        else if (priceRange === "2"){
            priceFilter = Prisma.sql`AND r.priceForTwo BETWEEN 301 AND 700`;
        }
        else if (priceRange === "3"){
            priceFilter = Prisma.sql`AND r.priceForTwo BETWEEN 701 AND 1500`;
        } 
        else if (priceRange === "4"){
            priceFilter = Prisma.sql`AND r.priceForTwo > 1500`;
        };

        let orderBy = Prisma.sql`ORDER BY distance ASC`;
        if (sort === "rating"){
            orderBy = Prisma.sql`ORDER BY r.rating DESC`;
        }
        else if (sort === "deliveryTime"){
            orderBy = Prisma.sql`ORDER BY r.deliveryTime ASC`;
        };

        const restaurants = await prisma.$queryRaw`
            SELECT DISTINCT r.*, (
                6371 * acos(
                    cos(radians(${lat})) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(${lng})) + 
                    sin(radians(${lat})) * sin(radians(r.latitude))
                )
            ) AS distance
            FROM Restaurant r
            ${cuisineJoin}
            WHERE r.isActive = true
            ${searchFilter}
            ${ratingFilter}
            ${cuisineFilter}
            ${priceFilter}
            ${freeDeliveryFilter}
            HAVING distance <= 20
            ${orderBy}
            LIMIT ${limit} OFFSET ${offset}
        `;

        const totalCountResult: any = await prisma.$queryRaw`
            SELECT COUNT(DISTINCT r.id) as count
            FROM Restaurant r
            ${cuisineJoin}
            WHERE r.isActive = true
            ${searchFilter}
            ${ratingFilter}
            ${cuisineFilter}
            ${priceFilter}
            ${freeDeliveryFilter}
            AND (
                6371 * acos(
                    cos(radians(${lat})) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(${lng})) + 
                    sin(radians(${lat})) * sin(radians(r.latitude))
                )
            ) <= 20
        `;

        const total = Number(totalCountResult[0].count);

        return {
            restaurants,
            pagination: {
                page,
                limit,
                total,
                hasMore: total > page * limit
            }
        };
    } catch (error) {
        console.error(`Error While Getting All Restaurants : ${error}`);
        throw new Error(`Error While Getting All Restaurants`);
    }
};

export const getCuisinesService = async (): Promise<any> => {
    try {
        const cuisines = await prisma.cuisine.findMany();
        return cuisines;
    } 
    catch (error) {
        console.error(`Error While Getting All Cuisines : ${error}`);
        throw new Error(`Error While Getting All Cuisines`);
    };
};

export const getTopPicksService = async (filters: any): Promise<any> => {
    try {
        const { lat, lng } = filters;

        const topPicks = await prisma.$queryRaw`
            SELECT r.*, 
                (6371 * acos(
                    cos(radians(${lat})) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(${lng})) + 
                    sin(radians(${lat})) * sin(radians(r.latitude))
                )) AS distance,
                ((r.rating * 0.8) + (LOG10(NULLIF(r.totalRatings, 0) + 1) * 0.2)) AS popularityScore
            FROM Restaurant r
            WHERE r.isActive = true
            HAVING distance <= 20
            ORDER BY popularityScore DESC
            LIMIT 8
        `;

        return topPicks;
    } 
    catch (error) {
        console.error(`Error While Getting Top Picks : ${error}`);
        throw new Error(`Error While Getting Top Picks`);
    };
};

export const getRestaurantByIdService = async (restaurantId: number): Promise<any> => {
    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                isActive: true
            },
            include: {
                cuisines: true
            }
        });

        return restaurant;
    }
    catch (error) {
        console.log(`Error While Getting a Restaurant : ${error}`);
        throw new Error(`Error While Getting a Restaurant : ${error}`);
    }
};

export const getRestaurantMenuService = async (restaurantId: number , filters: any): Promise<any> => {
    try {
        const { search , sort , isVeg , isBestseller , spiceLevel } = filters;

        let itemOrderBy: any[] = [
            {
                isBestseller: 'desc'
            },
            {
                rating: 'desc'
            }
        ];

        if(sort === 'PRICE_LOW_TO_HIGH'){
            itemOrderBy: {
                price: 'asc'
            }
        };
        if(sort === 'PRICE_HIGH_TO_LOW'){
            itemOrderBy: {
                price: 'desc'
            }
        };
        if(sort === 'RATING'){
            itemOrderBy: {
                rating: 'desc'
            }
        };

        const data = await prisma.restaurant.findUnique({
            where: {
                id: restaurantId
            },
            include: {
                categories: {
                    orderBy: {
                        sortOrder: 'asc'
                    },
                    include: {
                        items: {
                            where: {
                                inStock: true,
                                isVeg: isVeg || undefined,
                                isBestseller: isBestseller || undefined,
                                spiceLevel: spiceLevel || undefined,
                                name: search ? { contains: search} : undefined
                            },
                            orderBy: itemOrderBy
                        }
                    }
                }
            }
        });

        return data?.categories || [];
    }
    catch (error) {
        console.log(`Error While Getting Restaurants Menu : ${error}`);
        throw new Error(`Error While Getting Restaurants Menu : ${error}`);
    }
};