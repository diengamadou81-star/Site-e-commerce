import Link from "next/link";
import {
  Smartphone, Shirt, Home, Sparkles, Dumbbell, Car,
  Laptop, ShoppingBasket, Gamepad2, BookOpen
} from "lucide-react";
import { categories } from "@/data/categories";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Smartphone, Shirt, Home, Sparkles, Dumbbell, Car,
  Laptop, ShoppingBasket, Gamepad2, BookOpen,
};

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="max-w-7xl mx-auto px-4 py-8">
      <h2 id="categories-heading" className="font-display font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-5">
        Acheter par catégorie
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Smartphone;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:shadow-md transition-all"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: cat.bgColor }}
              >
                <Icon size={24} style={{ color: cat.color }} />
              </div>
              <span className="text-center text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">
                {cat.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
