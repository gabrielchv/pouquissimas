import type { MetadataRoute } from "next";

import { COLLECTIONS } from "@/config/navigation";
import { SITE_URL } from "@/config/site";
import { IS_INDEXABLE } from "@/config/indexing";
import { getAllProducts } from "@/lib/catalog";

/**
 * sitemap.xml
 *
 * Lista só o que deve ser indexado. Sacola, conta e login ficam de fora — e
 * também estão no `disallow` do robots.txt, para as duas fontes concordarem.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Sem indexação não há o que anunciar.
  if (!IS_INDEXABLE) return [];

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/loja`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/promocoes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/previa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/video`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Cada coleção tem URL própria e filtrável; vale listar.
  const collectionPages: MetadataRoute.Sitemap = COLLECTIONS.map((collection) => ({
    url: `${SITE_URL}/loja?colecao=${collection.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${SITE_URL}/produtos/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const infoPages: MetadataRoute.Sitemap = ["contato", "envio", "termos", "privacidade"].map(
    (slug) => ({
      url: `${SITE_URL}/info/${slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
  );

  return [...staticPages, ...collectionPages, ...productPages, ...infoPages];
}
