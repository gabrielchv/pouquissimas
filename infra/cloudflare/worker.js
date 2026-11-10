/**
 * Proxy do Cloudflare Worker para o serviço no Cloud Run.
 *
 * Por que existe: o Cloud Run só aceita mapeamento de domínio em algumas
 * regiões, e southamerica-east1 (São Paulo) não está entre elas. Um Worker na
 * frente resolve isso sem mover o serviço e sem pagar balanceador: o Cloudflare
 * termina o TLS, busca a origem e cacheia os assets estáticos na borda.
 *
 * Deploy:  npx wrangler deploy --config infra/cloudflare/wrangler.jsonc
 */

const ORIGIN = "pouquissimas-662877194200.southamerica-east1.run.app";
const APEX = "pouquissimas.com";

/** Caminhos que nunca devem ser cacheados na borda. */
const NEVER_CACHE = ["/sacola", "/conta", "/entrar", "/api/", "/_next/image"];

const worker = {
  async fetch(request) {
    const url = new URL(request.url);

    // www -> apex, para o site ter um endereço canônico só.
    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }

    // A origem espera o próprio hostname do run.app; caminho e query intactos.
    const originUrl = new URL(request.url);
    originUrl.hostname = ORIGIN;
    originUrl.protocol = "https:";
    originUrl.port = "";

    const headers = new Headers(request.headers);
    // O Next usa X-Forwarded-* para montar URLs absolutas (redirects, OG tags).
    headers.set("X-Forwarded-Host", url.hostname);
    headers.set("X-Forwarded-Proto", "https");

    const upstream = await fetch(originUrl.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    });

    const out = new Response(upstream.body, upstream);

    // O Next marca páginas pré-renderizadas com s-maxage=31536000, o que faria
    // um CDN guardar HTML por um ano. Aqui a política é explícita.
    const contentType = upstream.headers.get("content-type") ?? "";
    const isHtml = contentType.includes("text/html");

    if (originUrl.pathname.startsWith("/_next/static/")) {
      // Assets com hash no nome: nunca mudam.
      out.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (NEVER_CACHE.some((path) => originUrl.pathname.startsWith(path))) {
      out.headers.set("Cache-Control", "no-store");
    } else if (isHtml) {
      // Cache curto na borda: absorve picos e propaga mudanças em ~1 minuto.
      out.headers.set(
        "Cache-Control",
        "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      );
    }

    // Headers internos da origem não precisam chegar ao navegador.
    out.headers.delete("X-Cloud-Trace-Context");
    out.headers.delete("Server");
    out.headers.delete("Alt-Svc");

    return out;
  },
};

export default worker;
