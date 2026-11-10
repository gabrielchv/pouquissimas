import type { Collection, CollectionId } from "@/lib/types";

/**
 * As quatro abas permitidas: LOJA, VÍDEO, PROMOÇÕES e PRÉVIA.
 * LOJA abre um menu com as coleções; as demais são links diretos.
 */
export const PRIMARY_NAV = [
  { label: "LOJA", href: "/loja", hasMenu: true },
  { label: "VÍDEO", href: "/video", hasMenu: false },
  { label: "PROMOÇÕES", href: "/promocoes", hasMenu: false },
  { label: "PRÉVIA", href: "/previa", hasMenu: false },
] as const;

export const COLLECTIONS: Collection[] = [
  {
    id: "shapes",
    label: "SHAPES",
    blurb: "Prensados para a rua, a pista e tudo no meio.",
  },
  {
    id: "camisetas",
    label: "CAMISETAS",
    blurb: "Algodão pesado, estampado em tiragens pequenas.",
  },
  {
    id: "moletons",
    label: "MOLETONS",
    blurb: "Manga longa e moletom para os dias de frio.",
  },
  {
    id: "bones",
    label: "BONÉS",
    blurb: "Bonés e toucas feitos para andar de skate.",
  },
  {
    id: "acessorios",
    label: "ACESSÓRIOS",
    blurb: "Parafusos e as peças pequenas que mantêm tudo rodando.",
  },
];

export function collectionLabel(id: CollectionId): string {
  return COLLECTIONS.find((collection) => collection.id === id)?.label ?? id;
}
