/** Store-wide copy and settings kept out of components. */

export const SITE = {
  name: "SKATE SHOP",
  tagline: "Skateboarding since day one.",
  announcement: "FREE DOMESTIC SHIPPING OVER $150",
  description:
    "Decks, tees and hardware from an independent skateboarding brand. Built to be skated.",
  email: "orders@example.com",
  instagram: "https://instagram.com",
  currency: "USD",
} as const;

export const SHIPPING_NOTE =
  "Free domestic shipping over $150. Orders ship within 2–3 business days.";

export const FOOTER_LINKS = [
  { label: "CONTACT", href: "/info/contact" },
  { label: "SHIPPING + RETURNS", href: "/info/shipping" },
  { label: "TERMS", href: "/info/terms" },
  { label: "PRIVACY", href: "/info/privacy" },
] as const;
