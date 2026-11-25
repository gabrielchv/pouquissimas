"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import styles from "./formulario.module.css";
import { buttonClassName } from "@/components/ui/button-classes";
import { useAuth } from "./use-auth";
import { safeRedirect } from "./safe-redirect";

interface LoginFormProps {
  /** Para onde ir depois do login. Sanitizado para caminhos internos. */
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/conta" }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const nextParam = searchParams.get("next");
  const destination = safeRedirect(nextParam) ?? redirectTo;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn(email, password);

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  function fillDemoAccount() {
    setEmail("demo@example.com");
    setPassword("skate123");
    setError(null);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@exemplo.com"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={buttonClassName("primary", styles.submit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>

      <div className={styles.helper}>
        <button type="button" className={styles.demoButton} onClick={fillDemoAccount}>
          Preencher dados de demonstração
        </button>
        <p className={styles.demoHint}>
          Este template tem uma conta apenas no navegador:{" "}
          <code>demo@example.com</code> / <code>skate123</code>
        </p>
      </div>

      <p className={styles.footer}>
        Ainda não tem conta?{" "}
        <Link href="/info/contato" className={styles.footerLink}>
          Fale com a gente
        </Link>{" "}
        e criamos uma para você.
      </p>
    </form>
  );
}

