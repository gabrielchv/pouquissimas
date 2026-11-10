import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";
import { IS_INDEXABLE } from "@/config/indexing";

/**
 * robots.txt
 *
 * Páginas privadas ficam fora do índice: sacola, conta e login não têm valor
 * de busca e, se indexadas, aparecem como conteúdo raso.
 *
 * Atenção: se a Cloudflare estiver com o "Managed robots.txt" ligado, ela serve
 * o próprio arquivo e este nunca chega ao Google. Nesse caso adicione a linha
 * do Sitemap no painel da Cloudflare (ver README) ou desligue o gerenciado.
 */
export default function robots(): MetadataRoute.Robots {
  // Pré-lançamento: melhor não indexar do que indexar placeholder.
  if (!IS_INDEXABLE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: SITE_URL,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/sacola", "/conta", "/entrar", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
