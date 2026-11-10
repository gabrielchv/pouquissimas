import { SITE, SITE_URL } from "@/config/site";
import type { Product } from "@/lib/types";

/**
 * Dados estruturados (schema.org) em JSON-LD.
 *
 * É o que permite o Google mostrar preço, disponibilidade e breadcrumb direto
 * no resultado de busca, em vez de só um link azul. O Google lê `Product` com
 * `offers` e `BreadcrumbList`.
 *
 * O escape de "<" evita que um nome de produto com "</script>" quebre a página.
 */
function serialise(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify já escapou "<", então o conteúdo não fecha a tag.
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  );
}

/** Loja como um todo: usada na home. */
export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        name: SITE.name,
        url: SITE_URL,
        description: SITE.description,
        logo: `${SITE_URL}/media/brand/logo.png`,
        image: `${SITE_URL}/media/brand/og-image.png`,
        currenciesAccepted: "BRL",
        paymentAccepted: "Pix, Cartão de crédito",
        areaServed: "BR",
        sameAs: [SITE.instagram],
      }}
    />
  );
}

interface ProductJsonLdProps {
  product: Product;
  /** URL absoluta da imagem principal. */
  imageUrl: string;
}

/** Um produto: habilita preço e estoque no resultado de busca. */
export function ProductJsonLd({ product, imageUrl }: ProductJsonLdProps) {
  const url = `${SITE_URL}/produtos/${product.slug}`;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        sku: product.id,
        color: product.colorway,
        brand: { "@type": "Brand", name: SITE.name },
        image: [imageUrl],
        url,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "BRL",
          // O schema exige o preço como string decimal, não em centavos.
          price: (product.price / 100).toFixed(2),
          availability: product.soldOut
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: SITE.name },
        },
        ...(product.sizes.length > 1
          ? { size: product.sizes.join(", ") }
          : {}),
      }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; href?: string }[];
}

/** Trilha de navegação; o Google mostra "loja > produto" no lugar da URL. */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
        })),
      }}
    />
  );
}
