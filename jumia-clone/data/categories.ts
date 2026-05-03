export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  productCount: number;
  slug: string;
}

export const categories: Category[] = [
  { id: "1", name: "Électronique", icon: "Smartphone", color: "#3B82F6", bgColor: "#EFF6FF", productCount: 1240, slug: "electronique" },
  { id: "2", name: "Mode & Vêtements", icon: "Shirt", color: "#EC4899", bgColor: "#FDF2F8", productCount: 3560, slug: "mode" },
  { id: "3", name: "Maison & Cuisine", icon: "Home", color: "#10B981", bgColor: "#ECFDF5", productCount: 890, slug: "maison" },
  { id: "4", name: "Beauté & Santé", icon: "Sparkles", color: "#8B5CF6", bgColor: "#F5F3FF", productCount: 1120, slug: "beaute" },
  { id: "5", name: "Sport & Loisirs", icon: "Dumbbell", color: "#F59E0B", bgColor: "#FFFBEB", productCount: 670, slug: "sport" },
  { id: "6", name: "Auto & Moto", icon: "Car", color: "#EF4444", bgColor: "#FEF2F2", productCount: 430, slug: "auto" },
  { id: "7", name: "Informatique", icon: "Laptop", color: "#06B6D4", bgColor: "#ECFEFF", productCount: 560, slug: "informatique" },
  { id: "8", name: "Alimentation", icon: "ShoppingBasket", color: "#84CC16", bgColor: "#F7FEE7", productCount: 2100, slug: "alimentation" },
  { id: "9", name: "Enfants & Jouets", icon: "Gamepad2", color: "#F97316", bgColor: "#FFF7ED", productCount: 780, slug: "enfants" },
  { id: "10", name: "Livres & Culture", icon: "BookOpen", color: "#6366F1", bgColor: "#EEF2FF", productCount: 345, slug: "livres" },
];
