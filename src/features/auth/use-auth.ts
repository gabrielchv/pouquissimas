"use client";

import { useSyncExternalStore } from "react";

import {
  getAuthServerSnapshot,
  getAuthSnapshot,
  signIn,
  signOut,
  subscribeToAuth,
  type AuthResult,
} from "./auth-store";
import type { SessionUser } from "@/lib/types";

interface UseAuthValue {
  user: SessionUser | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
}

/**
 * Reads the session from the external auth store. No provider is needed:
 * `useSyncExternalStore` handles the server snapshot and subscription.
 */
export function useAuth(): UseAuthValue {
  const { user, isReady } = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );

  return { user, isReady, signIn, signOut };
}
