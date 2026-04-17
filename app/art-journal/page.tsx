import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import styles from "./page.module.css";

export const metadata = { title: "Art Journal — Day In Day In" };

export default function ArtJournal() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Art Journal</h1>
      </section>
      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
            </div>
            <div className={styles.cardBody}>
              <p className={styles.date}>{new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
              <h2>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
