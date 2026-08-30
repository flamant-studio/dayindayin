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
      // bedroom-rug and bedroom-wall-rug were two listings for the same physical piece
      // (confirmed by Sebastian 2026-08-02) — merged into one, then that survivor was
      // itself renamed to you-and-i-and-the-universe 2026-08-30 (Stine's recording) —
      // chain both old slugs straight to the final one, not through the intermediate.
      {
        source: "/works/bedroom-rug",
        destination: "/works/you-and-i-and-the-universe",
        permanent: true,
      },
      {
        source: "/works/bedroom-wall-rug",
        destination: "/works/you-and-i-and-the-universe",
        permanent: true,
      },
      // Fine Art — Tufting Works copy/metadata pass, 2026-08-30 (Stine's 2026-07-30 recording).
      {
        source: "/works/red-on-wood",
        destination: "/works/wallflower",
        permanent: true,
      },
      {
        source: "/works/candy-i",
        destination: "/works/candy-1",
        permanent: true,
      },
      {
        source: "/works/candy-ii",
        destination: "/works/candy-2",
        permanent: true,
      },
      {
        source: "/works/candy-iii",
        destination: "/works/candy-3",
        permanent: true,
      },
      {
        source: "/works/candy-iv",
        destination: "/works/star",
        permanent: true,
      },
      {
        source: "/works/candy-v",
        destination: "/works/candy-4",
        permanent: true,
      },
      {
        source: "/works/candy-vi",
        destination: "/works/candy-5",
        permanent: true,
      },
      {
        source: "/works/candy-vii",
        destination: "/works/candy-6",
        permanent: true,
      },
      {
        source: "/works/green-flower",
        destination: "/works/candy-7",
        permanent: true,
      },
      {
        source: "/works/small-round-tricolor",
        destination: "/works/candy-8",
        permanent: true,
      },
      {
        source: "/works/pow",
        destination: "/works/candy-9",
        permanent: true,
      },
      {
        source: "/works/square-flower-thing",
        destination: "/works/candy-10",
        permanent: true,
      },
      {
        source: "/works/rainbow-i",
        destination: "/works/bifrost-i",
        permanent: true,
      },
      {
        source: "/works/rainbow-ii",
        destination: "/works/bifrost-ii",
        permanent: true,
      },
      {
        source: "/works/rainbow-iii",
        destination: "/works/bifrost-iii",
        permanent: true,
      },
      {
        source: "/works/rainbow-iv",
        destination: "/works/bifrost-iv",
        permanent: true,
      },
      {
        source: "/works/du-und",
        destination: "/works/you-and-i-du-und",
        permanent: true,
      },
      {
        source: "/works/fleur-de-lys",
        destination: "/works/floral-thing-ii",
        permanent: true,
      },
      {
        source: "/works/green-square",
        destination: "/works/green-earth",
        permanent: true,
      },
      {
        source: "/works/jeweled-hand",
        destination: "/works/jewel-hand",
        permanent: true,
      },
      {
        source: "/works/doodles",
        destination: "/works/38-homes",
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
