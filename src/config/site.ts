/** Textos e ajustes globais da loja. */

export const SITE = {
  name: "POUQUÍSSIMAS",
  tagline: "Skate feito no Brasil.",
  announcement: "FRETE GRÁTIS ACIMA DE R$ 299",
  description:
    "Shapes e camisetas de uma marca brasileira de skate. Feito para andar de verdade.",
  email: "contato@example.com",
  instagram: "https://instagram.com",
  currency: "BRL",
  locale: "pt-BR",
} as const;

/** Valor mínimo do pedido para frete grátis, em centavos. */
export const FREE_SHIPPING_THRESHOLD = 29900;

export const SHIPPING_NOTE =
  "Frete grátis acima de R$ 299. Enviamos em até 3 dias úteis.";

export const FOOTER_LINKS = [
  { label: "CONTATO", href: "/info/contato" },
  { label: "ENVIO E TROCAS", href: "/info/envio" },
  { label: "TERMOS", href: "/info/termos" },
  { label: "PRIVACIDADE", href: "/info/privacidade" },
] as const;
