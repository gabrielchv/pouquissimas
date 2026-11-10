# POUQUÍSSIMAS — loja virtual

Loja de skate feita com Next.js (App Router), React e TypeScript, em português
do Brasil e com preços em reais. O layout segue a referência que o projeto
partiu: vídeo de fundo fixo, barra de aviso, cabeçalho com a faixa da marca e
navegação inline, produtos recortados sobre a grade de quatro colunas, sacola
lateral e rodapé enxuto.

Toda a arte da marca vem das artes originais da POUQUÍSSIMAS (o logo com o nome
e o carro, e os guarás), processada pelos scripts em `scripts/`. As fotos de
produto são provisórias e devem ser trocadas pelas do ensaio oficial.

## O que funciona

- **Navegação**: as quatro abas pedidas — LOJA, VÍDEO, PROMOÇÕES e PRÉVIA.
  LOJA abre um menu com as coleções; nada mais no nível de cima.
- **Catálogo**: 7 produtos — um shape e seis camisetas — com filtro por coleção,
  preço promocional e página de prévia.
- **Página de produto**: galeria com foto alternativa, escolha de tamanho,
  quantidade, adicionar à sacola e produtos relacionados.
- **Sacola**: adicionar pela página ou compra rápida no card, painel lateral,
  alteração de quantidade, remoção, subtotal, regra de frete grátis, página
  dedicada e persistência no `localStorage` entre recarregamentos.
- **Conta**: login com a conta de demonstração, página de conta protegida, sair.
- **Vídeo**: página de fitas com player adiado, que só carrega o clipe quando a
  pessoa aperta o play.
- **Responsivo**: grade de duas colunas no celular, quatro a partir de 990px,
  menu lateral no mobile e nenhum estouro horizontal a 390px.

## Conta de demonstração

```
e-mail: demo@example.com
senha:  skate123
```

