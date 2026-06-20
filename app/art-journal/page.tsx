import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Notes",
  description: "Notes from Stine's Copenhagen studio — process, ideas, and what's been happening.",
  alternates: { canonical: "/art-journal" },
  openGraph: {
    title: "Studio Notes — Day In Day In",
    description: "Notes from Stine's Copenhagen studio — process, ideas, and what's been happening.",
    images: [{ url: "https://29kekabbrd49avje.public.blob.vercel-storage.com/lifestyle/ls-04.jpg", width: 1200, height: 800 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Notes — Day In Day In",
    description: "Notes from Stine's Copenhagen studio — process, ideas, and what's been happening.",
    images: ["https://29kekabbrd49avje.public.blob.vercel-storage.com/lifestyle/ls-04.jpg"],
  },
};

interface PageProps {
  searchParams: Promise<{ year?: string }>
}

export default async function StudioNotes({ searchParams }: PageProps) {
  const { year } = await searchParams
  const activeYear = year ?? null

  // Available years from posts (descending)
  const years = [...new Set(blogPosts.map(p => p.date.slice(0, 4)))].sort((a, b) => Number(b) - Number(a))

  const filtered = activeYear
    ? blogPosts.filter(p => p.date.startsWith(activeYear))
    : blogPosts

  const [featured, ...rest] = filtered

  const featuredWc = featured
    ? (featured.body ? featured.body.join(' ').split(/\s+/).length : featured.excerpt.split(/\s+/).length)
    : 0
  const featuredMins = featured ? Math.max(1, Math.round(featuredWc / 200)) : 0

  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Studio Notes — Day In Day In',
    description: "Notes from Stine Weirsøe Flamant's Copenhagen studio — process, ideas, and what's been happening.",
    url: 'https://dayindayin.dk/art-journal',
    author: {
      '@type': 'Person',
      name: 'Stine Weirsøe Flamant',
      url: 'https://dayindayin.dk/about',
    },
    blogPost: blogPosts.slice(0, 10).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      image: p.image,
      datePublished: p.date,
      url: `https://dayindayin.dk/blog/${p.slug}`,
      author: { '@type': 'Person', name: 'Stine Weirsøe Flamant' },
    })),
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }} />
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Studio Notes</h1>
        <p className={styles.heroSub}>
          Process, ideas, and what&apos;s been happening in the studio.
          {' '}{blogPosts.length} notes.
        </p>
      </section>

      {/* ── Year filter ─────────────────────────────────────────── */}
      <nav className={styles.yearFilter} aria-label="Filter by year">
        <Link
          href="/art-journal"
          className={`${styles.yearBtn} ${!activeYear ? styles.yearBtnActive : ''}`}
          aria-current={!activeYear ? 'page' : undefined}
        >
          All
        </Link>
        {years.map(y => {
          const yearCount = blogPosts.filter(p => p.date.startsWith(y)).length
          return (
          <Link
            key={y}
            href={`/art-journal?year=${y}`}
            className={`${styles.yearBtn} ${activeYear === y ? styles.yearBtnActive : ''}`}
            aria-current={activeYear === y ? 'page' : undefined}
          >
            {y} <span style={{ opacity: 0.55, fontSize: '0.7em' }}>({yearCount})</span>
          </Link>
          )
        })}
      </nav>

      {filtered.length === 0 && (
        <p className={styles.empty}>No notes found for {activeYear}.</p>
      )}

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
              {' · '}{featuredMins} min read
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
          {rest.map((post) => {
            const wc = post.body ? post.body.join(' ').split(/\s+/).length : post.excerpt.split(/\s+/).length
            const mins = Math.max(1, Math.round(wc / 200))
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.date}>
                    {new Date(post.date).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
                    {' · '}{mins} min read
                  </p>
                  <h2>{post.title}</h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
    </>
  );
}
