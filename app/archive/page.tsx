import Image from "next/image";
import Link from "next/link";
import { works } from "@/lib/data";
import styles from "./page.module.css";
import type { Metadata } from "next";

const CATEGORY_LABELS: Record<string, string> = {
  tufting: "Hand Tufting",
  embroidery: "Embroidery",
  painting: "Painting",
  photography: "Photography",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "tufting", label: "Tufting" },
  { key: "embroidery", label: "Embroidery" },
  { key: "painting", label: "Painting" },
  { key: "photography", label: "Photography" },
];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category } = await searchParams;
  const label = category ? CATEGORY_LABELS[category] : null;
  return {
    title: label ? `${label} — All Works` : "All Works",
    description: "Complete archive of original works by Stine Weirsøe Flamant — tufting, embroidery, painting, photography.",
    alternates: { canonical: "/archive" },
  };
}

export default async function Archive({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const active = category && CATEGORY_LABELS[category] ? category : "all";
  const base = active === "all" ? works : works.filter((w) => w.category === active);
  const filtered = [...base].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>All Works</h1>
        <p>
          {filtered.length} {active === "all" ? "original" : CATEGORY_LABELS[active]?.toLowerCase()} work{filtered.length !== 1 ? "s" : ""} —{" "}
          <Link href="/fine-art">view by category →</Link>
        </p>
      </section>

      <div className={styles.filters}>
        {FILTERS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === "all" ? "/archive" : `/archive?category=${key}`}
            className={`${styles.filterBtn} ${active === key ? styles.active : ""}`}
          >
            {label} {key !== "all" ? `(${works.filter((w) => w.category === key).length})` : `(${works.length})`}
          </Link>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((work) => (
          <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={work.image} alt={work.title} fill sizes="(max-width: 768px) 33vw, 20vw" style={{ objectFit: "cover" }} />
            </div>
            <p className={styles.title}>{work.title}</p>
            <p className={styles.meta}>{CATEGORY_LABELS[work.category] ?? work.category} · {work.year}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
