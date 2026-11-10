/** Domain types shared by the storefront, cart and checkout surfaces. */

export type CollectionId =
  | "decks"
  | "tees"
  | "tops"
  | "headwear"
  | "accessories";

export interface Collection {
  id: CollectionId;
  /** Uppercase label used in navigation and filter chips. */
  label: string;
  /** Short line shown on the shop page. */
  blurb: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: CollectionId;
  /** Price in cents. Never use floats for money. */
  price: number;
  /** Original price in cents, when the item is discounted. */
  compareAtPrice?: number;
  /** Path under /public. Swap these files to use real photography. */
  image: string;
  /** Optional secondary photo revealed on hover. */
  hoverImage?: string;
  colorway: string;
  sizes: string[];
  description: string;
  soldOut?: boolean;
  isNew?: boolean;
}

export interface CartLine {
  /** `${productId}:${size}` — stable key for reducers and storage. */
  key: string;
  productId: string;
  size: string;
  quantity: number;
}

export interface CartLineWithProduct extends CartLine {
  product: Product;
  lineTotal: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
