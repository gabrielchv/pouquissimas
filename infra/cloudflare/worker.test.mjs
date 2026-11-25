/**
 * Testa a lógica do Worker sem depender da Cloudflare.
 *
 * O `wrangler dev` local não simula o header Host, então o redirect de www e a
 * escolha de origem não dá para verificar por ele. Aqui a `fetch` global é
 * trocada por um stub e as decisões do Worker são verificadas direto.
 *
 * Rodar:  node infra/cloudflare/worker.test.mjs
 */

import worker from "./worker.js";

const ORIGIN = "pouquissimas-662877194200.southamerica-east1.run.app";

const calls = [];
globalThis.fetch = async (input) => {
  calls.push({ url: typeof input === "string" ? input : input.url });
  return new Response("<html>ok</html>", {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // O Next marca páginas com um ano de s-maxage; o Worker deve corrigir.
      "cache-control": "s-maxage=31536000",
      server: "Google Frontend",
    },
  });
};

function request(url, method = "GET") {
  return new Request(url, {
    method,
    headers: { "cf-connecting-ip": "1.2.3.4" },
  });
}

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

// 1) www -> apex, sem tocar na origem
let response = await worker.fetch(request("https://www.pouquissimas.com/loja?colecao=shapes"));
check("www responde 301", response.status === 301, String(response.status));
check(
  "redirect preserva caminho e query",
  response.headers.get("location") === "https://pouquissimas.com/loja?colecao=shapes",
  response.headers.get("location"),
);
check("www não chama a origem", calls.length === 0);

// 2) apex -> origem, caminho e query intactos
response = await worker.fetch(request("https://pouquissimas.com/produtos/shape-full-dip?x=1"));
check("apex chama a origem", calls.length === 1);
check("host de origem correto", calls[0].url.startsWith(`https://${ORIGIN}/`), calls[0].url);
check("caminho preservado", calls[0].url.endsWith("/produtos/shape-full-dip?x=1"), calls[0].url);

// 3) política de cache do HTML
const htmlCache = response.headers.get("cache-control") ?? "";
check("HTML não fica cacheado por um ano", !htmlCache.includes("31536000"), htmlCache);
check("HTML usa s-maxage=60", htmlCache.includes("s-maxage=60"), htmlCache);

// 4) HTML não cacheia e não vaza header da origem
response = await worker.fetch(request("https://pouquissimas.com/sacola"));
check("sacola é no-store", response.headers.get("cache-control") === "no-store", response.headers.get("cache-control"));
check("header server removido", response.headers.get("server") === null);

// 5) status decide a política, não só o content-type.
// A Cloudflare guarda 404 por padrão, então um HTML de erro com s-maxage=60
// ficava preso na borda — inclusive um 502 transitório de deploy.
async function withStatus(status, body = "<html>erro</html>") {
  globalThis.fetch = async (input) => {
    calls.push({ url: typeof input === "string" ? input : input.url });
    return new Response(body, {
      status,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "s-maxage=31536000" },
    });
  };
  return worker.fetch(request(`https://pouquissimas.com/pagina-${status}`));
}

for (const status of [500, 502, 503, 404]) {
  const res = await withStatus(status);
  const cc = res.headers.get("cache-control") ?? "";
  check(
    `HTML ${status} não é cacheado`,
    cc === "no-store",
    cc,
  );
}

// 6) um asset com 404 não pode virar imutável
globalThis.fetch = async (input) => {
  calls.push({ url: typeof input === "string" ? input : input.url });
  return new Response("missing", {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};
response = await worker.fetch(request("https://pouquissimas.com/_next/static/chunks/nao-existe.js"));
check(
  "asset 404 é no-store, não immutable",
  response.headers.get("cache-control") === "no-store",
  response.headers.get("cache-control"),
);

// 7) asset 200 continua imutável
globalThis.fetch = async (input) => {
  calls.push({ url: typeof input === "string" ? input : input.url });
  return new Response("js", {
    status: 200,
    headers: { "content-type": "application/javascript" },
  });
};
response = await worker.fetch(request("https://pouquissimas.com/_next/static/chunks/app.js"));
check(
  "asset 200 é immutable",
  (response.headers.get("cache-control") ?? "").includes("immutable"),
  response.headers.get("cache-control"),
);

let failures = 0;
for (const result of results) {
  if (!result.ok) failures++;
  console.log(
    `${result.ok ? "PASS" : "FAIL"}  ${result.name}${result.detail ? ` -> ${result.detail}` : ""}`,
  );
}
console.log(`\n${results.length - failures}/${results.length} passed`);
process.exit(failures === 0 ? 0 : 1);
