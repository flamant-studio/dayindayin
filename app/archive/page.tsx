import Image from "next/image";
import Link from "next/link";
import { works } from "@/lib/data";
import styles from "./page.module.css";

export const metadata = { title: "Archive — Day In Day In" };

export default function Archive() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Archive</h1>
        <p>A complete record of works</p>
      </section>
      <div className={styles.grid}>
        {works.map((work) => (
          <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={work.image} alt={work.title} fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: "cover" }} />
            </div>
            <p className={styles.title}>{work.title}</p>
            <p className={styles.meta}>{work.category} · {work.year}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
