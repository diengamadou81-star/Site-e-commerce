# 🛒 Jumia Clone — E-commerce Africain

Plateforme e-commerce complète inspirée de Jumia, construite avec Next.js 14, Tailwind CSS et Zustand.

## ✨ Fonctionnalités

- 🏠 Page d'accueil avec carousel, flash sales, grille de catégories
- 📦 Catalogue produits avec filtres, tri, toggle de grille
- 🛍️ Fiche produit avec galerie, variantes couleur/taille/stockage
- 🛒 Panier persistant avec code promo
- 💳 Checkout multi-étapes (adresse, livraison, paiement)
- 🌙 Mode sombre
- 📱 Navigation mobile (bottom nav + drawer)
- 🔍 Recherche avec suggestions live

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
jumia-clone/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── products/
│   │   ├── page.tsx        # Catalogue produits
│   │   └── [id]/page.tsx   # Fiche produit
│   ├── cart/page.tsx       # Panier
│   └── checkout/page.tsx   # Commande
├── components/
│   ├── layout/             # Header, Footer, BottomNav
│   ├── home/               # HeroBanner, FlashSale, CategoryGrid
│   ├── product/            # ProductCard, SkeletonCard
│   └── ui/                 # ToastProvider
├── store/
│   ├── cartStore.ts        # Zustand cart state
│   └── wishlistStore.ts    # Zustand wishlist state
├── data/
│   ├── products.ts         # 40 produits mock
│   ├── categories.ts       # 10 catégories
│   └── banners.ts          # 4 slides hero
└── lib/utils.ts            # cn, formatPrice, calculateDiscount
```

## 🌐 Déploiement sur Vercel

### 1. Initialiser Git

```bash
git init
git add .
git commit -m "feat: initial commit — Jumia Clone"
```

### 2. Créer un repo GitHub

```bash
# Sur github.com, créer un nouveau repo "jumia-clone"
# Puis :
git remote add origin https://github.com/VOTRE_USERNAME/jumia-clone.git
git branch -M main
git push -u origin main
```

### 3. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importer votre repo GitHub `jumia-clone`
3. Framework: **Next.js** (détecté automatiquement)
4. Cliquer **Deploy** → votre app est en ligne ! 🎉

### 4. Variables d'environnement (optionnel)

Aucune variable requise pour la version mock.
Pour une vraie base de données, ajouter dans Vercel → Settings → Environment Variables :

```
DATABASE_URL=...
NEXT_PUBLIC_API_URL=...
```

## 🎨 Stack technique

| Technologie | Usage |
|-------------|-------|
| Next.js 14 | Framework React (App Router) |
| Tailwind CSS v3 | Styling utilitaire |
| Zustand | State management (panier, favoris) |
| Lucide React | Icônes |
| Vercel | Déploiement |

## 🛠️ Codes promo disponibles

Pour tester le panier, utilisez ces codes :
- `JUMIA20` → -20%
- `DAKAR10` → -10%
- `BIENVENUE` → -15%
- `AFRICA25` → -25%

## 📄 Licence

MIT — Libre d'utilisation pour tout projet personnel ou commercial.
