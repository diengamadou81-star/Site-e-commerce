"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.getTotalItems());

  const links = [
    { href: "/", icon: Home, label: "Accueil" },
    { href: "/products", icon: Search, label: "Chercher" },
    { href: "/cart", icon: ShoppingCart, label: "Panier", badge: cartCount },
    { href: "#wishlist", icon: Heart, label: "Favoris" },
    { href: "#account", icon: User, label: "Compte" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 z-40 safe-area-bottom">
      <div className="flex items-center justify-around py-1.5">
        {links.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative",
                isActive ? "text-primary-500" : "text-gray-500 dark:text-gray-400"
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{label}</span>
              {badge != null && badge > 0 && (
                <span className="absolute -top-0.5 right-1 bg-primary-500 text-white text-xs font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
