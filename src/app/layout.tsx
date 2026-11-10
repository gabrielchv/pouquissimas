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
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Skateboarding`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Skateboarding`,
    description: SITE.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${figtree.variable} ${oswald.variable}`}>
      <body>
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to content
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
