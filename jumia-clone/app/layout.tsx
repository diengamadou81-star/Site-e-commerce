import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: "Jumia Clone - N°1 du commerce en ligne en Afrique",
    template: "%s | Jumia Clone",
  },
  description:
    "Achetez en ligne en Afrique : électronique, mode, maison, beauté et bien plus. Livraison rapide partout.",
  keywords: ["e-commerce", "afrique", "achats en ligne", "livraison"],
  openGraph: {
    title: "Jumia Clone - Shopping en ligne",
    description: "Le meilleur du shopping en ligne en Afrique",
    images: [{ url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=630&fit=crop" }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <ToastProvider>
          <Header />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
