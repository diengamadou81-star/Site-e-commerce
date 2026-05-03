"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/ToastProvider";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.id);
  const discount = product.oldPrice ? calculateDiscount(product.oldPrice, product.price) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} ajouté au panier !`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    showToast(
      wishlisted ? "Retiré des favoris" : "Ajouté aux favoris ❤️",
      wishlisted ? "info" : "success"
    );
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 img-zoom">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Nouveau
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Stock limité
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              ⚡ Flash
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
          />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={15} />
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                className={
                  star <= Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200 dark:text-gray-600"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-primary-600 dark:text-primary-400 font-display">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
            Livraison {product.deliveryDays <= 2 ? "express" : `J+${product.deliveryDays}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
