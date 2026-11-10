import { CartView } from "@/features/cart/CartView";

export const metadata = {
  title: "Sua sacola",
  // Página privada: fora do índice e fora do sitemap.
  robots: { index: false, follow: false },
};

export default function SacolaPage() {
  return <CartView />;
}
