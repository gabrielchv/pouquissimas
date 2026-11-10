import type { CollectionId, Product } from "@/lib/types";

const APPAREL_SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["ONE SIZE"];

/**
 * The catalogue is plain data on purpose: no database, no CMS, no network.
 * Every `image` points at a generated placeholder cut-out in
 * public/media/products. Replace the file, keep the path, and the storefront
 * keeps working.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p-deck-full-dip",
    slug: "full-dip-deck",
    name: "FULL DIP DECK",
    collection: "decks",
    price: 7500,
    image: "/media/products/deck-01.png",
    hoverImage: "/media/products/deck-03.png",
    colorway: "BLACK / ACID",
    sizes: ["8.0", "8.25", "8.5"],
    description:
      "Seven-ply Canadian maple with a full dip finish. Medium concave, steep tail, pressed for street skating.",
    isNew: true,
  },
  {
    id: "p-deck-mosaic",
    slug: "mosaic-deck",
    name: "MOSAIC DECK",
    collection: "decks",
    price: 7500,
    image: "/media/products/deck-02.png",
    hoverImage: "/media/products/deck-01.png",
    colorway: "BONE / OLIVE",
    sizes: ["8.0", "8.25", "8.5"],
    description:
      "Seven-ply Canadian maple, mosaic graphic, medium concave. A shape that breaks in fast and stays stiff.",
  },
  {
    id: "p-deck-night-shift",
    slug: "night-shift-deck",
    name: "NIGHT SHIFT DECK",
    collection: "decks",
    price: 7800,
    image: "/media/products/deck-03.png",
    hoverImage: "/media/products/deck-02.png",
    colorway: "PLUM / BONE",
    sizes: ["8.0", "8.25", "8.5"],
    description:
      "Deeper concave and a squared nose for ledge tricks. Full dip plum stain with a bone-coloured print.",
  },
  {
    id: "p-deck-team-19",
    slug: "team-deck-19",
    name: "TEAM DECK 19",
    collection: "decks",
    price: 7200,
    image: "/media/products/deck-01.png",
    colorway: "BLACK / ACID",
    sizes: ["8.0", "8.25"],
    description:
      "Team issue shape from the archive run. Same maple, same press, limited numbers.",
    soldOut: true,
  },
  {
    id: "p-tee-crosshair-black",
    slug: "crosshair-tee-black",
    name: "CROSSHAIR TEE BLACK",
    collection: "tees",
    price: 3600,
    image: "/media/products/tee-01.png",
    hoverImage: "/media/products/tee-03.png",
    colorway: "BLACK",
    sizes: APPAREL_SIZES,
    description:
      "6.5 oz heavyweight cotton, garment dyed, boxy body. Crosshair print at the chest, woven label at the hem.",
    isNew: true,
  },
  {
    id: "p-tee-target-bone",
    slug: "target-tee-bone",
    name: "TARGET TEE BONE",
    collection: "tees",
    price: 3600,
    image: "/media/products/tee-02.png",
    hoverImage: "/media/products/tee-04.png",
    colorway: "BONE",
    sizes: APPAREL_SIZES,
    description:
      "Heavyweight cotton tee in a natural bone dye. Ring-spun, pre-shrunk, printed with water-based ink.",
  },
  {
    id: "p-tee-placeholder-black",
    slug: "placeholder-tee-black",
    name: "PLACEHOLDER TEE BLACK",
    collection: "tees",
    price: 3800,
    image: "/media/products/tee-03.png",
    hoverImage: "/media/products/tee-01.png",
    colorway: "BLACK / PERIWINKLE",
    sizes: APPAREL_SIZES,
    description:
      "The house tee. Boxy fit, dropped shoulder, screen printed front and back.",
    isNew: true,
  },
  {
    id: "p-tee-stripe-bone",
    slug: "stripe-tee-bone",
    name: "STRIPE TEE BONE",
    collection: "tees",
    price: 3400,
    compareAtPrice: 4600,
    image: "/media/products/tee-04.png",
    hoverImage: "/media/products/tee-02.png",
    colorway: "BONE / BLACK",
    sizes: APPAREL_SIZES,
    description:
      "Diagonal stripe print on a lighter summer weight. Slightly longer body than the house tee.",
  },
  {
    id: "p-ls-acid",
    slug: "long-sleeve-acid",
    name: "LONG SLEEVE ACID",
    collection: "tops",
    price: 4800,
    image: "/media/products/longsleeve-01.png",
    hoverImage: "/media/products/longsleeve-02.png",
    colorway: "BLACK / ACID",
    sizes: APPAREL_SIZES,
    description:
      "Ribbed cuffs, heavyweight cotton, print down the sleeve. Layer it or wear it alone.",
    isNew: true,
  },
  {
    id: "p-ls-olive",
    slug: "long-sleeve-olive",
    name: "LONG SLEEVE OLIVE",
    collection: "tops",
    price: 4800,
    image: "/media/products/longsleeve-02.png",
    colorway: "OLIVE / BONE",
    sizes: APPAREL_SIZES,
    description:
      "Garment-dyed olive long sleeve with a bone print. Soft hand, boxy cut.",
    soldOut: true,
  },
  {
    id: "p-hoodie-rings",
    slug: "rings-hoodie",
    name: "RINGS HOODIE",
    collection: "tops",
    price: 9800,
    image: "/media/products/hoodie-01.png",
    hoverImage: "/media/products/hoodie-02.png",
    colorway: "BLACK / PERIWINKLE",
    sizes: APPAREL_SIZES,
    description:
      "14 oz brushed-back fleece, double-lined hood, kangaroo pocket. Rings print at the chest.",
    isNew: true,
  },
  {
    id: "p-hoodie-word",
    slug: "word-hoodie-bone",
    name: "WORD HOODIE BONE",
    collection: "tops",
    price: 9600,
    compareAtPrice: 12000,
    image: "/media/products/hoodie-02.png",
    hoverImage: "/media/products/hoodie-01.png",
    colorway: "BONE / BLACK",
    sizes: APPAREL_SIZES,
    description:
      "Heavy fleece in a bone colourway with a black chest print. Pre-shrunk, so it keeps its shape.",
  },
  {
    id: "p-cap-crosshair",
    slug: "crosshair-cap",
    name: "CROSSHAIR CAP",
    collection: "headwear",
    price: 4200,
    image: "/media/products/cap-01.png",
    hoverImage: "/media/products/cap-02.png",
    colorway: "BLACK / ACID",
    sizes: ONE_SIZE,
    description:
      "Six-panel cotton twill, embroidered crosshair, adjustable strap at the back.",
    isNew: true,
  },
  {
    id: "p-cap-field",
    slug: "field-cap-olive",
    name: "FIELD CAP OLIVE",
    collection: "headwear",
    price: 4200,
    image: "/media/products/cap-02.png",
    hoverImage: "/media/products/cap-01.png",
    colorway: "OLIVE / BONE",
    sizes: ONE_SIZE,
    description:
      "Unstructured five-panel in washed olive canvas. Sits low, soft brim.",
  },
  {
    id: "p-beanie-stripe",
    slug: "stripe-beanie-plum",
    name: "STRIPE BEANIE PLUM",
    collection: "headwear",
    price: 3200,
    image: "/media/products/beanie-01.png",
    hoverImage: "/media/products/beanie-02.png",
    colorway: "PLUM / BONE",
    sizes: ONE_SIZE,
    description:
      "Rib-knit acrylic beanie with a folded cuff and a plum stripe.",
  },
  {
    id: "p-beanie-checker",
    slug: "checker-beanie",
    name: "CHECKER BEANIE",
    collection: "headwear",
    price: 3200,
    compareAtPrice: 4000,
    image: "/media/products/beanie-02.png",
    hoverImage: "/media/products/beanie-01.png",
    colorway: "BLACK / ACID",
    sizes: ONE_SIZE,
    description:
      "Woven checker cuff, rib-knit crown. One size, fits most.",
  },
  {
    id: "p-hardware-set",
    slug: "hardware-set",
    name: "HARDWARE SET",
    collection: "accessories",
    price: 1200,
    image: "/media/products/hardware-01.png",
    colorway: "BONE",
    sizes: ONE_SIZE,
    description:
      "Eight bolts and eight nuts in a bone finish. Fits standard 7/8\" truck bases.",
    isNew: true,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByCollection(collection: CollectionId | "all"): Product[] {
  if (collection === "all") return PRODUCTS;
  return PRODUCTS.filter((product) => product.collection === collection);
}

export function getSaleProducts(): Product[] {
  return PRODUCTS.filter((product) => typeof product.compareAtPrice === "number");
}

export function getNewArrivals(limit?: number): Product[] {
  const arrivals = PRODUCTS.filter((product) => product.isNew);
  return typeof limit === "number" ? arrivals.slice(0, limit) : arrivals;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCollection = PRODUCTS.filter(
    (candidate) =>
      candidate.collection === product.collection && candidate.id !== product.id,
  );
  const fillers = PRODUCTS.filter(
    (candidate) =>
      candidate.collection !== product.collection && candidate.id !== product.id,
  );
  return [...sameCollection, ...fillers].slice(0, limit);
}
