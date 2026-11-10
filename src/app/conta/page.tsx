import { AccountView } from "@/features/auth/AccountView";

export const metadata = {
  title: "Minha conta",
  // Página privada: fora do índice e fora do sitemap.
  robots: { index: false, follow: false },
};

export default function ContaPage() {
  return <AccountView />;
}
