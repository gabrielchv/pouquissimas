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

  // Client-side guard. A real deployment would also protect the route on the server.
  // `isSigningOut` stops the guard from racing the deliberate redirect to home.
  useEffect(() => {
    if (isReady && !user && !isSigningOut) {
      router.replace("/login?next=/account");
    }
  }, [isReady, user, isSigningOut, router]);

  if (!isReady) {
    return (
      <div className="container">
        <p className={styles.loading}>Checking your session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <p className={styles.loading}>Redirecting to log in…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        eyebrow="Account"
        title={`Hi, ${user.name.split(" ")[0]}`}
        description={user.email}
      />

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Orders</h2>
          <p className={styles.cardBody}>
            No orders yet. When you place one it will show up here with tracking.
          </p>
          <Link href="/shop" className={buttonClassName("secondary", styles.cardAction)}>
            Start shopping
          </Link>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Details</h2>
          <dl className={styles.details}>
            <div className={styles.detailRow}>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Address</dt>
              <dd>Not saved yet</dd>
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
            Sign out
          </button>
        </section>
      </div>
    </div>
  );
}
