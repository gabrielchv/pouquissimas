import type { Metadata } from "next";
import { Figtree, Oswald } from "next/font/google";

import "./globals.css";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE } from "@/config/site";
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
  title: {
    default: `${SITE.name} — Skate`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Skate`,
    description: SITE.description,
    type: "website",
    locale: "pt_BR",
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
