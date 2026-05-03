"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonCard } from "@/components/product/SkeletonCard";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { SlidersHorizontal, Grid3X3, Grid2X2, ChevronDown, X } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

type SortOption = "popular" | "price-asc" | "price-desc" | "rating" | "newest";
type GridCols = 2 | 3 | 4;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const flashParam = searchParams.get("flash") === "true";
  const newParam = searchParams.get("new") === "true";

  const [sort, setSort] = useState<SortOption>("popular");
  const [gridCols, setGridCols] = useState<GridCols>(3);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (qParam) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(qParam.toLowerCase()) ||
        p.category.toLowerCase().includes(qParam.toLowerCase()) ||
        p.description.toLowerCase().includes(qParam.toLowerCase())
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }
    if (flashParam) result = result.filter((p) => p.isFlashSale);
    if (newParam) result = result.filter((p) => p.isNew);
    if (inStockOnly) result = result.filter((p) => p.stock > 0);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    switch (sort) {
      case "price-asc": return result.sort((a, b) => a.price - b.price);
      case "price-desc": return result.sort((a, b) => b.price - a.price);
      case "rating": return result.sort((a, b) => b.rating - a.rating);
      case "newest": return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [qParam, selectedCategory, flashParam, newParam, inStockOnly, priceRange, minRating, sort]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 1000000]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const hasFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000000 || minRating > 0 || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
          {qParam ? `Résultats pour "${qParam}"` :
           flashParam ? "⚡ Flash Sales" :
           newParam ? "✨ Nouveautés" :
           selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || "Produits" :
           "Tous les produits"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside
          className={cn(
            "w-64 shrink-0 hidden md:block",
            filterOpen && "fixed inset-0 z-50 md:relative md:inset-auto bg-white dark:bg-gray-900 md:bg-transparent p-4 md:p-0 overflow-y-auto"
          )}
          aria-label="Filtres de recherche"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Filtres</h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Effacer
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Catégorie</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory("")}
                    className="accent-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Toutes</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                      className="accent-primary-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Prix (FCFA)</h3>
              <div className="space-y-2">
                {[
                  [0, 50000, "Moins de 50 000"],
                  [50000, 150000, "50 000 – 150 000"],
                  [150000, 400000, "150 000 – 400 000"],
                  [400000, 1000000, "Plus de 400 000"],
                ].map(([min, max, label]) => (
                  <label key={label as string} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === min && priceRange[1] === max}
                      onChange={() => setPriceRange([min as number, max as number])}
                      className="accent-primary-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{label as string}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Note minimale</h3>
              <div className="space-y-2">
                {[4, 3, 2, 0].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="accent-primary-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {r === 0 ? "Toutes" : `${r}★ et plus`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* In stock */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-primary-500 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">En stock seulement</span>
            </label>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 bg-white dark:bg-gray-800 rounded-2xl p-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-1.5 border dark:border-gray-600 rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal size={16} /> Filtres
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Trier:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm pl-3 pr-8 py-1.5 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                  aria-label="Trier les produits"
                >
                  <option value="popular">Popularité</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="newest">Nouveautés</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>

              {/* Grid toggle */}
              <div className="flex items-center border dark:border-gray-600 rounded-xl overflow-hidden">
                {([2, 3, 4] as GridCols[]).map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={cn(
                      "px-2.5 py-1.5 transition-colors",
                      gridCols === cols
                        ? "bg-primary-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    )}
                    aria-label={`${cols} colonnes`}
                  >
                    {cols === 2 ? <Grid2X2 size={16} /> : <Grid3X3 size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className={cn("grid gap-4", `grid-cols-${gridCols}`)}>
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-xl text-gray-800 dark:text-gray-200 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Essayez d&apos;autres termes ou modifiez vos filtres</p>
              <button onClick={clearFilters} className="bg-primary-500 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-primary-600 transition-colors">
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                gridCols === 2 && "grid-cols-2",
                gridCols === 3 && "grid-cols-2 sm:grid-cols-3",
                gridCols === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              )}
            >
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
