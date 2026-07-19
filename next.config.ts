import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // /archive removed 2026-07-11 — its grid view merged into /fine-art?view=grid (Task 18).
      // ?category=X is not a named param here, so Next.js passes it through automatically.
      {
        source: "/archive",
        destination: "/fine-art?view=grid",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "29kekabbrd49avje.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/flamant-studio/dayindayin/**",
      },
    ],
  },
};

export default nextConfig;
