import { PrismaClient } from "@prisma/client";
import { cuisines } from "./data/cuisines";
import { categoryTemplates } from "./data/categories";
import { menuItemsByCategory } from "./data/menuItems";
import { patnaRestaurants } from "./data/restaurants/patna";
import { delhiRestaurants } from "./data/restaurants/delhi";
import { globalCoupons, restaurantCouponTemplates, CouponTemplate } from "./data/coupons";
import { bangaloreRestaurants } from './data/restaurants/bangalore';
import { sfRestaurants } from './data/restaurants/sf';
import { kolkataRestaurants } from './data/restaurants/kolkata';
import { darjeelingRestaurants } from "./data/restaurants/darjelling";

const prisma = new PrismaClient();

// Helper: Get random elements from array
const getRandomElements = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Helper: Get random number in range
const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper: Get random rating
const getRandomRating = (): number => {
    return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
};

// Helper: Get random delivery time
const getRandomDeliveryTime = (): string => {
    const times = ["20-30 min", "25-35 min", "30-40 min", "35-45 min", "40-50 min"];
    return times[Math.floor(Math.random() * times.length)]!;
};

// Helper: Get random price for two
const getRandomPriceForTwo = (): number => {
    const prices = [200, 250, 300, 350, 400, 450, 500, 600, 700, 800];
    return prices[Math.floor(Math.random() * prices.length)]!;
};

// Helper: Get random opening/closing times
const getRandomTimings = (): { opening: string; closing: string } => {
    const openings = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"];
    const closings = ["21:00", "22:00", "23:00", "23:30", "00:00"];
    return {
        opening: openings[Math.floor(Math.random() * openings.length)]!,
        closing: closings[Math.floor(Math.random() * closings.length)]!
    };
};

// Helper: Get coupon code with restaurant ID
const getRandomCouponCode = (template: CouponTemplate, restaurantId?: number): string => {
    if (restaurantId) {
        return `${template.code}_R${restaurantId}`;
    }
    return template.code;
};

// Helper: Get random spice level based on item and category
const getRandomSpiceLevel = (itemName: string, categoryName: string): "NORMAL" | "MILD" | "MEDIUM" | "HOT" | "EXTRA_SPICY" => {
    // Mild items - desserts, beverages, ice cream
    const mildCategories = ["Desserts", "Beverages", "Ice Cream"];
    if (mildCategories.includes(categoryName)) {
        return "MILD";
    }

    // Spicy items by name keywords
    const hotKeywords = ["spicy", "schezwan", "65", "hot", "chilli", "pepper", "tandoori", "masala"];
    const extraSpicyKeywords = ["extra spicy", "fiery", "inferno"];

    const lowerName = itemName.toLowerCase();

    if (extraSpicyKeywords.some(k => lowerName.includes(k))) {
        return "EXTRA_SPICY";
    }
    if (hotKeywords.some(k => lowerName.includes(k))) {
        return "HOT";
    }

    // Random for others
    const levels: ("NORMAL" | "MILD" | "MEDIUM" | "HOT")[] = ["NORMAL", "NORMAL", "MEDIUM", "MEDIUM", "HOT"];
    return levels[Math.floor(Math.random() * levels.length)]!;
};

// Placeholder restaurant images
const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330"
];

async function seedCuisines() {
    console.log("🍽️  Seeding cuisines...");

    for (const cuisine of cuisines) {
        await prisma.cuisine.upsert({
            where: { name: cuisine },
            update: {},
            create: { name: cuisine }
        });
    }

    console.log(`✅ Seeded ${cuisines.length} cuisines`);
}

async function seedRestaurant(
    restaurantData: { name: string; latitude: number; longitude: number; location: string },
    cuisineRecords: { id: number; name: string }[]
) {
    const timings = getRandomTimings();
    const randomCuisines = getRandomElements(cuisineRecords, getRandomNumber(2, 5));

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
        data: {
            name: restaurantData.name,
            description: `Welcome to ${restaurantData.name}! We serve delicious food with love.`,
            image: restaurantImages[Math.floor(Math.random() * restaurantImages.length)]!,
            images: JSON.stringify(getRandomElements(restaurantImages, 4)),
            rating: getRandomRating(),
            totalRatings: getRandomNumber(50, 2000),
            location: restaurantData.location,
            latitude: restaurantData.latitude,
            longitude: restaurantData.longitude,
            openingTime: timings.opening,
            closingTime: timings.closing,
            priceForTwo: getRandomPriceForTwo(),
            deliveryTime: getRandomDeliveryTime(),
            isActive: true,
            status: Math.random() > 0.1 ? "OPEN" : "CLOSED",
            cuisines: {
                connect: randomCuisines.map(c => ({ id: c.id }))
            }
        }
    });

    // Select 4-8 random categories for this restaurant
    const selectedCategories = getRandomElements(categoryTemplates, getRandomNumber(4, 8));

    // Create categories and menu items
    for (const categoryTemplate of selectedCategories) {
        const category = await prisma.category.create({
            data: {
                restaurantId: restaurant.id,
                name: categoryTemplate.name,
                description: categoryTemplate.description,
                sortOrder: categoryTemplate.sortOrder
            }
        });

        // Get menu items for this category
        const menuItems = menuItemsByCategory[categoryTemplate.name] || [];
        const selectedItems = getRandomElements(menuItems, getRandomNumber(3, Math.min(8, menuItems.length)));

        // Create menu items
        for (const item of selectedItems) {
            await prisma.menu_Item.create({
                data: {
                    categoryId: category.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image || null,
                    isVeg: item.isVeg,
                    inStock: true,
                    isBestseller: Math.random() > 0.7,
                    rating: getRandomRating(),
                    spiceLevel: item.spiceLevel || getRandomSpiceLevel(item.name, categoryTemplate.name)
                }
            });
        }
    }

    return restaurant;
}

