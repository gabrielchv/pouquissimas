"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import styles from "./login-form.module.css";
import { buttonClassName } from "@/components/ui/button-classes";
import { useAuth } from "./use-auth";

interface LoginFormProps {
  /** Where to go after a successful sign-in. Sanitised to internal paths. */
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/account" }: LoginFormProps) {
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
          Email
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
          placeholder="you@example.com"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
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
        {isSubmitting ? "Signing in…" : "Log in"}
      </button>

      <div className={styles.helper}>
        <button type="button" className={styles.demoButton} onClick={fillDemoAccount}>
          Fill demo credentials
        </button>
        <p className={styles.demoHint}>
          This template ships with a front-end only account:{" "}
          <code>demo@example.com</code> / <code>skate123</code>
        </p>
      </div>

      <p className={styles.footer}>
        No account yet?{" "}
        <Link href="/info/contact" className={styles.footerLink}>
          Get in touch
        </Link>{" "}
        and we will set one up.
      </p>
    </form>
  );
}

/** Only allow same-site paths, so `?next=` cannot be used as an open redirect. */
function safeRedirect(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}
