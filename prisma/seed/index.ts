import { PrismaClient } from "@prisma/client";
import { cuisines } from "./data/cuisines";
import { categoryTemplates } from "./data/categories";
import { menuItemsByCategory } from "./data/menuItems";
import { patnaRestaurants } from "./data/restaurants/patna";
import { delhiRestaurants } from "./data/restaurants/delhi";

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
                    inStock: Math.random() > 0.1,
                    isBestseller: Math.random() > 0.7,
                    rating: getRandomRating()
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

async function main() {
    console.log("\n🌱 Starting database seeding...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.menu_Item.deleteMany();
    await prisma.category.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.cuisine.deleteMany();
    console.log("✅ Cleared existing data\n");

    // Seed cuisines
    await seedCuisines();

    // Get all cuisine records
    const cuisineRecords = await prisma.cuisine.findMany();

    await seedRestaurantsForCity("Patna", patnaRestaurants, cuisineRecords);
    await seedRestaurantsForCity("Delhi", delhiRestaurants, cuisineRecords);

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