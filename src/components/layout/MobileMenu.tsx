"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import styles from "./mobile-menu.module.css";
import { CloseIcon } from "@/components/ui/Icons";
import { COLLECTIONS, PRIMARY_NAV } from "@/config/navigation";
import { useAuth } from "@/features/auth/use-auth";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  // While the panel is open: lock background scroll and allow Escape to close.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Menu">
      <div className={styles.topBar}>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.primaryList}>
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.primaryLink} onClick={onClose}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.groupLabel}>COLLECTIONS</p>
        <ul className={styles.secondaryList}>
          <li>
            <Link href="/shop" className={styles.secondaryLink} onClick={onClose}>
              ALL
            </Link>
          </li>
          {COLLECTIONS.map((collection) => (
            <li key={collection.id}>
              <Link
                href={`/shop?collection=${collection.id}`}
                className={styles.secondaryLink}
                onClick={onClose}
              >
                {collection.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <Link
          href={user ? "/account" : "/login"}
          className={styles.accountLink}
          onClick={onClose}
        >
          {user ? `Hi, ${user.name.split(" ")[0]}` : "LOG IN"}
        </Link>
      </div>
    </div>
  );
}
