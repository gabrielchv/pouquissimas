import Link from "next/link";

import { buttonClassName } from "@/components/ui/button-classes";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: "12rem", textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1
        style={{
          marginBlock: "1.2rem 1.6rem",
          fontSize: "clamp(3.2rem, 8vw, 6rem)",
          textTransform: "uppercase",
        }}
      >
        Rolled away
      </h1>
      <p
        style={{
          marginBottom: "2.4rem",
          fontSize: "1.4rem",
          color: "var(--text-tertiary)",
        }}
      >
        That page does not exist — it may have sold out or moved.
      </p>
      <Link href="/shop" className={buttonClassName("primary")}>
        Back to the shop
      </Link>
    </div>
  );
}
