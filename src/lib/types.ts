/** Tipos de domínio compartilhados entre a loja, a sacola e o checkout. */

/**
 * A loja trabalha com dois tipos de produto: shapes e camisetas.
 * Manga longa entra como camiseta; moletom, boné e acessório ficaram de fora.
 */
export type CollectionId = "shapes" | "camisetas";

export interface Collection {
  id: CollectionId;
  /** Rótulo em maiúsculas usado na navegação e nos filtros. */
  label: string;
  /** Linha curta exibida na página da loja. */
  blurb: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: CollectionId;
  /** Preço em centavos. Nunca use float para dinheiro. */
  price: number;
  /** Preço original em centavos, quando o item está em promoção. */
  compareAtPrice?: number;
  /** Caminho dentro de /public. Troque o arquivo para usar foto real. */
  image: string;
  /** Foto secundária opcional, revelada no hover. */
  hoverImage?: string;
  colorway: string;
  sizes: string[];
  description: string;
  soldOut?: boolean;
  isNew?: boolean;
}

export interface CartLine {
  /** `${productId}:${size}` — chave estável para o reducer e o storage. */
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
