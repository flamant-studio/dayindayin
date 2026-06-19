import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Notes",
  description: "Notes from Stine's Copenhagen studio — process, ideas, and what's been happening.",
  alternates: { canonical: "/art-journal" },
};

export default function StudioNotes() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Studio Notes</h1>
        <p className={styles.heroSub}>Process, ideas, and what&apos;s been happening in the studio. {blogPosts.length} notes.</p>
      </section>

      {/* ── Featured post ────────────────────────────────────────── */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className={styles.featured}>
          <div className={styles.featuredImage}>
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.featuredBody}>
            <p className={styles.featuredDate}>
              {new Date(featured.date).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
            </p>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
            <span className={styles.featuredCta}>Read note →</span>
          </div>
        </Link>
      )}

      {/* ── Rest of notes ─────────────────────────────────────────── */}
      {rest.length > 0 && (
        <div className={styles.grid}>
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
              <div className={styles.cardImage}>
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.date}>{new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>
                <h2>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
