/**
 * Interruptor de indexação.
 *
 * Por que existe: enquanto o catálogo tem fotos provisórias ("IMAGEM
 * PROVISÓRIA") e preços de exemplo, indexar cria uma primeira impressão ruim no
 * Google e conteúdo que você vai trocar logo. Mas você também pode querer
 * publicar o domínio já para testar links e compartilhamento.
 *
 * Uso:
 *   SITE_INDEXABLE=false   -> noindex em tudo, sitemap vazio, robots bloqueia
 *   (padrão / ausente)     -> indexação normal
 *
 * No Cloud Run:
 *   gcloud run services update pouquissimas --region southamerica-east1 \
 *     --update-env-vars SITE_INDEXABLE=false
 *
 * A variável é lida no servidor, então não precisa de NEXT_PUBLIC_ e não
 * aparece no bundle do cliente.
 */
export const IS_INDEXABLE = process.env.SITE_INDEXABLE !== "false";
