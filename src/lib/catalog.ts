import type { CollectionId, Product } from "@/lib/types";

const TAMANHOS = ["P", "M", "G", "GG"];

/**
 * O catálogo é dado puro, de propósito: sem banco, sem CMS, sem rede.
 * Cada `image` aponta para um recorte provisório em public/media/products.
 * Troque o arquivo mantendo o caminho e a loja continua funcionando.
 *
 * Preços em centavos (34900 = R$ 349,00).
 */
export const PRODUCTS: Product[] = [
  {
    id: "p-shape-full-dip",
    slug: "shape-full-dip",
    name: "SHAPE FULL DIP",
    collection: "shapes",
    price: 34900,
    image: "/media/products/deck-01.png",
    hoverImage: "/media/products/deck-03.png",
    colorway: "PRETO / AMARELO",
    sizes: ["8.0", "8.25", "8.5"],
    description:
      "Sete lâminas de bordo canadense com acabamento full dip. Concave médio, tail íngreme, prensado para a rua.",
    isNew: true,
  },
  {
    id: "p-shape-mosaico",
    slug: "shape-mosaico",
    name: "SHAPE MOSAICO",
    collection: "shapes",
    price: 34900,
    image: "/media/products/deck-02.png",
    hoverImage: "/media/products/deck-01.png",
    colorway: "CRU / VERDE-OLIVA",
    sizes: ["8.0", "8.25", "8.5"],
    description:
      "Sete lâminas de bordo canadense, gráfico mosaico, concave médio. Um shape que amacia rápido e continua firme.",
  },
  {
    id: "p-shape-turno-da-noite",
    slug: "shape-turno-da-noite",
    name: "SHAPE TURNO DA NOITE",
    collection: "shapes",
    price: 35900,
    compareAtPrice: 39900,
    image: "/media/products/deck-03.png",
    hoverImage: "/media/products/deck-02.png",
    colorway: "AMORA / CRU",
    sizes: ["8.0", "8.25", "8.5"],
    description:
      "Concave mais fundo e nose quadrado para manobras de borda. Tingimento full dip amora com estampa cru.",
  },
  {
    id: "p-shape-time-19",
    slug: "shape-time-19",
    name: "SHAPE TIME 19",
    collection: "shapes",
    price: 32900,
    image: "/media/products/deck-01.png",
    colorway: "PRETO / AMARELO",
    sizes: ["8.0", "8.25"],
    description:
      "Shape do time, da leva de arquivo. Mesmo bordo, mesma prensa, tiragem limitada.",
    soldOut: true,
  },
  {
    id: "p-camiseta-mira-preta",
    slug: "camiseta-mira-preta",
    name: "CAMISETA MIRA PRETA",
    collection: "camisetas",
    price: 14990,
    image: "/media/products/tee-01.png",
    hoverImage: "/media/products/tee-03.png",
    colorway: "PRETO",
    sizes: TAMANHOS,
    description:
      "Algodão pesado 6,5 oz, tingido na peça, corpo amplo. Estampa mira no peito e etiqueta tecida na barra.",
    isNew: true,
  },
  {
    id: "p-camiseta-alvo-cru",
    slug: "camiseta-alvo-cru",
    name: "CAMISETA ALVO CRU",
    collection: "camisetas",
    price: 14990,
    image: "/media/products/tee-02.png",
    hoverImage: "/media/products/tee-04.png",
    colorway: "CRU",
    sizes: TAMANHOS,
    description:
      "Camiseta de algodão pesado em cru natural. Fio penteado, pré-encolhida, estampada com tinta à base de água.",
  },
  {
    id: "p-camiseta-letreiro-preta",
    slug: "camiseta-letreiro-preta",
    name: "CAMISETA LETREIRO PRETA",
    collection: "camisetas",
    price: 15990,
    image: "/media/products/tee-03.png",
    hoverImage: "/media/products/tee-01.png",
    colorway: "PRETO / AZUL",
    sizes: TAMANHOS,
    description:
      "A camiseta da casa. Caimento amplo, ombro caído, estampa na frente e nas costas.",
    isNew: true,
  },
  {
    id: "p-camiseta-listrada-cru",
    slug: "camiseta-listrada-cru",
    name: "CAMISETA LISTRADA CRU",
    collection: "camisetas",
    price: 12990,
    compareAtPrice: 17990,
    image: "/media/products/tee-04.png",
    hoverImage: "/media/products/tee-02.png",
    colorway: "CRU / PRETO",
    sizes: TAMANHOS,
    description:
      "Estampa de listras diagonais em gramatura mais leve para o verão. Corpo um pouco mais longo que a camiseta da casa.",
  },
  {
    id: "p-manga-longa-amarela",
    slug: "manga-longa-amarela",
    name: "MANGA LONGA AMARELA",
    collection: "camisetas",
    price: 18990,
    image: "/media/products/longsleeve-01.png",
    hoverImage: "/media/products/longsleeve-02.png",
    colorway: "PRETO / AMARELO",
    sizes: TAMANHOS,
    description:
      "Punhos canelados, algodão pesado, estampa na manga. Use sozinha ou em camadas.",
    isNew: true,
  },
  {
    id: "p-manga-longa-oliva",
    slug: "manga-longa-oliva",
    name: "MANGA LONGA OLIVA",
    collection: "camisetas",
    price: 18990,
    image: "/media/products/longsleeve-02.png",
    colorway: "OLIVA / CRU",
    sizes: TAMANHOS,
    description:
      "Manga longa tingida na peça em oliva, com estampa cru. Toque macio, corte amplo.",
    soldOut: true,
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

export function getProductsByCollection(collection: CollectionId | "todas"): Product[] {
  if (collection === "todas") return PRODUCTS;
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
