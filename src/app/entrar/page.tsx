import { Suspense } from "react";

import styles from "./entrar.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = {
  title: "Entrar",
  // Página privada: fora do índice e fora do sitemap.
  robots: { index: false, follow: false },
};

export default function EntrarPage() {
  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <PageHeader
            eyebrow="Conta"
            title="Entrar"
            description="Acompanhe pedidos, salve seus tamanhos e tenha acesso antecipado às levas."
          />
        </div>

        <div className={styles.formColumn}>
          <Suspense fallback={<p className={styles.fallback}>Carregando…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
