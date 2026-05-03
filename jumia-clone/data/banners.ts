export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  bgColor: string;
  textColor: string;
}

export const banners: Banner[] = [
  {
    id: "1",
    title: "Soldes d'Été 2024",
    subtitle: "Jusqu'à -70% sur les meilleures marques",
    cta: "Découvrir les offres",
    ctaLink: "/products?sale=true",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
    bgColor: "#1A1A2E",
    textColor: "#ffffff",
  },
  {
    id: "2",
    title: "Nouveaux Smartphones",
    subtitle: "Les derniers modèles au meilleur prix",
    cta: "Voir les téléphones",
    ctaLink: "/products?category=electronique",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=400&fit=crop",
    bgColor: "#0F4C81",
    textColor: "#ffffff",
  },
  {
    id: "3",
    title: "Mode Africaine",
    subtitle: "Vêtements authentiques & tendance",
    cta: "Explorer la mode",
    ctaLink: "/products?category=mode",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop",
    bgColor: "#7B2D8B",
    textColor: "#ffffff",
  },
  {
    id: "4",
    title: "Flash Sale - 24h",
    subtitle: "Des prix incroyables, pour une durée limitée",
    cta: "Profiter maintenant",
    ctaLink: "/products?flash=true",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop",
    bgColor: "#C0392B",
    textColor: "#ffffff",
  },
];
