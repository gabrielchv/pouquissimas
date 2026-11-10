# Imagem de produção para o Cloud Run.
#
# Build em três estágios para a imagem final ficar pequena: dependências,
# build e runtime. O Next gera um servidor standalone, então o runtime não
# carrega node_modules inteiro.

FROM node:22-alpine AS deps
WORKDIR /app

# Só os manifests entram aqui: o cache de camadas só invalida quando as
# dependências mudam, não a cada alteração de código.
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Interruptor de indexação, resolvido no build (robots.txt e sitemap.xml são
# pré-renderizados). Deploy com:
#   --set-build-env-vars=SITE_INDEXABLE=false
# para publicar sem aparecer no Google.
ARG SITE_INDEXABLE
ENV SITE_INDEXABLE=${SITE_INDEXABLE}

RUN npm run build

# ---------------------------------------------------------------------------

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# O Cloud Run injeta PORT; este é apenas o padrão local.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# A saída standalone já traz o server.js e as dependências usadas em runtime.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
