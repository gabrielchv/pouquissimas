import type { Metadata } from "next";
import { Figtree, Oswald } from "next/font/google";

import "./globals.css";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE, SITE_URL } from "@/config/site";
import { IS_INDEXABLE } from "@/config/indexing";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { CartProvider } from "@/features/cart/cart-context";

const figtree = Figtree({
  // latin-ext inclui os acentos do português (Ã, Ç, Õ, É).
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  // Sem metadataBase, o Next gera URLs relativas para canonical e OG, e o
  // Google descarta o canonical. Esta é a base de todo link absoluto.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — Shapes e camisetas de skate`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
  },
  // Páginas privadas sobrescrevem isto com noindex.
  robots: {
    index: IS_INDEXABLE,
    follow: IS_INDEXABLE,
    googleBot: {
      index: IS_INDEXABLE,
      follow: IS_INDEXABLE,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${SITE.name} — Shapes e camisetas de skate`,
    description: SITE.description,
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE.name,
    images: [
      {
        url: "/media/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — shapes e camisetas de skate`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Shapes e camisetas de skate`,
    description: SITE.description,
    images: ["/media/brand/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${oswald.variable}`}>
      <body>
        <CartProvider>
          <a href="#main" className="skip-link">
            Ir para o conteúdo
          </a>

          <AmbientBackground />

          <div className="page">
            <AnnouncementBar />
            <SiteHeader />
            <main id="main" className="main">
              {children}
            </main>
            <SiteFooter />
          </div>

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
