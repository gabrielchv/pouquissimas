"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import styles from "./site-header.module.css";
import { MobileMenu } from "./MobileMenu";
import { AccountIcon, BagIcon, ChevronDownIcon, MenuIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { COLLECTIONS, PRIMARY_NAV } from "@/config/navigation";
import { useAuth } from "@/features/auth/use-auth";
import { useCart } from "@/features/cart/cart-context";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Any navigation closes every transient layer. Adjusting state during render
  // is cheaper than an effect and also covers browser back/forward navigation.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMenuOpen(false);
    setIsShopMenuOpen(false);
  }

  // Solidify the header once the page moves so type stays readable.
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isShopMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsShopMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isShopMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={[styles.header, isScrolled ? styles.scrolled : ""].join(" ")}>
        <div className={`container ${styles.inner}`}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
          >
            <MenuIcon />
          </button>

          <div className={styles.logoSlot}>
            <Logo />
          </div>

          <nav className={styles.nav} aria-label="Principal">
            <ul className={styles.navList}>
              {PRIMARY_NAV.map((item) =>
                item.hasMenu ? (
                  <li
                    key={item.href}
                    className={styles.navItem}
                    onMouseEnter={() => setIsShopMenuOpen(true)}
                    onMouseLeave={() => setIsShopMenuOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={[
                        styles.navLink,
                        isActive(item.href) ? styles.navLinkActive : "",
                      ].join(" ")}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      aria-expanded={isShopMenuOpen}
                      onFocus={() => setIsShopMenuOpen(true)}
                    >
                      {item.label}
                      <ChevronDownIcon className={styles.caret} />
                    </Link>

                    <div
                      className={[
                        styles.dropdown,
                        isShopMenuOpen ? styles.dropdownOpen : "",
                      ].join(" ")}
                    >
                      <ul className={styles.dropdownList}>
                        <li>
                          <Link href="/loja" className={styles.dropdownLink}>
                            ALL
                          </Link>
                        </li>
                        {COLLECTIONS.map((collection) => (
                          <li key={collection.id}>
                            <Link
                              href={`/loja?colecao=${collection.id}`}
                              className={styles.dropdownLink}
                            >
                              {collection.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={[
                        styles.navLink,
                        isActive(item.href) ? styles.navLinkActive : "",
                      ].join(" ")}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link
              href={user ? "/conta" : "/entrar"}
              className={`${styles.iconButton} ${styles.accountButton}`}
              aria-label={user ? `Conta de ${user.name}` : "Entrar"}
              title={user ? "Minha conta" : "Entrar"}
            >
              <AccountIcon />
            </Link>

            <button
              type="button"
              className={styles.iconButton}
              onClick={openCart}
              aria-label={
                itemCount > 0
                  ? `Sacola, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`
                  : "Sacola, vazia"
              }
            >
              <BagIcon />
              {itemCount > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
