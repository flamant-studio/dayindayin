import Image from "next/image";
import Link from "next/link";
import { works, WorkCategory } from "@/lib/data";
import styles from "./page.module.css";

export const metadata = {
  title: "Fine Art — Original Works",
  description: "Original works by Stine Weirsøe Flamant — hand-tufted textiles, embroidery, paintings, and photography. Unique pieces available on enquiry.",
  openGraph: {
    title: "Fine Art — Original Works by Stine Weirsøe Flamant",
    description: "Unique original works — tufted textiles, embroidery, paintings, and photography. Each piece made by hand in Copenhagen and available on enquiry.",
    images: [{ url: "https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/liebes-panopticon.jpg", width: 1200, height: 900 }],
  },
  alternates: { canonical: "/fine-art" },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dayindayin.dk' },
    { '@type': 'ListItem', position: 2, name: 'Fine Art', item: 'https://dayindayin.dk/fine-art' },
  ],
}

const artGalleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ArtGallery',
  name: 'Day In Day In — Fine Art',
  description: 'Original works by Stine Weirsøe Flamant — hand-tufted textiles, embroidery, paintings, and photography.',
  url: 'https://dayindayin.dk/fine-art',
  address: { '@type': 'PostalAddress', addressLocality: 'Copenhagen', addressCountry: 'DK' },
  founder: { '@type': 'Person', name: 'Stine Weirsøe Flamant', url: 'https://dayindayin.dk/about' },
}

const sections: { id: WorkCategory; label: string; tagline: string }[] = [
  { id: "tufting",     label: "Hand Tufting",  tagline: "Each piece takes days. The pile height, density, and texture chosen entirely by hand. No two are alike." },
  { id: "embroidery",  label: "Embroidery",    tagline: "Needle and thread on canvas and linen. Where the work started and where it keeps returning." },
  { id: "painting",    label: "Paintings",     tagline: "Acrylic and oil stick on canvas, worked on the studio floor. Layers built up and scraped back over multiple sessions." },
  { id: "photography", label: "Photography",   tagline: "Shot on location across Denmark and beyond. Stillness, observation, the moment just after." },
];

const FEATURED_SLUGS = ['liebes-panopticon', 'collage-bw', 'universe-1', 'purple-flower'];

export default function FineArt() {
  const featuredWorks = FEATURED_SLUGS
    .map(slug => works.find(w => w.slug === slug))
    .filter(Boolean) as typeof works;

  const [heroWork, ...rowWorks] = featuredWorks;

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artGalleryJsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <span className={styles.heroLabel}>Original Works</span>
        <h1>Fine Art</h1>
        <p className={styles.heroSub}>
          Made by hand in Copenhagen. Each piece exists once — available on enquiry.
        </p>
      </section>

      {/* ── Featured: one large + three secondary ────────────── */}
      {heroWork && (
        <div className={styles.featured}>
          <Link href={`/works/${heroWork.slug}`} className={styles.featuredHero}>
            <Image
              src={heroWork.image}
              alt={heroWork.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 65vw"
              className={styles.featuredHeroImg}
            />
            <div className={styles.featuredCaption}>
              <span className={styles.featuredCaptionTitle}>{heroWork.title}</span>
              <span className={styles.featuredCaptionMeta}>{heroWork.category === 'tufting' ? 'Hand Tufting' : heroWork.category.charAt(0).toUpperCase() + heroWork.category.slice(1)} · {heroWork.year}</span>
            </div>
          </Link>

          <div className={styles.featuredSide}>
            {rowWorks.map((work) => (
              <Link key={work.slug} href={`/works/${work.slug}`} className={styles.featuredSecondary}>
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className={styles.featuredSecondaryImg}
                />
                <div className={styles.featuredCaption}>
                  <span className={styles.featuredCaptionTitle}>{work.title}</span>
                  <span className={styles.featuredCaptionMeta}>{work.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Category anchor nav ──────────────────────────────── */}
      <nav className={styles.catNav}>
        {sections.map((s) => {
          const count = works.filter((w) => w.category === s.id).length;
          return (
            <a key={s.id} href={`#${s.id}`} className={styles.catNavLink}>
              {s.label}
              <span className={styles.catNavCount}>{count}</span>
            </a>
          );
        })}
      </nav>

      {/* ── Sections ─────────────────────────────────────────── */}
      {sections.map((section) => {
        const categoryWorks = works.filter((w) => w.category === section.id);
        return (
          <section key={section.id} id={section.id} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.label}</h2>
              <p className={styles.sectionTagline}>{section.tagline}</p>
            </div>
            <div className={styles.grid}>
              {categoryWorks.map((work) => (
                <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
                  <div className={styles.cardImage}>
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className={styles.cardImg}
                    />
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardEnquire}>View work →</span>
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <p className={styles.cardTitle}>{work.title}</p>
                    <p className={styles.cardYear}>{work.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* ── Enquiry CTA ────────────────────────────────────────── */}
      <section className={styles.enquiryCta}>
        <h2>Each piece exists once.</h2>
        <p>
          If something catches you, reach out. Stine responds directly.
          She also takes commissions when she has the space for it.
        </p>
        <div className={styles.enquiryBtns}>
          <Link href="/contact?subject=Fine%20Art%20enquiry" className={styles.enquiryBtn}>
            Send an enquiry →
          </Link>
          <Link href="/commissions" className={styles.enquiryBtnSecondary}>
            Commission new work →
          </Link>
        </div>
      </section>

      {/* ── Print shop note ─────────────────────────────────── */}
      <div className={styles.shopNote}>
        Looking for prints? The{' '}
        <Link href="/shop">print shop</Link>
        {' '}ships across Europe from 56 kr.
      </div>
    </div>
  );
}
