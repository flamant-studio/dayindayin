import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Notes",
  description: "Notes from Stine's Copenhagen studio — process, ideas, and what's been happening.",
};

export default function StudioNotes() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Studio Notes</h1>
        <p className={styles.heroSub}>Process, ideas, and what&apos;s been happening in the studio.</p>
      </section>
      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
            </div>
            <div className={styles.cardBody}>
              <h2>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
