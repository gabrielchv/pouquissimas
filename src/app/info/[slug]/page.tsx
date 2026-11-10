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

/** Placeholder policy copy. Replace with your own before going live. */
const PAGES: Record<string, InfoContent> = {
  contact: {
    eyebrow: "Help",
    title: "Contact",
    intro: "Questions about an order, a size, or a wholesale enquiry? Start here.",
    sections: [
      {
        heading: "Orders and sizing",
        body: [
          `Email ${SITE.email} with your order number and we will get back to you within two business days.`,
          "For sizing, every product page lists the measurements we use on our own samples.",
        ],
      },
      {
        heading: "Wholesale",
        body: [
          "Shops interested in stocking the brand can email the same address with a short introduction and a link to your store.",
        ],
      },
    ],
  },
  shipping: {
    eyebrow: "Policies",
    title: "Shipping + returns",
    intro: "What to expect after you check out.",
    sections: [
      {
        heading: "Shipping",
        body: [
          "Domestic orders ship within 2–3 business days. Free shipping applies to domestic orders over $150.",
          "International orders are shipped tracked and usually arrive within 7–14 business days, depending on customs.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Unworn items can be returned within 30 days of delivery for a refund or exchange. Sale items are final sale.",
          "Email us before shipping anything back so we can send the right return address.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of service",
    intro: "The short version of the agreement between you and the shop.",
    sections: [
      {
        heading: "Orders",
        body: [
          "An order is an offer to buy. We confirm that offer when the order ships, and we may cancel an order if an item sells out or a price is listed in error.",
        ],
      },
      {
        heading: "Use of the site",
        body: [
          "Product photography, artwork and copy on this site belong to the brand and may not be reused commercially without permission.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    intro: "What we collect and why.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Order details needed to fulfil your purchase: name, shipping address, email, and items ordered.",
          "Payment details are handled by our payment provider. We never store card numbers ourselves.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          `You can ask us to delete your account data at any time by emailing ${SITE.email}.`,
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
  return { title: page ? page.title : "Not found" };
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
            This is placeholder policy copy for the template. Replace it with
            your review-approved text before launch.
          </p>
        </div>
      </article>
    </div>
  );
}
