import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./section-heading.module.css";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface SectionHeadingProps {
  /** Applied to the heading, so sections can point aria-labelledby at it. */
  id?: string;
  /** Nível do heading. A home usa 1 (título da página); seções usam 2. */
  level?: 1 | 2;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
}

export function SectionHeading({
  id,
  level = 2,
  eyebrow,
  title,
  description,
  action,
  children,
}: SectionHeadingProps) {
  return (
    <div className={styles.heading}>
      <div className={styles.text}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {level === 1 ? (
          <h1 id={id} className={styles.title}>
            {title}
          </h1>
        ) : (
          <h2 id={id} className={styles.title}>
            {title}
          </h2>
        )}
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>

      {action && (
        <Link href={action.href} className={styles.action}>
          {action.label}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}
