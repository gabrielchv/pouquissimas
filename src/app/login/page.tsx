import { Suspense } from "react";

import styles from "./login.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <PageHeader
            eyebrow="Account"
            title="Log in"
            description="Track orders, save your sizes and get first access to drops."
          />
        </div>

        <div className={styles.formColumn}>
          <Suspense fallback={<p className={styles.fallback}>Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
