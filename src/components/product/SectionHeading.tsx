import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./section-heading.module.css";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface SectionHeadingProps {
  /** Applied to the <h2>, so sections can point aria-labelledby at it. */
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
}

export function SectionHeading({
  id,
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
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
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
