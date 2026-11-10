#!/usr/bin/env bash
#
# Aponta pouquissimas.com para o serviço no Cloud Run.
#
# O que faz, em ordem:
#   1. confere se existe token da Cloudflare e se ele vê a zona
#   2. confere se o serviço no Cloud Run está no ar
#   3. publica o Worker (que cria os registros DNS e o certificado)
#   4. confirma que https://pouquissimas.com responde
#
# Uso:
#   export CLOUDFLARE_API_TOKEN=...      # ou: ~/.cloudflare-token
#   ./scripts/setup-cloudflare.sh
#
set -euo pipefail

DOMAIN="pouquissimas.com"
SERVICE_URL="https://pouquissimas-662877194200.southamerica-east1.run.app"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
fail() { printf '\033[31mERRO:\033[0m %s\n' "$1" >&2; exit 1; }

# --------------------------------------------------------------------------
# 1. Token
# --------------------------------------------------------------------------
info "Verificando credenciais da Cloudflare"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" && -f "$HOME/.cloudflare-token" ]]; then
  CLOUDFLARE_API_TOKEN="$(tr -d '\n' < "$HOME/.cloudflare-token")"
  export CLOUDFLARE_API_TOKEN
fi

if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  # O token precisa enxergar a zona do domínio.
  ZONE_JSON="$(curl -sS \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN")"

  if grep -q '"success":false' <<<"$ZONE_JSON"; then
    # 10000 = credencial inválida; 9109 = token sem permissão para a zona.
    error_code="$(sed -n 's/.*"code":\([0-9]*\).*/\1/p' <<<"$ZONE_JSON" | head -1)"
    case "$error_code" in
      10000|6111) fail "token inválido ou malformado (código $error_code). Gere outro em https://dash.cloudflare.com/profile/api-tokens" ;;
      9109)  fail "token válido, mas sem permissão nesta zona. Adicione Zone:Zone:Read e Zone:DNS:Edit para $DOMAIN." ;;
      *)     fail "a Cloudflare recusou a requisição (código ${error_code:-?})." ;;
    esac
  fi

  ZONE_ID="$(sed -n 's/.*"id":"\([a-f0-9]\{32\}\)".*/\1/p' <<<"$ZONE_JSON" | head -1)"
  if [[ -z "$ZONE_ID" ]]; then
    fail "o token não enxerga a zona $DOMAIN. Confira os escopos Zone:Zone:Read e Zone:DNS:Edit."
  fi
  echo "token válido, zona $DOMAIN = $ZONE_ID"
elif npx --yes wrangler@latest whoami 2>/dev/null | grep -qi "associated with the email"; then
  echo "autenticado via wrangler login (OAuth)"
else
  cat <<EOF
Nenhuma credencial encontrada.

Escolha uma:

  A) Login interativo (mais simples):
       npx wrangler login

  B) Token de API (melhor para automação):
       1. https://dash.cloudflare.com/profile/api-tokens
       2. Create Token -> Edit zone DNS (use o template)
       3. Zone Resources: Include -> Specific zone -> $DOMAIN
       4. Salve fora do git:
            echo 'COLE_O_TOKEN' > ~/.cloudflare-token
            chmod 600 ~/.cloudflare-token

Depois rode este script de novo.
EOF
  exit 1
fi

# --------------------------------------------------------------------------
# 2. Origem no ar
# --------------------------------------------------------------------------
info "Verificando o serviço no Cloud Run"
CODE="$(curl -s -o /dev/null -w '%{http_code}' "$SERVICE_URL/")"
[[ "$CODE" == "200" ]] || fail "a origem respondeu $CODE (esperado 200): $SERVICE_URL"
echo "origem ok: $SERVICE_URL"

# --------------------------------------------------------------------------
# 3. Publicar o Worker
# --------------------------------------------------------------------------
info "Publicando o Worker (cria DNS e certificado do $DOMAIN)"
cd "$ROOT"
npx --yes wrangler@latest deploy --config infra/cloudflare/wrangler.jsonc

# --------------------------------------------------------------------------
# 4. Conferir
# --------------------------------------------------------------------------
info "Aguardando o certificado e conferindo o domínio"
for attempt in $(seq 1 20); do
  CODE="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || true)"
  if [[ "$CODE" == "200" ]]; then
    echo "https://$DOMAIN responde 200"
    break
  fi
  echo "  tentativa $attempt: $CODE (certificado pode levar alguns minutos)"
  sleep 15
done

info "Registros publicados"
if [[ -n "${ZONE_ID:-}" ]]; then
  curl -sS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?per_page=100" \
    | sed 's/},{/}\n{/g' | grep -oE '"type":"[A-Z]+","name":"[^"]+","content":"[^"]+"' || true
fi

echo
echo "Pronto. Site: https://$DOMAIN"
