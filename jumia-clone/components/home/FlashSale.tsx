"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { flashSaleProducts } from "@/data/products";

function useCountdown(targetHours = 6) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });

  useEffect(() => {
    const end = Date.now() + targetHours * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHours]);

  return time;
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 dark:bg-gray-700 text-white font-display font-bold text-xl md:text-2xl min-w-[44px] h-11 flex items-center justify-center rounded-lg tabular-nums">
        {str}
      </div>
      <span className="text-xs text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

export function FlashSale() {
  const { h, m, s } = useCountdown(8);

  return (
    <section className="bg-white dark:bg-gray-800 py-8" aria-labelledby="flash-sale-heading">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 text-white p-2 rounded-xl">
              <Zap size={20} className="fill-white" />
            </div>
            <div>
              <h2 id="flash-sale-heading" className="font-display font-bold text-xl md:text-2xl text-gray-900 dark:text-white">
                Flash Sale
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Offres à durée limitée</p>
            </div>
            <div className="flex items-center gap-1.5 ml-4">
              <Digit value={h} label="H" />
              <span className="text-gray-400 font-bold text-lg mb-3">:</span>
              <Digit value={m} label="M" />
              <span className="text-gray-400 font-bold text-lg mb-3">:</span>
              <Digit value={s} label="S" />
            </div>
          </div>
          <Link
            href="/products?flash=true"
            className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline hidden sm:block"
          >
            Tout voir →
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {flashSaleProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
