"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, ShoppingCart, Heart, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Store, Share2, ZoomIn
} from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/ToastProvider";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews">("description");

  const addToCart = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.id);
  const discount = product.oldPrice ? calculateDiscount(product.oldPrice, product.price) : 0;

  const similar = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 6);

  const colorVariant = product.variants?.find((v) => v.type === "color");
  const sizeVariant = product.variants?.find((v) => v.type === "size");
  const storageVariant = product.variants?.find((v) => v.type === "storage");

  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedColor, selectedSize, selectedStorage });
    showToast(`${product.name} ajouté au panier !`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, { selectedColor, selectedSize, selectedStorage });
    window.location.href = "/cart";
  };

  const mockReviews = [
    { name: "Aminata D.", rating: 5, date: "12 mai 2024", comment: "Excellent produit, correspond parfaitement à la description. Livraison rapide et emballage soigné." },
    { name: "Moussa K.", rating: 4, date: "3 mai 2024", comment: "Très bon rapport qualité/prix. Je recommande vivement ce vendeur. Livraison en 2 jours." },
    { name: "Fatou S.", rating: 5, date: "28 avril 2024", comment: "Parfait ! Exactement ce que je cherchais. Le produit est de très bonne qualité." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'ariane" className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:text-primary-600">Accueil</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-primary-600">Produits</Link></li>
          <li>/</li>
          <li><Link href={`/products?category=${product.categorySlug}`} className="hover:text-primary-600">{product.category}</Link></li>
          <li>/</li>
          <li className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-3 group">
            <Image
              src={product.images[activeImage] || product.images[0]}
              alt={`${product.name} - image ${activeImage + 1}`}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={20} className="text-gray-500" />
            </div>
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === i
                      ? "border-primary-500 scale-105"
                      : "border-transparent hover:border-gray-300"
                  )}
                  aria-label={`Voir image ${i + 1}`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">{product.category}</p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-600"}
                />
              ))}
              <span className="ml-1 font-semibold text-gray-900 dark:text-white">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount} avis)</span>
            <span className="text-sm text-green-600 font-medium">{product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}</span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display font-black text-3xl text-primary-600 dark:text-primary-400">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                  <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded-full">
                    Économisez {formatPrice(product.oldPrice - product.price)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Color variants */}
          {colorVariant && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Couleur: <span className="font-normal">{selectedColor || "Sélectionner"}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {colorVariant.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => opt.available && setSelectedColor(opt.label)}
                    disabled={!opt.available}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      selectedColor === opt.label ? "border-primary-500 scale-110" : "border-gray-200",
                      !opt.available && "opacity-30 cursor-not-allowed"
                    )}
                    style={{ backgroundColor: opt.value }}
                    title={opt.label}
                    aria-label={`Couleur ${opt.label}${!opt.available ? " (indisponible)" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size variants */}
          {sizeVariant && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Taille: <span className="font-normal">{selectedSize || "Sélectionner"}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizeVariant.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => opt.available && setSelectedSize(opt.value)}
                    disabled={!opt.available}
                    className={cn(
                      "min-w-[44px] h-9 px-3 border-2 rounded-xl text-sm font-medium transition-all",
                      selectedSize === opt.value
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400",
                      !opt.available && "opacity-30 cursor-not-allowed line-through"
                    )}
                    aria-label={`Taille ${opt.value}${!opt.available ? " (indisponible)" : ""}`}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage variants */}
          {storageVariant && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Stockage: <span className="font-normal">{selectedStorage ? `${selectedStorage} Go` : "Sélectionner"}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {storageVariant.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => opt.available && setSelectedStorage(opt.value)}
                    disabled={!opt.available}
                    className={cn(
                      "px-4 h-9 border-2 rounded-xl text-sm font-medium transition-all",
                      selectedStorage === opt.value
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400",
                      !opt.available && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantité</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border dark:border-gray-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} disponibles</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-2xl transition-colors"
            >
              <ShoppingCart size={20} />
              Ajouter au panier
            </button>
            <button
              onClick={() => toggle(product)}
              className={cn(
                "w-14 flex items-center justify-center rounded-2xl border-2 transition-colors",
                wishlisted
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "border-gray-200 dark:border-gray-600 hover:border-red-300"
              )}
              aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
            </button>
            <button
              className="w-14 flex items-center justify-center rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 transition-colors"
              aria-label="Partager"
            >
              <Share2 size={20} className="text-gray-500" />
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-2xl transition-colors"
          >
            Acheter maintenant
          </button>

          {/* Delivery info */}
          <div className="space-y-2.5 pt-2 border-t dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
                <Truck size={16} className="text-green-600" />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Livraison estimée: </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.deliveryDays <= 2 ? "Express 24-48h" : `J+${product.deliveryDays}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
                <Shield size={16} className="text-blue-600" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">Paiement 100% sécurisé</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center shrink-0">
                <RotateCcw size={16} className="text-orange-600" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">Retour gratuit sous 15 jours</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center shrink-0">
                <Store size={16} className="text-purple-600" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                Vendu par: <span className="font-semibold text-gray-900 dark:text-white">{product.seller}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-10">
        <div className="flex border-b dark:border-gray-700">
          {(["description", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-4 text-sm font-semibold capitalize transition-colors",
                tab === t
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {t === "description" ? "Description" : `Avis clients (${product.reviewCount})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "description" ? (
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Average */}
              <div className="flex items-center gap-6 p-5 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div className="text-center">
                  <p className="font-display font-black text-5xl text-gray-900 dark:text-white">{product.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className={s <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{product.reviewCount} avis</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const pct = s === 5 ? 60 : s === 4 ? 25 : s === 3 ? 10 : s === 2 ? 3 : 2;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-4">{s}★</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              {mockReviews.map((review, i) => (
                <div key={i} className="flex gap-4 pb-5 border-b dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center shrink-0 font-bold text-primary-700 dark:text-primary-300">
                    {review.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.name}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <section aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="font-display font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-5">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