async function seedRestaurantsForCity(
    cityName: string,
    restaurants: { name: string; latitude: number; longitude: number; location: string }[],
    cuisineRecords: { id: number; name: string }[]
) {
    console.log(`\n🏙️  Seeding ${cityName} restaurants...`);

    let count = 0;
    const batchSize = 50;

    for (let i = 0; i < restaurants.length; i++) {
        const restaurant = restaurants[i]!;
        await seedRestaurant(restaurant, cuisineRecords);
        count++;

        if (count % batchSize === 0) {
            console.log(`   Seeded ${count}/${restaurants.length} restaurants...`);
        }
    }

    console.log(`✅ Seeded ${count} restaurants in ${cityName}`);
}

async function seedCoupons(restaurantIds: number[]) {
    console.log("\n🎟️  Seeding coupons...");

    // 1. Global coupons
    for (const coupon of globalCoupons) {
        const validFrom = new Date();
        const validTill = new Date();
        validTill.setDate(validTill.getDate() + coupon.validDays);

        await prisma.coupon.create({
            data: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                maxDiscount: coupon.maxDiscount || null,
                minOrderValue: coupon.minOrderValue,
                validFrom,
                validTill,
                isActive: true,
                restaurantId: null
            }
        });
    }
    console.log(`   ✅ Seeded ${globalCoupons.length} global coupons`);

    // 2. Every restaurant gets 1-2 coupons (changed from 30% → 100%)
    let restaurantCouponCount = 0;

    for (const restaurantId of restaurantIds) {
        const couponCount = getRandomNumber(1, 2);
        const selectedTemplates = getRandomElements(restaurantCouponTemplates, couponCount);

        for (const template of selectedTemplates) {
            const validFrom = new Date();
            const validTill = new Date();
            validTill.setDate(validTill.getDate() + template.validDays);

            await prisma.coupon.create({
                data: {
                    code: `${template.code}_R${restaurantId}`,
                    description: template.description,
                    discountType: template.discountType,
                    discountValue: template.discountValue,
                    maxDiscount: template.maxDiscount || null,
                    minOrderValue: template.minOrderValue,
                    validFrom,
                    validTill,
                    isActive: true,
                    restaurantId
                }
            });
            restaurantCouponCount++;
        }
    }

    console.log(`   ✅ Seeded ${restaurantCouponCount} restaurant-specific coupons`);
    console.log(`✅ Total coupons: ${globalCoupons.length + restaurantCouponCount}`);
}

async function main() {
    console.log("\n🌱 Starting database seeding...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.menu_Item.deleteMany();
    await prisma.category.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.cuisine.deleteMany();
    console.log("✅ Cleared existing data\n");

    // Seed cuisines
    await seedCuisines();

    // Get all cuisine records
    const cuisineRecords = await prisma.cuisine.findMany();

    await seedRestaurantsForCity("Patna", patnaRestaurants, cuisineRecords);
    await seedRestaurantsForCity("Delhi", delhiRestaurants, cuisineRecords);
    await seedRestaurantsForCity("Bangalore", bangaloreRestaurants, cuisineRecords);
    await seedRestaurantsForCity("San Francisco", sfRestaurants, cuisineRecords);
    await seedRestaurantsForCity("Kolkata", kolkataRestaurants, cuisineRecords);
    await seedRestaurantsForCity("Darjeeling", darjeelingRestaurants, cuisineRecords);

    // Get all restaurant IDs and seed coupons
    const allRestaurants = await prisma.restaurant.findMany({ select: { id: true } });
    const restaurantIds = allRestaurants.map(r => r.id);
    await seedCoupons(restaurantIds);

    console.log("\n🎉 Seeding completed successfully!\n");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });