"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, applyPromoCode, promoCode, promoDiscount } = useCartStore();
  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCost = subtotal >= 50000 ? 0 : 2500;
  const discountAmount = (subtotal * promoDiscount) / 100;
  const total = subtotal - discountAmount + deliveryCost;

  const handlePromo = () => {
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      showToast(`Code promo appliqué : -${promoDiscount || "?"}%`, "success");
      setPromoError("");
    } else {
      setPromoError("Code promo invalide. Essayez : JUMIA20, DAKAR10");
      showToast("Code invalide", "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-3">
          Votre panier est vide
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Ajoutez des produits à votre panier pour commencer vos achats.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors"
        >
          <ShoppingBag size={20} />
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/products" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" aria-label="Retour aux produits">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
          Mon panier
        </h1>
        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold px-3 py-1 rounded-full">
          {items.length} article{items.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discount = item.product.oldPrice
              ? Math.round(((item.product.oldPrice - item.product.price) / item.product.oldPrice) * 100)
              : 0;
            return (
              <div
                key={item.product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex gap-4 items-start shadow-sm"
              >
                {/* Image */}
                <Link href={`/products/${item.product.id}`} className="relative w-24 h-24 shrink-0 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.product.id}`} className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug hover:text-primary-600 transition-colors">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => { removeItem(item.product.id); showToast("Produit retiré du panier", "info"); }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0"
                      aria-label="Supprimer du panier"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Variants */}
                  {(item.selectedColor || item.selectedSize || item.selectedStorage) && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {item.selectedColor && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{item.selectedColor}</span>}
                      {item.selectedSize && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Taille: {item.selectedSize}</span>}
                      {item.selectedStorage && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{item.selectedStorage} Go</span>}
                    </div>
                  )}

                  {/* Seller */}
                  <p className="text-xs text-gray-400 mt-1">Vendu par {item.product.seller}</p>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(item.product.oldPrice! * item.quantity)}</span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border dark:border-gray-600 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Diminuer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Augmenter"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue shopping */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline mt-2"
          >
            <ArrowLeft size={16} />
            Continuer mes achats
          </Link>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Promo code */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-primary-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Code promo</h2>
            </div>
            {promoCode ? (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2">
                <span className="text-green-700 dark:text-green-400 text-sm font-bold">{promoCode}</span>
                <span className="text-green-600 dark:text-green-400 text-sm ml-auto">-{promoDiscount}% appliqué ✓</span>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    placeholder="Entrez votre code"
                    className="flex-1 border dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                  />
                  <button
                    onClick={handlePromo}
                    className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Récapitulatif</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)
                </span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Réduction promo ({promoDiscount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                {deliveryCost === 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">Gratuite 🎉</span>
                ) : (
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(deliveryCost)}</span>
                )}
              </div>
              {deliveryCost > 0 && (
                <p className="text-xs text-gray-400 text-right">
                  Plus que {formatPrice(50000 - subtotal)} pour la livraison gratuite
                </p>
              )}
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-base">Total</span>
                <span className="font-black text-xl text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 rounded-2xl transition-colors text-base"
            >
              Passer la commande
              <ChevronRight size={20} />
            </Link>

            <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
              <span>🔒 Paiement sécurisé</span>
              <span>•</span>
              <span>↩️ Retour 15 jours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
