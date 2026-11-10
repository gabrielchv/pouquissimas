import type { Metadata } from "next";
import { notFound } from "next/navigation";

import styles from "./info.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE } from "@/config/site";

interface InfoPageProps {
  params: Promise<{ slug: string }>;
}

interface InfoContent {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

/** Texto provisório de políticas. Troque pelo seu antes de publicar. */
const PAGES: Record<string, InfoContent> = {
  contato: {
    eyebrow: "Ajuda",
    title: "Contato",
    intro: "Dúvida sobre um pedido, tamanho ou revenda? Comece por aqui.",
    sections: [
      {
        heading: "Pedidos e tamanhos",
        body: [
          `Escreva para ${SITE.email} com o número do pedido e respondemos em até dois dias úteis.`,
          "Para tamanhos, cada página de produto mostra as medidas que usamos nas nossas próprias peças.",
        ],
      },
      {
        heading: "Revenda",
        body: [
          "Lojas interessadas em trabalhar com a marca podem escrever para o mesmo e-mail com uma breve apresentação e o link da loja.",
        ],
      },
    ],
  },
  envio: {
    eyebrow: "Políticas",
    title: "Envio e trocas",
    intro: "O que esperar depois de finalizar a compra.",
    sections: [
      {
        heading: "Envio",
        body: [
          "Pedidos no Brasil são postados em até 3 dias úteis. O frete é grátis acima de R$ 299.",
          "Enviamos para todo o país com rastreio. O prazo de entrega depende da região e é informado no checkout.",
        ],
      },
      {
        heading: "Trocas e devoluções",
        body: [
          "Peças sem uso podem ser trocadas em até 30 dias após o recebimento. Peças em promoção não têm troca.",
          "Escreva para nós antes de enviar qualquer peça de volta, para passarmos o endereço correto.",
        ],
      },
    ],
  },
  termos: {
    eyebrow: "Legal",
    title: "Termos de uso",
    intro: "A versão curta do acordo entre você e a loja.",
    sections: [
      {
        heading: "Pedidos",
        body: [
          "Um pedido é uma oferta de compra. Confirmamos essa oferta quando o pedido é enviado, e podemos cancelar caso uma peça esgote ou um preço seja cadastrado errado.",
        ],
      },
      {
        heading: "Uso do site",
        body: [
          "As fotos, ilustrações e textos deste site pertencem à marca e não podem ser reutilizados comercialmente sem autorização.",
        ],
      },
    ],
  },
  privacidade: {
    eyebrow: "Legal",
    title: "Política de privacidade",
    intro: "O que coletamos e por quê.",
    sections: [
      {
        heading: "O que coletamos",
        body: [
          "Os dados necessários para entregar sua compra: nome, endereço, e-mail e itens pedidos.",
          "Dados de pagamento são tratados pelo meio de pagamento. Nunca guardamos o número do cartão.",
        ],
      },
      {
        heading: "Seus direitos",
        body: [
          `Você pode pedir a exclusão dos seus dados a qualquer momento escrevendo para ${SITE.email}.`,
          "Tratamos os dados conforme a Lei Geral de Proteção de Dados (LGPD).",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  return { title: page ? page.title : "Não encontrado" };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const page = PAGES[slug];

  if (!page) notFound();

  return (
    <div className="container">
      <article className={styles.article}>
        <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.intro} />

        <div className={styles.body}>
          {page.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <p className={styles.placeholder}>
            Este é um texto provisório de política do template. Troque pelo texto
            revisado da marca antes de publicar.
          </p>
        </div>
      </article>
    </div>
  );
}
