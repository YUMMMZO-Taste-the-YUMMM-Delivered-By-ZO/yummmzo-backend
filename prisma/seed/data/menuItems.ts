export interface MenuItemTemplate {
    name: string;
    description: string;
    price: number;
    isVeg: boolean;
    image?: string;
    spiceLevel?: "NORMAL" | "MILD" | "MEDIUM" | "HOT" | "EXTRA_SPICY";
}

export const menuItemsByCategory: Record<string, MenuItemTemplate[]> = {
    "Recommended": [
        { name: "Paneer Butter Masala", description: "Creamy tomato curry with cottage cheese cubes", price: 280, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
        { name: "Chicken Biryani", description: "Aromatic basmati rice with spiced chicken", price: 320, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
        { name: "Butter Naan", description: "Soft leavened bread brushed with butter", price: 60, isVeg: true, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400" },
        { name: "Dal Makhani", description: "Slow-cooked black lentils in creamy gravy", price: 240, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
        { name: "Mutton Rogan Josh", description: "Kashmiri style mutton curry", price: 380, isVeg: false, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400" }
    ],

    "Bestsellers": [
        { name: "Tandoori Chicken", description: "Clay oven roasted chicken with spices", price: 340, isVeg: false, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
        { name: "Veg Manchurian", description: "Crispy vegetable balls in tangy sauce", price: 220, isVeg: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
        { name: "Garlic Naan", description: "Naan topped with garlic and coriander", price: 70, isVeg: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
        { name: "Chicken Tikka", description: "Boneless chicken marinated and grilled", price: 290, isVeg: false, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" },
        { name: "Shahi Paneer", description: "Paneer in rich cashew and cream gravy", price: 290, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" }
    ],

    "Starters": [
        { name: "Paneer Tikka", description: "Grilled cottage cheese with bell peppers", price: 260, isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400" },
        { name: "Chicken 65", description: "Spicy deep-fried chicken bites", price: 280, isVeg: false, image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400", spiceLevel: "HOT" },
        { name: "Veg Spring Roll", description: "Crispy rolls stuffed with vegetables", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400" },
        { name: "Fish Fingers", description: "Crispy fried fish strips", price: 320, isVeg: false, image: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400" },
        { name: "Hara Bhara Kebab", description: "Spinach and green peas patties", price: 220, isVeg: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" },
        { name: "Mutton Seekh Kebab", description: "Minced mutton skewers", price: 350, isVeg: false, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400" },
        { name: "Crispy Corn", description: "Crunchy corn kernels with spices", price: 190, isVeg: true, image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" },
        { name: "Prawn Koliwada", description: "Spiced and fried prawns", price: 380, isVeg: false, image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=400" },
        { name: "Aloo Tikki", description: "Crispy potato patties", price: 150, isVeg: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" },
        { name: "Chicken Malai Tikka", description: "Creamy marinated chicken tikka", price: 310, isVeg: false, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" }
    ],

    "Soups": [
        { name: "Tomato Soup", description: "Classic creamy tomato soup", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400", spiceLevel: "MILD" },
        { name: "Hot & Sour Soup", description: "Spicy and tangy vegetable soup", price: 140, isVeg: true, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", spiceLevel: "HOT" },
        { name: "Chicken Manchow Soup", description: "Indo-Chinese chicken soup with crispy noodles", price: 160, isVeg: false, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400" },
        { name: "Sweet Corn Soup", description: "Creamy corn soup", price: 130, isVeg: true, image: "https://images.unsplash.com/photo-1571104508999-893933ded431?w=400", spiceLevel: "MILD" },
        { name: "Mutton Shorba", description: "Traditional mutton broth", price: 180, isVeg: false, image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400" },
        { name: "Cream of Mushroom", description: "Rich mushroom soup", price: 150, isVeg: true, image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400", spiceLevel: "MILD" }
    ],

    "Salads": [
        { name: "Green Salad", description: "Fresh mixed greens with dressing", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", spiceLevel: "MILD" },
        { name: "Caesar Salad", description: "Romaine lettuce with caesar dressing", price: 220, isVeg: true, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", spiceLevel: "MILD" },
        { name: "Chicken Caesar Salad", description: "Caesar salad with grilled chicken", price: 280, isVeg: false, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", spiceLevel: "MILD" },
        { name: "Greek Salad", description: "Cucumber, tomato, olives, feta cheese", price: 240, isVeg: true, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", spiceLevel: "MILD" },
        { name: "Russian Salad", description: "Mixed vegetables in creamy mayo", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1571197119138-7a62b4fc5e08?w=400", spiceLevel: "MILD" }
    ],

    "Main Course": [
        { name: "Paneer Butter Masala", description: "Paneer in rich tomato butter gravy", price: 280, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
        { name: "Dal Tadka", description: "Yellow lentils tempered with spices", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
        { name: "Butter Chicken", description: "Tender chicken in creamy tomato sauce", price: 320, isVeg: false, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400" },
        { name: "Kadai Paneer", description: "Paneer with bell peppers in kadai masala", price: 270, isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400" },
        { name: "Chicken Curry", description: "Traditional Indian chicken curry", price: 290, isVeg: false, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" },
        { name: "Palak Paneer", description: "Cottage cheese in spinach gravy", price: 260, isVeg: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
        { name: "Mutton Curry", description: "Slow-cooked mutton in spiced gravy", price: 380, isVeg: false, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400" },
        { name: "Chole Masala", description: "Spiced chickpea curry", price: 200, isVeg: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" },
        { name: "Egg Curry", description: "Boiled eggs in onion-tomato gravy", price: 220, isVeg: false, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
        { name: "Mix Veg", description: "Assorted vegetables in curry", price: 220, isVeg: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
        { name: "Fish Curry", description: "Fish cooked in tangy curry", price: 340, isVeg: false, image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=400" },
        { name: "Aloo Gobi", description: "Potato and cauliflower dry sabzi", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
        { name: "Keema Matar", description: "Minced meat with green peas", price: 320, isVeg: false, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400" },
        { name: "Malai Kofta", description: "Fried paneer balls in creamy gravy", price: 290, isVeg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" }
    ],

    "Breads": [
        { name: "Butter Naan", description: "Soft naan with butter", price: 60, isVeg: true, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", spiceLevel: "MILD" },
        { name: "Garlic Naan", description: "Naan with garlic topping", price: 70, isVeg: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", spiceLevel: "MILD" },
        { name: "Cheese Naan", description: "Naan stuffed with cheese", price: 90, isVeg: true, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", spiceLevel: "MILD" },
        { name: "Tandoori Roti", description: "Whole wheat bread from tandoor", price: 40, isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", spiceLevel: "MILD" },
        { name: "Laccha Paratha", description: "Layered flaky paratha", price: 60, isVeg: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", spiceLevel: "MILD" },
        { name: "Stuffed Kulcha", description: "Kulcha stuffed with potato/paneer", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", spiceLevel: "MILD" },
        { name: "Missi Roti", description: "Gram flour mixed roti", price: 50, isVeg: true, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400", spiceLevel: "MILD" },
        { name: "Roomali Roti", description: "Thin handkerchief bread", price: 45, isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", spiceLevel: "MILD" }
    ],

    "Rice & Biryani": [
        { name: "Steamed Rice", description: "Plain basmati rice", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1536304993881-ff86e0c9c2c3?w=400", spiceLevel: "MILD" },
        { name: "Jeera Rice", description: "Cumin flavored rice", price: 150, isVeg: true, image: "https://images.unsplash.com/photo-1536304993881-ff86e0c9c2c3?w=400" },
        { name: "Veg Biryani", description: "Aromatic rice with vegetables", price: 220, isVeg: true, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
        { name: "Chicken Biryani", description: "Layered rice with spiced chicken", price: 280, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
        { name: "Mutton Biryani", description: "Rich biryani with tender mutton", price: 340, isVeg: false, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" },
        { name: "Egg Biryani", description: "Biryani with boiled eggs", price: 240, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
        { name: "Veg Pulao", description: "Lightly spiced vegetable rice", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1536304993881-ff86e0c9c2c3?w=400" },
        { name: "Chicken Fried Rice", description: "Stir-fried rice with chicken", price: 240, isVeg: false, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" },
        { name: "Veg Fried Rice", description: "Stir-fried rice with vegetables", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" },
        { name: "Hyderabadi Biryani", description: "Authentic Hyderabadi dum biryani", price: 320, isVeg: false, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400" }
    ],

    "Noodles": [
        { name: "Veg Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400" },
        { name: "Chicken Hakka Noodles", description: "Noodles with chicken and vegetables", price: 220, isVeg: false, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400" },
        { name: "Schezwan Noodles", description: "Spicy Schezwan style noodles", price: 200, isVeg: true, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", spiceLevel: "HOT" },
        { name: "Chow Mein", description: "Crispy fried noodles", price: 190, isVeg: true, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400" },
        { name: "Singapore Noodles", description: "Curry flavored rice noodles", price: 230, isVeg: true, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400" },
        { name: "Egg Noodles", description: "Noodles tossed with egg", price: 200, isVeg: false, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400" }
    ],

    "Momos": [
        { name: "Veg Steamed Momos", description: "Steamed vegetable dumplings", price: 140, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400", spiceLevel: "MILD" },
        { name: "Chicken Steamed Momos", description: "Steamed chicken dumplings", price: 160, isVeg: false, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400" },
        { name: "Veg Fried Momos", description: "Crispy fried veg momos", price: 160, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400" },
        { name: "Chicken Fried Momos", description: "Crispy fried chicken momos", price: 180, isVeg: false, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400" },
        { name: "Paneer Momos", description: "Steamed paneer stuffed momos", price: 170, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400" },
        { name: "Tandoori Momos", description: "Momos grilled in tandoor", price: 190, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400" },
        { name: "Gravy Momos", description: "Momos served in spicy gravy", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400", spiceLevel: "MEDIUM" },
        { name: "Afghani Momos", description: "Momos in creamy white sauce", price: 200, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400", spiceLevel: "MILD" }
    ],

    "Pizza": [
        { name: "Margherita Pizza", description: "Classic cheese and tomato pizza", price: 220, isVeg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", spiceLevel: "MILD" },
        { name: "Farmhouse Pizza", description: "Loaded with fresh vegetables", price: 280, isVeg: true, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
        { name: "Pepperoni Pizza", description: "Pizza with spicy pepperoni", price: 340, isVeg: false, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400" },
        { name: "BBQ Chicken Pizza", description: "BBQ sauce with grilled chicken", price: 360, isVeg: false, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
        { name: "Paneer Tikka Pizza", description: "Indian fusion pizza with paneer", price: 300, isVeg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
        { name: "Cheese Burst Pizza", description: "Extra cheese filled crust", price: 350, isVeg: true, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400", spiceLevel: "MILD" },
        { name: "Mexican Wave Pizza", description: "Spicy Mexican toppings", price: 320, isVeg: true, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", spiceLevel: "HOT" },
        { name: "Chicken Supreme", description: "Loaded with chicken toppings", price: 380, isVeg: false, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" }
    ],

    "Burgers": [
        { name: "Veg Burger", description: "Classic vegetable patty burger", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
        { name: "Chicken Burger", description: "Juicy chicken patty burger", price: 160, isVeg: false, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
        { name: "Paneer Burger", description: "Grilled paneer patty burger", price: 150, isVeg: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
        { name: "Double Cheese Burger", description: "Extra cheese loaded burger", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400", spiceLevel: "MILD" },
        { name: "Chicken Zinger", description: "Crispy fried chicken burger", price: 190, isVeg: false, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
        { name: "Aloo Tikki Burger", description: "Indian style potato burger", price: 110, isVeg: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
        { name: "Fish Burger", description: "Crispy fish fillet burger", price: 200, isVeg: false, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
        { name: "BBQ Chicken Burger", description: "BBQ glazed chicken burger", price: 210, isVeg: false, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400" }
    ],

    "Rolls & Wraps": [
        { name: "Paneer Roll", description: "Grilled paneer wrapped in paratha", price: 140, isVeg: true, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
        { name: "Chicken Roll", description: "Spiced chicken in flaky wrap", price: 160, isVeg: false, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
        { name: "Egg Roll", description: "Egg omelette roll with veggies", price: 120, isVeg: false, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
        { name: "Mutton Roll", description: "Tender mutton seekh in wrap", price: 180, isVeg: false, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
        { name: "Veg Frankie", description: "Mixed vegetables in frankie roll", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
        { name: "Chicken Shawarma", description: "Middle eastern chicken wrap", price: 170, isVeg: false, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400" },
        { name: "Veg Shawarma", description: "Vegetable shawarma wrap", price: 140, isVeg: true, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400" },
        { name: "Fish Roll", description: "Crispy fish in wrap", price: 180, isVeg: false, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" }
    ],

    "Thali": [
        { name: "Veg Thali", description: "Complete vegetarian meal with dal, sabzi, roti, rice, dessert", price: 280, isVeg: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", spiceLevel: "MEDIUM" },
        { name: "Non-Veg Thali", description: "Complete meal with chicken, dal, roti, rice", price: 350, isVeg: false, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", spiceLevel: "MEDIUM" },
        { name: "Punjabi Thali", description: "Authentic Punjabi style thali", price: 320, isVeg: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
        { name: "South Indian Thali", description: "Rice, sambar, rasam, poriyal, curd", price: 260, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
        { name: "Gujarati Thali", description: "Sweet and savory Gujarati meal", price: 300, isVeg: true, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" },
        { name: "Rajasthani Thali", description: "Dal bati churma special", price: 340, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" }
    ],

    "Combos": [
        { name: "Burger + Fries + Coke", description: "Classic combo meal", price: 250, isVeg: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
        { name: "Biryani + Raita + Coke", description: "Biryani combo meal", price: 320, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
        { name: "Pizza + Garlic Bread + Coke", description: "Pizza combo deal", price: 400, isVeg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
        { name: "Momos + Noodles", description: "Chinese combo", price: 280, isVeg: true, image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400" },
        { name: "Dal + Rice + Roti", description: "Simple meal combo", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", spiceLevel: "MILD" },
        { name: "Chicken + Rice + Coke", description: "Chicken meal combo", price: 340, isVeg: false, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" }
    ],

    "Desserts": [
        { name: "Gulab Jamun", description: "Deep fried milk dumplings in sugar syrup", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1601303516534-9d6eaaab2f6e?w=400", spiceLevel: "MILD" },
        { name: "Rasmalai", description: "Soft paneer discs in sweet milk", price: 100, isVeg: true, image: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba9?w=400", spiceLevel: "MILD" },
        { name: "Brownie with Ice Cream", description: "Chocolate brownie with vanilla ice cream", price: 160, isVeg: true, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", spiceLevel: "MILD" },
        { name: "Gajar Ka Halwa", description: "Traditional carrot pudding", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1601303516534-9d6eaaab2f6e?w=400", spiceLevel: "MILD" },
        { name: "Kheer", description: "Rice pudding with nuts", price: 90, isVeg: true, image: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba9?w=400", spiceLevel: "MILD" },
        { name: "Rasgulla", description: "Soft cottage cheese balls in syrup", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1601303516534-9d6eaaab2f6e?w=400", spiceLevel: "MILD" },
        { name: "Jalebi", description: "Crispy sweet spirals", price: 70, isVeg: true, image: "https://images.unsplash.com/photo-1601303516534-9d6eaaab2f6e?w=400", spiceLevel: "MILD" },
        { name: "Ice Cream Sundae", description: "Ice cream with toppings", price: 140, isVeg: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", spiceLevel: "MILD" },
        { name: "Chocolate Lava Cake", description: "Warm cake with molten chocolate", price: 180, isVeg: true, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", spiceLevel: "MILD" },
        { name: "Moong Dal Halwa", description: "Rich lentil dessert", price: 130, isVeg: true, image: "https://images.unsplash.com/photo-1601303516534-9d6eaaab2f6e?w=400", spiceLevel: "MILD" }
    ],

    "Beverages": [
        { name: "Masala Chai", description: "Indian spiced tea", price: 40, isVeg: true, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", spiceLevel: "MILD" },
        { name: "Coffee", description: "Hot brewed coffee", price: 60, isVeg: true, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", spiceLevel: "MILD" },
        { name: "Cold Coffee", description: "Chilled coffee with ice cream", price: 120, isVeg: true, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", spiceLevel: "MILD" },
        { name: "Fresh Lime Soda", description: "Refreshing lime drink", price: 70, isVeg: true, image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400", spiceLevel: "MILD" },
        { name: "Mango Lassi", description: "Sweet mango yogurt drink", price: 100, isVeg: true, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400", spiceLevel: "MILD" },
        { name: "Sweet Lassi", description: "Traditional yogurt drink", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400", spiceLevel: "MILD" },
        { name: "Buttermilk", description: "Spiced chilled buttermilk", price: 60, isVeg: true, image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400", spiceLevel: "MILD" },
        { name: "Soft Drinks", description: "Coke/Pepsi/Sprite", price: 50, isVeg: true, image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400", spiceLevel: "MILD" },
        { name: "Fresh Juice", description: "Orange/Apple/Watermelon", price: 90, isVeg: true, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", spiceLevel: "MILD" },
        { name: "Mojito", description: "Refreshing mint cooler", price: 110, isVeg: true, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", spiceLevel: "MILD" }
    ],

    "Ice Cream": [
        { name: "Vanilla Ice Cream", description: "Classic vanilla scoop", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400", spiceLevel: "MILD" },
        { name: "Chocolate Ice Cream", description: "Rich chocolate scoop", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", spiceLevel: "MILD" },
        { name: "Strawberry Ice Cream", description: "Fresh strawberry flavor", price: 80, isVeg: true, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400", spiceLevel: "MILD" },
        { name: "Butterscotch Ice Cream", description: "Crunchy butterscotch", price: 90, isVeg: true, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400", spiceLevel: "MILD" },
        { name: "Mango Ice Cream", description: "Seasonal mango delight", price: 100, isVeg: true, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400", spiceLevel: "MILD" },
        { name: "Kulfi", description: "Traditional Indian ice cream", price: 70, isVeg: true, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400", spiceLevel: "MILD" },
        { name: "Sundae", description: "Ice cream with sauces and toppings", price: 140, isVeg: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", spiceLevel: "MILD" },
        { name: "Falooda", description: "Rose milk with ice cream and vermicelli", price: 130, isVeg: true, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400", spiceLevel: "MILD" }
    ]
};

// Helper function to get random items from a category
export const getRandomMenuItems = (category: string, count: number): MenuItemTemplate[] => {
    const items = menuItemsByCategory[category] || [];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, items.length));
};