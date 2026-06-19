import Image from "next/image";
import Link from "next/link";
import { works } from "@/lib/data";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Works",
  description: "Complete archive of original works by Stine Weirsøe Flamant — tufting, embroidery, painting, photography.",
};

const CATEGORY_LABELS: Record<string, string> = {
  tufting: "Hand Tufting",
  embroidery: "Embroidery",
  painting: "Painting",
  photography: "Photography",
};

export default function Archive() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>All Works</h1>
        <p>{works.length} original works — <Link href="/fine-art">view by category →</Link></p>
      </section>
      <div className={styles.grid}>
        {works.map((work) => (
          <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={work.image} alt={work.title} fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: "cover" }} />
            </div>
            <p className={styles.title}>{work.title}</p>
            <p className={styles.meta}>{CATEGORY_LABELS[work.category] ?? work.category} · {work.year}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
