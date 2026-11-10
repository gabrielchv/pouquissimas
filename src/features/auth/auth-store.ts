"use client";

import type { SessionUser } from "@/lib/types";

/**
 * Demo authentication, kept deliberately small and isolated.
 *
 * There is no backend in this template: credentials are checked in the browser
 * and the session is kept in localStorage. To ship a real storefront, replace
 * `signIn` with a call to your auth provider (Auth.js, Clerk, Supabase, a route
 * handler...) and keep the same snapshot contract, so no component changes.
 */

const SESSION_KEY = "pouquissimas.session.v1";

const DEMO_ACCOUNT = {
  email: "demo@example.com",
  password: "skate123",
  name: "Cliente Demo",
} as const;

export type AuthResult = { ok: true } | { ok: false; error: string };

export interface AuthSnapshot {
  user: SessionUser | null;
  /** False until the stored session has been read in the browser. */
  isReady: boolean;
}

const SERVER_SNAPSHOT: AuthSnapshot = { user: null, isReady: false };

let snapshot: AuthSnapshot = SERVER_SNAPSHOT;
let hasHydrated = false;
const listeners = new Set<() => void>();

function publish(user: SessionUser | null): void {
  snapshot = { user, isReady: true };

  for (const listener of listeners) {
    listener();
  }
}

export function subscribeToAuth(listener: () => void): () => void {
  listeners.add(listener);

  if (!hasHydrated) {
    hasHydrated = true;
    publish(readStoredSession());
  }

  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot;
}

export function getAuthServerSnapshot(): AuthSnapshot {
  return SERVER_SNAPSHOT;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  // A short delay keeps loading states honest once this is a real request.
  await new Promise((resolve) => setTimeout(resolve, 350));

  const normalisedEmail = email.trim().toLowerCase();

  if (normalisedEmail !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
    return { ok: false, error: "E-mail ou senha incorretos." };
  }

  const session: SessionUser = {
    id: "user-demo",
    name: DEMO_ACCOUNT.name,
    email: DEMO_ACCOUNT.email,
  };

  publish(session);
  writeStoredSession(session);
  return { ok: true };
}

export function signOut(): void {
  publish(null);
  clearStoredSession();
}

/* -------------------------------------------------------------------------- */
/* Persistence helpers                                                        */
/* -------------------------------------------------------------------------- */

function readStoredSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }

    return { id: parsed.id, name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

function writeStoredSession(user: SessionUser): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // Non-fatal: the user stays signed in for this page load only.
  }
}

function clearStoredSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore.
  }
}
