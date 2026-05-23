import Image from "next/image";
import Link from "next/link";
import { blogPosts, getPost } from "@/lib/data";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? post.title : "Post" };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className={styles.page}>
      <Link href="/art-journal" className={styles.back}>← Art Journal</Link>
      <article>
        <header className={styles.header}>
          <p className={styles.date}>{new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
          <h1>{post.title}</h1>
        </header>
        <div className={styles.image}>
          <Image src={post.image} alt={post.title} width={900} height={500} style={{ objectFit: "cover", width: "100%", height: "auto" }} />
        </div>
        <div className={styles.body}>
          <p>{post.excerpt}</p>
          <p className={styles.placeholder}>[Full post content goes here]</p>
        </div>
      </article>
    </div>
  );
}
