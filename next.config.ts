import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O Cloud Run recebe só o que o servidor precisa: o build standalone gera
  // .next/standalone com um server.js mínimo, sem node_modules completo.
  output: "standalone",
  images: {
    // Everything ships as a local cut-out PNG. When real photography lands in
    // public/media/products, keep the same path and nothing here changes.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