O formulário tem o botão **Preencher dados de demonstração**, então não precisa
digitar. A autenticação é só no navegador — veja [Conta](#conta) abaixo.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros scripts:

```bash
npm run build           # build de produção
npm run start           # serve o build
npm run lint            # eslint
npm run typecheck       # tsc --noEmit
npm run placeholders    # regenera as imagens provisórias (Python + Pillow)
npm run brand-assets    # regera logo, variação só do nome e guará
```

## Estrutura

```
src/
  app/                     rotas (App Router)
    layout.tsx             casca: provider da sacola, fundo, cabeçalho, rodapé
    page.tsx               home: lançamentos, shapes, faixa de vídeo, promoções
    loja/page.tsx          catálogo + filtro (?colecao=shapes|camisetas)
    promocoes/page.tsx     produtos com desconto
    previa/page.tsx        grade de lookbook
    video/page.tsx         fitas com player adiado
    produtos/[slug]/       página do produto (gerada por produto)
    sacola/page.tsx        sacola + resumo do pedido
    entrar/page.tsx        formulário de login
    conta/page.tsx         conta protegida
    info/[slug]/           contato, envio, termos, privacidade
  components/
    layout/                barra de aviso, cabeçalho, menu mobile, rodapé, fundo
    product/               card, grade, galeria, painel de compra, título de seção
    ui/                    logo, ícones, preço, quantidade, classes de botão
    video/                 player adiado
  config/
    navigation.ts          as quatro abas + coleções
    site.ts                nome, aviso, textos e constantes da loja
  features/
    cart/                  store da sacola, provider, painel, página, linha
    auth/                  store de sessão, hook, formulário, conta
  lib/
    catalog.ts             os produtos (fonte única de verdade)
    format.ts              formatação de dinheiro (pt-BR / BRL)
    types.ts               tipos de domínio
```

Regra geral: **rotas em `app/`, peças reutilizáveis em `components/`, domínios
com estado em `features/`, dados e utilidades em `lib/`, textos e navegação em
`config/`.**

## Onde trocar o que

### Fotos de produto

Cada foto é um PNG recortado em `public/media/products/`, para flutuar sobre o
vídeo de fundo como na referência. Troque o arquivo mantendo o nome:

```
public/media/products/deck-01.png     → foto do shape (PNG com transparência)
public/media/products/tee-01.png      → foto da camiseta
```

Para adicionar um produto, inclua uma entrada em `PRODUCTS` no
`src/lib/catalog.ts`. Os caminhos de imagem são strings simples, então você pode
apontar para qualquer arquivo dentro de `public/`.

### Vídeo

```
public/media/video/bg-loop.mp4    loop de fundo fixo (com poster bg-loop.jpg)
public/media/video/clip-01.mp4    clipes da página de vídeo (+ .jpg do poster)
public/media/video/clip-02.mp4
public/media/video/clip-03.mp4
```

Regenere os clipes provisórios com
`./scripts/generate_video_placeholders.sh` (precisa de `ffmpeg`), ou coloque os
seus com os mesmos nomes. Mantenha o loop de fundo curto e sem som: ele toca
sozinho atrás de todas as páginas.

### Marca

- Nome, tagline, aviso do topo, e-mail, Instagram: `src/config/site.ts`.
- Cores, tipografia, espaçamentos e raios: bloco `:root` em
  `src/app/globals.css` (`--color-yellow`, `--color-sky`, `--color-red`).
### Logo

O logo é o lockup oficial da marca — o nome sobre o carro, branco sobre
transparente — a partir de `pouquissimas/shape/shape_back_image_white.png`.
`npm run brand-assets` gera dois recortes do mesmo arquivo:

```
public/media/brand/logo.png           lockup completo (nome + carro)
public/media/brand/logo-wordmark.png  só a linha do nome
public/media/brand/guara.png          um guará, usado no favicon
```

O cabeçalho usa o lockup inteiro a partir de 750px e só o nome no celular, onde
o lockup ficaria ilegível. Como a arte é branca, ela pressupõe fundo escuro: se
um dia a loja ganhar tema claro, gere também uma versão escura da arte.

O logo dá uma volta completa (360°) no hover e no foco por teclado — ver
`.logo:hover .spin` em `src/components/ui/logo.module.css`. O giro é no hover de
propósito: rotação contínua deixaria o nome de cabeça para baixo metade do
tempo. Quem prefere movimento reduzido recebe o logo parado
(`prefers-reduced-motion`). Para girar sem parar, troque a regra por
`animation: logo-spin 12s linear infinite`.

O caminho da arte original pode ser passado por `POUQUISSIMAS_ART=/caminho`.
O favicon (`src/app/icon.png`) continua sendo o guará, porque o carro não é
legível em 32px.

Mudar esses tokens rebranda a loja inteira; nenhum componente fixa cor de marca.

### Catálogo e textos

Produtos, preços, cores, tamanhos e descrições ficam em `src/lib/catalog.ts`.
Os preços são inteiros em centavos (`34900` = R$ 349,00), o que mantém a conta
exata. Os tamanhos de vestuário são P, M, G e GG; shapes usam 8.0, 8.25 e 8.5.

A loja vende só dois tipos de produto: **shapes** e **camisetas**, e o catálogo
tem **um único shape** (SHAPE FULL DIP, em três tamanhos). Manga longa conta
como camiseta; moletom, boné, touca e acessórios ficaram fora do catálogo e das
coleções. Como shapes é uma coleção de um item, ela aparece como vitrine
(`FeaturedProduct`) em vez de card solto na grade — na home e em
`/loja?colecao=shapes`. Para voltar a vender outra categoria, acrescente o id em
`CollectionId` (`src/lib/types.ts`), em `COLLECTIONS`
(`src/config/navigation.ts`) e os produtos em `src/lib/catalog.ts`.

## Sacola

A sacola é um store externo pequeno (`src/features/cart/cart-store.ts`), lido com
`useSyncExternalStore`. A máquina de estados é um reducer puro, testável sem
React, e o store resolve as duas partes chatas:

- o snapshot do servidor é sempre vazio, então o HTML do servidor e o do cliente
  batem;
- a sacola salva é lida uma vez, no primeiro assinante, e regravada a cada
  mudança.

O `CartProvider` só acrescenta a visibilidade do painel e os valores derivados
(total por linha, contagem, subtotal). O storage é versionado
(`pouquissimas.cart.v1`) e validado na leitura, então um payload corrompido não
quebra a página.

## Conta

A autenticação é **demonstrativa e só no navegador**.
`src/features/auth/auth-store.ts` valida a conta fixa de demonstração e guarda a
sessão no `localStorage`; não existe sessão no servidor, então isso não é
segurança de verdade e não deve ser usado como está para nada privado.

A página de conta é protegida no cliente (redireciona para
`/entrar?next=/conta`) e o parâmetro `next` só aceita caminhos do próprio site,
para não virar redirect aberto. Para ir ao ar, troque `signIn`/`signOut` por um
provedor real e proteja a rota também no servidor.

## O que ficou de fora de propósito

- Pagamento e checkout — o botão avisa que o template termina na sacola.
- Banco de dados, estoque, cálculo de frete e de impostos.
- Busca, lista de desejos, cupom, newsletter e analytics.
- Texto jurídico real — `src/app/info/[slug]` traz conteúdo claramente provisório.

## Acessibilidade

- Link para pular ao conteúdo, foco visível, botões de ícone rotulados e
  `aria-current` na aba ativa.
- O painel da sacola e o menu mobile fecham com Esc, travam o scroll do fundo e
  o painel mantém o foco do Tab dentro dele.
- Com `prefers-reduced-motion`, o vídeo de fundo dá lugar ao poster.

## Deploy no Cloud Run

O site está publicado em:

```
https://pouquissimas-662877194200.southamerica-east1.run.app
```

Projeto `machine-learning-study-481717`, região `southamerica-east1` (São Paulo),
serviço `pouquissimas`. Configuração: 512 MiB, 1 vCPU, mínimo 0 e máximo 3
instâncias — ou seja, escala para zero e não cobra nada quando ninguém acessa.

### Como o container é montado

`Dockerfile` em três estágios (dependências, build, runtime) sobre
`node:22-alpine`. O `next.config.ts` usa `output: "standalone"`, então a imagem
final carrega só o `server.js` e as dependências realmente usadas em runtime, e
roda como usuário sem privilégio. O `.dockerignore` mantém `node_modules`,
`.next` e os scripts de desenvolvimento fora do contexto de build.

Teste local da imagem:

```bash
docker build -t pouquissimas:local .
docker run --rm -p 8081:8080 -e PORT=8080 pouquissimas:local
# http://localhost:8081
```

### Publicar uma nova versão

```bash
gcloud run deploy pouquissimas \
  --source . \
  --region southamerica-east1 \
  --project machine-learning-study-481717 \
  --allow-unauthenticated \
  --port 8080
```

O `--source .` usa o `Dockerfile`, envia o contexto para o Cloud Build e publica
a imagem no Artifact Registry (`cloud-run-source-deploy`).

### Remover

```bash
gcloud run services delete pouquissimas \
  --region southamerica-east1 \
  --project machine-learning-study-481717
```

## Verificação

Checado no build de produção em 1440×950 e 390×844:

- `npm run lint`, `npm run typecheck` e `npm run build` passam.
- `html lang="pt-BR"`, preços em BRL e nenhum preço em dólar.
- Quatro abas, em português, e rotas antigas em inglês retornando 404.
- Adicionar à sacola → painel → recarregar (sacola persiste) → alterar
  quantidade → esvaziar.
- Catálogo com 7 produtos: um shape e seis camisetas (manga longa entra como
  camiseta), sem boné, moletom ou acessório.
- Senha errada mostra erro; login de demonstração chega em `/conta`; sair volta
  para a home; `/conta` deslogada redireciona para `/entrar?next=/conta`.
- Slug inexistente devolve 404; filtro por coleção devolve os produtos certos.
- Nenhum erro de console e nenhum estouro horizontal em nenhuma página a 390px.

Também verificado na imagem Docker (porta 8080, usuário sem privilégio) e no
serviço publicado no Cloud Run: todas as rotas em 200, vídeo de fundo tocando,
giro do logo ativo, 404 correto e nenhum 4xx/5xx em assets.
