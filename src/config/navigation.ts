import type { Collection, CollectionId } from "@/lib/types";

/**
 * The only tabs the brief allows: SHOP, VIDEO, SALE, PREVIEW.
 * SHOP opens a small collection menu; everything else is a single link.
 */
export const PRIMARY_NAV = [
  { label: "SHOP", href: "/shop", hasMenu: true },
  { label: "VIDEO", href: "/video", hasMenu: false },
  { label: "SALE", href: "/sale", hasMenu: false },
  { label: "PREVIEW", href: "/preview", hasMenu: false },
] as const;

export const COLLECTIONS: Collection[] = [
  {
    id: "decks",
    label: "DECKS",
    blurb: "Pressed for the street, the park, and everything between.",
  },
  {
    id: "tees",
    label: "T-SHIRTS",
    blurb: "Heavyweight cotton, screen printed in small runs.",
  },
  {
    id: "tops",
    label: "TOPS",
    blurb: "Long sleeves and hoods for the cold months.",
  },
  {
    id: "headwear",
    label: "HEADWEAR",
    blurb: "Caps and beanies built to be skated in.",
  },
  {
    id: "accessories",
    label: "ACCESSORIES",
    blurb: "Hardware and the small things that keep you rolling.",
  },
];

export function collectionLabel(id: CollectionId): string {
  return COLLECTIONS.find((collection) => collection.id === id)?.label ?? id;
}
