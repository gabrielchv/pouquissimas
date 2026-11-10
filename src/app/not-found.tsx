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
        Essa página não existe
      </h1>
      <p
        style={{
          marginBottom: "2.4rem",
          fontSize: "1.4rem",
          color: "var(--text-tertiary)",
        }}
      >
        O endereço pode ter mudado ou a peça saiu de linha.
      </p>
      <Link href="/loja" className={buttonClassName("primary")}>
        Voltar para a loja
      </Link>
    </div>
  );
}
