import Image from "next/image";
import Link from "next/link";
import { blogPosts, getPost, getAdjacentPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Studio Notes" };
  return {
    title: `${post.title} — Studio Notes`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, width: 900, height: 500, alt: post.title }],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div className={styles.page}>
      <Link href="/art-journal" className={styles.back}>← Studio Notes</Link>
      <article>
        <header className={styles.header}>
          <p className={styles.date}>{new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</p>
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

      {(prev || next) && (
        <nav className={styles.pagination}>
          <div className={styles.paginationInner}>
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className={styles.paginationLink}>
                <span className={styles.paginationDir}>← Previous</span>
                <span className={styles.paginationTitle}>{prev.title}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/blog/${next.slug}`} className={`${styles.paginationLink} ${styles.paginationRight}`}>
                <span className={styles.paginationDir}>Next →</span>
                <span className={styles.paginationTitle}>{next.title}</span>
              </Link>
            ) : <div />}
          </div>
        </nav>
      )}
    </div>
  );
}
