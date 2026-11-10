"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./account-view.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClassName } from "@/components/ui/button-classes";
import { useAuth } from "./use-auth";

export function AccountView() {
  const router = useRouter();
  const { user, isReady, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Proteção no cliente. Em produção, proteja a rota também no servidor.
  // `isSigningOut` evita que a proteção brigue com o redirect proposital para a home.
  useEffect(() => {
    if (isReady && !user && !isSigningOut) {
      router.replace("/entrar?next=/conta");
    }
  }, [isReady, user, isSigningOut, router]);

  if (!isReady) {
    return (
      <div className="container">
        <p className={styles.loading}>Verificando sua sessão…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <p className={styles.loading}>Redirecionando para o login…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        eyebrow="Minha conta"
        title={`Olá, ${user.name.split(" ")[0]}`}
        description={user.email}
      />

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Pedidos</h2>
          <p className={styles.cardBody}>
            Nenhum pedido ainda. Quando você fizer um, ele aparece aqui com o rastreio.
          </p>
          <Link href="/loja" className={buttonClassName("secondary", styles.cardAction)}>
            Começar a comprar
          </Link>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Dados</h2>
          <dl className={styles.details}>
            <div className={styles.detailRow}>
              <dt>Nome</dt>
              <dd>{user.name}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>E-mail</dt>
              <dd>{user.email}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Endereço</dt>
              <dd>Ainda não salvo</dd>
            </div>
          </dl>

          <button
            type="button"
            className={styles.signOut}
            onClick={() => {
              setIsSigningOut(true);
              signOut();
              router.replace("/");
            }}
          >
            Sair
          </button>
        </section>
      </div>
    </div>
  );
}
