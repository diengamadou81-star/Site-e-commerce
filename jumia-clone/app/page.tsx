import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashSale } from "@/components/home/FlashSale";
import { ProductCard } from "@/components/product/ProductCard";
import { products, newProducts } from "@/data/products";
import Link from "next/link";
import { TrendingUp, Star, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Jumia Clone - N°1 du commerce en ligne en Afrique",
  description: "Découvrez des milliers de produits à prix réduits. Livraison rapide partout en Afrique.",
};

const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
const recommended = [...products].sort(() => Math.random() - 0.5).slice(0, 8);

function SectionHeader({ icon: Icon, title, link }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  link: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <Icon size={22} className="text-primary-500" />
        <h2 className="font-display font-bold text-xl md:text-2xl text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <Link href={link} className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
        Voir tout →
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroBanner />

      {/* Categories */}
      <CategoryGrid />

      {/* Flash Sales */}
      <FlashSale />

      {/* Best sellers */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <SectionHeader icon={TrendingUp} title="Meilleures ventes" link="/products?sort=rating" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {topRated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div
          className="rounded-3xl overflow-hidden relative h-40 md:h-52"
          style={{
            background: "linear-gradient(135deg, #F68B1E 0%, #E07310 50%, #1A1A2E 100%)",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <p className="text-white/80 text-sm font-medium mb-1">Offre limitée</p>
            <h3 className="font-display font-black text-white text-2xl md:text-4xl">
              Livraison GRATUITE<br />dès 50 000 FCFA
            </h3>
            <Link
              href="/products"
              className="w-fit mt-4 bg-white text-primary-600 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Profiter de l&apos;offre
            </Link>
          </div>
        </div>
      </div>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <SectionHeader icon={Sparkles} title="Nouveautés" link="/products?new=true" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {newProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="bg-white dark:bg-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader icon={Star} title="Recommandés pour vous" link="/products" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
