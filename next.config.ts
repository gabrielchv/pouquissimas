import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Everything ships as a local cut-out PNG. When real photography lands in
    // public/media/products, keep the same path and nothing here changes.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
