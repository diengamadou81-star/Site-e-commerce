"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Heart, User, Menu, X,
  Sun, Moon, ChevronDown, MapPin, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export function Header() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-900 dark:bg-gray-950 text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> Livraison partout en Afrique
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} /> +221 33 800 00 00
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-primary-400 transition-colors">Vendez sur Jumia</Link>
          <Link href="#" className="hover:text-primary-400 transition-colors">Téléchargez l&apos;app</Link>
        </div>
      </div>

      {/* Main header */}
      <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-1.5" aria-label="Accueil Jumia">
          <div className="bg-primary-500 text-white font-display font-black text-xl px-3 py-1 rounded-lg tracking-tight">
            J
          </div>
          <span className="font-display font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
            umia<span className="text-primary-500">.</span>
          </span>
        </Link>

        {/* Search bar */}
        <div ref={searchRef} className="flex-1 relative max-w-2xl">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              placeholder="Rechercher produits, marques..."
              aria-label="Rechercher des produits"
              className="w-full border-2 border-primary-500 rounded-l-full px-5 py-2.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-600 dark:border-primary-400"
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white px-5 rounded-r-full transition-colors shrink-0"
              aria-label="Lancer la recherche"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Search size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/products?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => setShowSuggestions(false)}
                className="block px-4 py-3 text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 border-t dark:border-gray-700"
              >
                Voir tous les résultats pour &quot;{searchQuery}&quot;
              </Link>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Basculer le mode sombre"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          <Link
            href="/cart"
            className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Panier (${cartCount} articles)`}
          >
            <ShoppingCart size={22} className="text-gray-700 dark:text-gray-200" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="#"
            className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex"
            aria-label={`Liste de souhaits (${wishlistCount} produits)`}
          >
            <Heart size={22} className="text-gray-700 dark:text-gray-200" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <User size={20} className="text-gray-700 dark:text-gray-200" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Compte</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline block">
                Tout voir →
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-xl z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
