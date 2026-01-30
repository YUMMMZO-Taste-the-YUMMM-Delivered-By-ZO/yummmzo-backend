export interface MenuItemTemplate {
    name: string;
    description: string;
    price: number;
    isVeg: boolean;
    image?: string;
}

export const menuItemsByCategory: Record<string, MenuItemTemplate[]> = {
    "Recommended": [
        { name: "Paneer Butter Masala", description: "Creamy tomato curry with cottage cheese cubes", price: 280, isVeg: true },
        { name: "Chicken Biryani", description: "Aromatic basmati rice with spiced chicken", price: 320, isVeg: false },
        { name: "Butter Naan", description: "Soft leavened bread brushed with butter", price: 60, isVeg: true },
        { name: "Dal Makhani", description: "Slow-cooked black lentils in creamy gravy", price: 240, isVeg: true },
        { name: "Mutton Rogan Josh", description: "Kashmiri style mutton curry", price: 380, isVeg: false }
    ],

    "Bestsellers": [
        { name: "Tandoori Chicken", description: "Clay oven roasted chicken with spices", price: 340, isVeg: false },
        { name: "Veg Manchurian", description: "Crispy vegetable balls in tangy sauce", price: 220, isVeg: true },
        { name: "Garlic Naan", description: "Naan topped with garlic and coriander", price: 70, isVeg: true },
        { name: "Chicken Tikka", description: "Boneless chicken marinated and grilled", price: 290, isVeg: false },
        { name: "Shahi Paneer", description: "Paneer in rich cashew and cream gravy", price: 290, isVeg: true }
    ],

    "Starters": [
        { name: "Paneer Tikka", description: "Grilled cottage cheese with bell peppers", price: 260, isVeg: true },
        { name: "Chicken 65", description: "Spicy deep-fried chicken bites", price: 280, isVeg: false },
        { name: "Veg Spring Roll", description: "Crispy rolls stuffed with vegetables", price: 180, isVeg: true },
        { name: "Fish Fingers", description: "Crispy fried fish strips", price: 320, isVeg: false },
        { name: "Hara Bhara Kebab", description: "Spinach and green peas patties", price: 220, isVeg: true },
        { name: "Mutton Seekh Kebab", description: "Minced mutton skewers", price: 350, isVeg: false },
        { name: "Crispy Corn", description: "Crunchy corn kernels with spices", price: 190, isVeg: true },
        { name: "Prawn Koliwada", description: "Spiced and fried prawns", price: 380, isVeg: false },
        { name: "Aloo Tikki", description: "Crispy potato patties", price: 150, isVeg: true },
        { name: "Chicken Malai Tikka", description: "Creamy marinated chicken tikka", price: 310, isVeg: false }
    ],

    "Soups": [
        { name: "Tomato Soup", description: "Classic creamy tomato soup", price: 120, isVeg: true },
        { name: "Hot & Sour Soup", description: "Spicy and tangy vegetable soup", price: 140, isVeg: true },
        { name: "Chicken Manchow Soup", description: "Indo-Chinese chicken soup with crispy noodles", price: 160, isVeg: false },
        { name: "Sweet Corn Soup", description: "Creamy corn soup", price: 130, isVeg: true },
        { name: "Mutton Shorba", description: "Traditional mutton broth", price: 180, isVeg: false },
        { name: "Cream of Mushroom", description: "Rich mushroom soup", price: 150, isVeg: true }
    ],

    "Salads": [
        { name: "Green Salad", description: "Fresh mixed greens with dressing", price: 120, isVeg: true },
        { name: "Caesar Salad", description: "Romaine lettuce with caesar dressing", price: 220, isVeg: true },
        { name: "Chicken Caesar Salad", description: "Caesar salad with grilled chicken", price: 280, isVeg: false },
        { name: "Greek Salad", description: "Cucumber, tomato, olives, feta cheese", price: 240, isVeg: true },
        { name: "Russian Salad", description: "Mixed vegetables in creamy mayo", price: 180, isVeg: true }
    ],

    "Main Course": [
        { name: "Paneer Butter Masala", description: "Paneer in rich tomato butter gravy", price: 280, isVeg: true },
        { name: "Dal Tadka", description: "Yellow lentils tempered with spices", price: 180, isVeg: true },
        { name: "Butter Chicken", description: "Tender chicken in creamy tomato sauce", price: 320, isVeg: false },
        { name: "Kadai Paneer", description: "Paneer with bell peppers in kadai masala", price: 270, isVeg: true },
        { name: "Chicken Curry", description: "Traditional Indian chicken curry", price: 290, isVeg: false },
        { name: "Palak Paneer", description: "Cottage cheese in spinach gravy", price: 260, isVeg: true },
        { name: "Mutton Curry", description: "Slow-cooked mutton in spiced gravy", price: 380, isVeg: false },
        { name: "Chole Masala", description: "Spiced chickpea curry", price: 200, isVeg: true },
        { name: "Egg Curry", description: "Boiled eggs in onion-tomato gravy", price: 220, isVeg: false },
        { name: "Mix Veg", description: "Assorted vegetables in curry", price: 220, isVeg: true },
        { name: "Fish Curry", description: "Fish cooked in tangy curry", price: 340, isVeg: false },
        { name: "Aloo Gobi", description: "Potato and cauliflower dry sabzi", price: 180, isVeg: true },
        { name: "Keema Matar", description: "Minced meat with green peas", price: 320, isVeg: false },
        { name: "Malai Kofta", description: "Fried paneer balls in creamy gravy", price: 290, isVeg: true }
    ],

    "Breads": [
        { name: "Butter Naan", description: "Soft naan with butter", price: 60, isVeg: true },
        { name: "Garlic Naan", description: "Naan with garlic topping", price: 70, isVeg: true },
        { name: "Cheese Naan", description: "Naan stuffed with cheese", price: 90, isVeg: true },
        { name: "Tandoori Roti", description: "Whole wheat bread from tandoor", price: 40, isVeg: true },
        { name: "Laccha Paratha", description: "Layered flaky paratha", price: 60, isVeg: true },
        { name: "Stuffed Kulcha", description: "Kulcha stuffed with potato/paneer", price: 80, isVeg: true },
        { name: "Missi Roti", description: "Gram flour mixed roti", price: 50, isVeg: true },
        { name: "Roomali Roti", description: "Thin handkerchief bread", price: 45, isVeg: true }
    ],

    "Rice & Biryani": [
        { name: "Steamed Rice", description: "Plain basmati rice", price: 120, isVeg: true },
        { name: "Jeera Rice", description: "Cumin flavored rice", price: 150, isVeg: true },
        { name: "Veg Biryani", description: "Aromatic rice with vegetables", price: 220, isVeg: true },
        { name: "Chicken Biryani", description: "Layered rice with spiced chicken", price: 280, isVeg: false },
        { name: "Mutton Biryani", description: "Rich biryani with tender mutton", price: 340, isVeg: false },
        { name: "Egg Biryani", description: "Biryani with boiled eggs", price: 240, isVeg: false },
        { name: "Veg Pulao", description: "Lightly spiced vegetable rice", price: 180, isVeg: true },
        { name: "Chicken Fried Rice", description: "Stir-fried rice with chicken", price: 240, isVeg: false },
        { name: "Veg Fried Rice", description: "Stir-fried rice with vegetables", price: 180, isVeg: true },
        { name: "Hyderabadi Biryani", description: "Authentic Hyderabadi dum biryani", price: 320, isVeg: false }
    ],

    "Noodles": [
        { name: "Veg Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 180, isVeg: true },
        { name: "Chicken Hakka Noodles", description: "Noodles with chicken and vegetables", price: 220, isVeg: false },
        { name: "Schezwan Noodles", description: "Spicy Schezwan style noodles", price: 200, isVeg: true },
        { name: "Chow Mein", description: "Crispy fried noodles", price: 190, isVeg: true },
        { name: "Singapore Noodles", description: "Curry flavored rice noodles", price: 230, isVeg: true },
        { name: "Egg Noodles", description: "Noodles tossed with egg", price: 200, isVeg: false }
    ],

    "Momos": [
        { name: "Veg Steamed Momos", description: "Steamed vegetable dumplings", price: 140, isVeg: true },
        { name: "Chicken Steamed Momos", description: "Steamed chicken dumplings", price: 160, isVeg: false },
        { name: "Veg Fried Momos", description: "Crispy fried veg momos", price: 160, isVeg: true },
        { name: "Chicken Fried Momos", description: "Crispy fried chicken momos", price: 180, isVeg: false },
        { name: "Paneer Momos", description: "Steamed paneer stuffed momos", price: 170, isVeg: true },
        { name: "Tandoori Momos", description: "Momos grilled in tandoor", price: 190, isVeg: true },
        { name: "Gravy Momos", description: "Momos served in spicy gravy", price: 180, isVeg: true },
        { name: "Afghani Momos", description: "Momos in creamy white sauce", price: 200, isVeg: true }
    ],

    "Pizza": [
        { name: "Margherita Pizza", description: "Classic cheese and tomato pizza", price: 220, isVeg: true },
        { name: "Farmhouse Pizza", description: "Loaded with fresh vegetables", price: 280, isVeg: true },
        { name: "Pepperoni Pizza", description: "Pizza with spicy pepperoni", price: 340, isVeg: false },
        { name: "BBQ Chicken Pizza", description: "BBQ sauce with grilled chicken", price: 360, isVeg: false },
        { name: "Paneer Tikka Pizza", description: "Indian fusion pizza with paneer", price: 300, isVeg: true },
        { name: "Cheese Burst Pizza", description: "Extra cheese filled crust", price: 350, isVeg: true },
        { name: "Mexican Wave Pizza", description: "Spicy Mexican toppings", price: 320, isVeg: true },
        { name: "Chicken Supreme", description: "Loaded with chicken toppings", price: 380, isVeg: false }
    ],

    "Burgers": [
        { name: "Veg Burger", description: "Classic vegetable patty burger", price: 120, isVeg: true },
        { name: "Chicken Burger", description: "Juicy chicken patty burger", price: 160, isVeg: false },
        { name: "Paneer Burger", description: "Grilled paneer patty burger", price: 150, isVeg: true },
        { name: "Double Cheese Burger", description: "Extra cheese loaded burger", price: 180, isVeg: true },
        { name: "Chicken Zinger", description: "Crispy fried chicken burger", price: 190, isVeg: false },
        { name: "Aloo Tikki Burger", description: "Indian style potato burger", price: 110, isVeg: true },
        { name: "Fish Burger", description: "Crispy fish fillet burger", price: 200, isVeg: false },
        { name: "BBQ Chicken Burger", description: "BBQ glazed chicken burger", price: 210, isVeg: false }
    ],

    "Rolls & Wraps": [
        { name: "Paneer Roll", description: "Grilled paneer wrapped in paratha", price: 140, isVeg: true },
        { name: "Chicken Roll", description: "Spiced chicken in flaky wrap", price: 160, isVeg: false },
        { name: "Egg Roll", description: "Egg omelette roll with veggies", price: 120, isVeg: false },
        { name: "Mutton Roll", description: "Tender mutton seekh in wrap", price: 180, isVeg: false },
        { name: "Veg Frankie", description: "Mixed vegetables in frankie roll", price: 120, isVeg: true },
        { name: "Chicken Shawarma", description: "Middle eastern chicken wrap", price: 170, isVeg: false },
        { name: "Veg Shawarma", description: "Vegetable shawarma wrap", price: 140, isVeg: true },
        { name: "Fish Roll", description: "Crispy fish in wrap", price: 180, isVeg: false }
    ],

    "Thali": [
        { name: "Veg Thali", description: "Complete vegetarian meal with dal, sabzi, roti, rice, dessert", price: 280, isVeg: true },
        { name: "Non-Veg Thali", description: "Complete meal with chicken, dal, roti, rice", price: 350, isVeg: false },
        { name: "Punjabi Thali", description: "Authentic Punjabi style thali", price: 320, isVeg: true },
        { name: "South Indian Thali", description: "Rice, sambar, rasam, poriyal, curd", price: 260, isVeg: true },
        { name: "Gujarati Thali", description: "Sweet and savory Gujarati meal", price: 300, isVeg: true },
        { name: "Rajasthani Thali", description: "Dal bati churma special", price: 340, isVeg: true }
    ],

    "Combos": [
        { name: "Burger + Fries + Coke", description: "Classic combo meal", price: 250, isVeg: true },
        { name: "Biryani + Raita + Coke", description: "Biryani combo meal", price: 320, isVeg: false },
        { name: "Pizza + Garlic Bread + Coke", description: "Pizza combo deal", price: 400, isVeg: true },
        { name: "Momos + Noodles", description: "Chinese combo", price: 280, isVeg: true },
        { name: "Dal + Rice + Roti", description: "Simple meal combo", price: 180, isVeg: true },
        { name: "Chicken + Rice + Coke", description: "Chicken meal combo", price: 340, isVeg: false }
    ],

    "Desserts": [
        { name: "Gulab Jamun", description: "Deep fried milk dumplings in sugar syrup", price: 80, isVeg: true },
        { name: "Rasmalai", description: "Soft paneer discs in sweet milk", price: 100, isVeg: true },
        { name: "Brownie with Ice Cream", description: "Chocolate brownie with vanilla ice cream", price: 160, isVeg: true },
        { name: "Gajar Ka Halwa", description: "Traditional carrot pudding", price: 120, isVeg: true },
        { name: "Kheer", description: "Rice pudding with nuts", price: 90, isVeg: true },
        { name: "Rasgulla", description: "Soft cottage cheese balls in syrup", price: 80, isVeg: true },
        { name: "Jalebi", description: "Crispy sweet spirals", price: 70, isVeg: true },
        { name: "Ice Cream Sundae", description: "Ice cream with toppings", price: 140, isVeg: true },
        { name: "Chocolate Lava Cake", description: "Warm cake with molten chocolate", price: 180, isVeg: true },
        { name: "Moong Dal Halwa", description: "Rich lentil dessert", price: 130, isVeg: true }
    ],

    "Beverages": [
        { name: "Masala Chai", description: "Indian spiced tea", price: 40, isVeg: true },
        { name: "Coffee", description: "Hot brewed coffee", price: 60, isVeg: true },
        { name: "Cold Coffee", description: "Chilled coffee with ice cream", price: 120, isVeg: true },
        { name: "Fresh Lime Soda", description: "Refreshing lime drink", price: 70, isVeg: true },
        { name: "Mango Lassi", description: "Sweet mango yogurt drink", price: 100, isVeg: true },
        { name: "Sweet Lassi", description: "Traditional yogurt drink", price: 80, isVeg: true },
        { name: "Buttermilk", description: "Spiced chilled buttermilk", price: 60, isVeg: true },
        { name: "Soft Drinks", description: "Coke/Pepsi/Sprite", price: 50, isVeg: true },
        { name: "Fresh Juice", description: "Orange/Apple/Watermelon", price: 90, isVeg: true },
        { name: "Mojito", description: "Refreshing mint cooler", price: 110, isVeg: true }
    ],

    "Ice Cream": [
        { name: "Vanilla Ice Cream", description: "Classic vanilla scoop", price: 80, isVeg: true },
        { name: "Chocolate Ice Cream", description: "Rich chocolate scoop", price: 80, isVeg: true },
        { name: "Strawberry Ice Cream", description: "Fresh strawberry flavor", price: 80, isVeg: true },
        { name: "Butterscotch Ice Cream", description: "Crunchy butterscotch", price: 90, isVeg: true },
        { name: "Mango Ice Cream", description: "Seasonal mango delight", price: 100, isVeg: true },
        { name: "Kulfi", description: "Traditional Indian ice cream", price: 70, isVeg: true },
        { name: "Sundae", description: "Ice cream with sauces and toppings", price: 140, isVeg: true },
        { name: "Falooda", description: "Rose milk with ice cream and vermicelli", price: 130, isVeg: true }
    ]
};

// Helper function to get random items from a category
export const getRandomMenuItems = (category: string, count: number): MenuItemTemplate[] => {
    const items = menuItemsByCategory[category] || [];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, items.length));
};