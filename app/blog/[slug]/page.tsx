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
  return {
    title: post ? `${post.title} — Studio Notes` : "Studio Notes",
    description: post?.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className={styles.page}>
      <Link href="/art-journal" className={styles.back}>← Studio Notes</Link>
      <article>
        <header className={styles.header}>
          <h1>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
        </header>
        <div className={styles.image}>
          <Image
            src={post.image}
            alt={post.title}
            width={900}
            height={500}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
        <div className={styles.body}>
          {post.body
            ? post.body.map((para, i) => <p key={i}>{para}</p>)
            : <p>{post.excerpt}</p>
          }
        </div>
      </article>
    </div>
  );
}
