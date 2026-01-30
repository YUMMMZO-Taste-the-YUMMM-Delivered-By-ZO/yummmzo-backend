export interface CategoryTemplate {
    name: string;
    description: string;
    sortOrder: number;
}

export const categoryTemplates: CategoryTemplate[] = [
    { name: "Recommended", description: "Chef's special recommendations", sortOrder: 1 },
    { name: "Bestsellers", description: "Most loved by our customers", sortOrder: 2 },
    { name: "Starters", description: "Begin your meal with these appetizers", sortOrder: 3 },
    { name: "Soups", description: "Warm and comforting soups", sortOrder: 4 },
    { name: "Salads", description: "Fresh and healthy salads", sortOrder: 5 },
    { name: "Main Course", description: "Hearty main dishes", sortOrder: 6 },
    { name: "Breads", description: "Freshly baked Indian breads", sortOrder: 7 },
    { name: "Rice & Biryani", description: "Flavorful rice dishes", sortOrder: 8 },
    { name: "Noodles", description: "Stir-fried noodle dishes", sortOrder: 9 },
    { name: "Momos", description: "Steamed and fried dumplings", sortOrder: 10 },
    { name: "Pizza", description: "Hand-tossed pizzas", sortOrder: 11 },
    { name: "Burgers", description: "Juicy burgers", sortOrder: 12 },
    { name: "Rolls & Wraps", description: "Stuffed rolls and wraps", sortOrder: 13 },
    { name: "Thali", description: "Complete meal platters", sortOrder: 14 },
    { name: "Combos", description: "Value meal combos", sortOrder: 15 },
    { name: "Desserts", description: "Sweet endings", sortOrder: 16 },
    { name: "Beverages", description: "Refreshing drinks", sortOrder: 17 },
    { name: "Ice Cream", description: "Frozen delights", sortOrder: 18 }
];