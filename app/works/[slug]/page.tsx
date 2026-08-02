import Image from "next/image";
import Link from "next/link";
import { works, getWork } from "@/lib/data";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import WorksGallery from "@/components/WorksGallery";
import Button from "@/components/Button";
import ArtworkCard from "@/components/ArtworkCard";
import RecentlyViewedWorks from "@/components/RecentlyViewedWorks";
import styles from "./page.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

// No revalidate meant a slug removed from `works` (e.g. bedroom-rug, merged into
// bedroom-wall-rug) kept serving its old statically-cached page indefinitely, ahead of
// the next.config.ts redirect — this route's cache never expired to notice the slug was
// gone. Matches app/shop/[handle]/page.tsx's existing revalidate pattern.
export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return { title: "Work" };
  // Hardcoded to the .vercel.app URL (not resolved via metadataBase/dayindayin.dk) so this
  // image is fetchable by social crawlers today — dayindayin.dk DNS isn't pointed at Vercel yet.
  // Safe to leave as-is even after DNS points: Vercel keeps serving this URL alongside the custom domain.
  const ogImageUrl = `https://dayindayin-site.vercel.app/works/${work.slug}/opengraph-image`
  return {
    title: `${work.title} — Original Work`,
    description: `${work.description} Original work by Stine Weirsøe Flamant, ${work.year}.`,
    alternates: { canonical: `/works/${work.slug}` },
    openGraph: {
      siteName: 'Day In Day In',
      title: `${work.title} — Stine Weirsøe Flamant`,
      description: work.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: work.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} — Stine Weirsøe Flamant`,
      description: work.description,
      images: [ogImageUrl],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  tufting: "Hand Tufting",
  embroidery: "Embroidery",
  painting: "Painting",
  photography: "Photography",
  mixed: "Mixed Media",
}

const CATEGORY_MEDIUM: Record<string, string> = {
  tufting: "Wool tufting on cotton canvas",
  embroidery: "Hand embroidery on fabric",
  painting: "Acrylic and oil stick on canvas",
  photography: "Archival inkjet print",
  mixed: "Mixed media",
}

const SERIES_SHOP_FILTERS: Array<{ pattern: RegExp; filter: string; label: string }> = [
  { pattern: /\bshero\b/i,       filter: 'shero',        label: 'SHERO series' },
  { pattern: /\bneko\b/i,        filter: 'neko',         label: 'NEKO series' },
  { pattern: /sea[\s-]monster/i, filter: 'sea-monsters', label: 'Sea Monsters' },
  { pattern: /floral/i,          filter: 'floral',       label: 'Floral' },
  { pattern: /\bfaces?\b/i,      filter: 'faces',        label: 'Faces' },
  { pattern: /sommerby/i,        filter: 'sommerby',     label: 'Sommerby' },
]

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const label = CATEGORY_LABELS[work.category] ?? work.category
  const medium = work.materials ?? CATEGORY_MEDIUM[work.category] ?? work.description

  const seriesMatch = SERIES_SHOP_FILTERS.find(s => s.pattern.test(work.title))
  const shopHref = seriesMatch ? `/shop?filter=${seriesMatch.filter}` : '/shop'
  const shopLabel = seriesMatch ? `${seriesMatch.label} prints` : 'prints in the shop'

  const related = works
    .filter((w) => w.category === work.category && w.slug !== work.slug)
    .slice(0, 3)

  const gallery = work.gallery ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: work.title,
    description: work.description,
    image: work.image,
    dateCreated: work.year,
    artMedium: medium,
    artworkSurface: work.category === 'tufting' || work.category === 'embroidery' ? 'Canvas' : undefined,
    creator: {
      '@type': 'Person',
      name: 'Stine Weirsøe Flamant',
      url: 'https://dayindayin.dk/about',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Day In Day In' },
    },
    url: `https://dayindayin.dk/works/${work.slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dayindayin.dk' },
      { '@type': 'ListItem', position: 2, name: 'Fine Art', item: 'https://dayindayin.dk/fine-art' },
      { '@type': 'ListItem', position: 3, name: label, item: `https://dayindayin.dk/fine-art?view=grid&category=${work.category}` },
      { '@type': 'ListItem', position: 4, name: work.title, item: `https://dayindayin.dk/works/${work.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className={styles.page}>
        {/* ── Hero — clean image, no text overlay ───────────────── */}
        <div className={styles.hero}>
          <Image
            src={work.image}
            alt={`${work.title} — ${label} by Stine Weirsøe Flamant, ${work.year}`}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* ── Title below image ─────────────────────────────────── */}
        <div className={styles.titleSection}>
          <p className={styles.workCategory}>{label}</p>
          <h1 className={styles.workTitle}>{work.title}</h1>
          <p className={styles.workYear}>{work.year}</p>
        </div>

        {/* ── Info ──────────────────────────────────────────────── */}
        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoLeft}>
              <div className={styles.availability}>
                <span className={`${styles.availDot} ${work.sold ? styles.availDotSold : ''}`} />
                <span className={`${styles.availLabel} ${work.sold ? styles.availLabelSold : ''}`}>
                  {work.sold ? 'Sold — enquire about similar work' : 'Original — price on enquiry'}
                </span>
              </div>
              <p className={styles.description}>{work.description}</p>
              <p className={styles.note}>
                Prints of Stine&apos;s work are available in the{' '}
                <Link href={shopHref}>{shopLabel}</Link> from 56 kr.
              </p>
              <Link href={`/fine-art?view=grid&category=${work.category}`} className={styles.moreLink}>
                See more {label.toLowerCase()} works →
              </Link>
              <ShareButtons
                url={`https://dayindayin.dk/works/${work.slug}`}
              />
            </div>
            <div className={styles.infoRight}>
              <p className={styles.pricingNote}>
                Originals are individually priced.{' '}
                <Link href="/practical">See the FAQ</Link> for typical price ranges.
              </p>
              <Button
                href={`/contact?subject=${work.sold ? 'Similar+work+enquiry' : `Enquiry:+${encodeURIComponent(work.title)}`}`}
                variant={work.sold ? 'secondary' : 'primary'}
                full
              >
                {work.sold ? 'Enquire about similar work' : 'Enquire about price'}
              </Button>
              <div className={styles.meta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Medium</span>
                  <span className={styles.metaVal}>{medium}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Year</span>
                  <span className={styles.metaVal}>{work.year}</span>
                </div>
                {work.dimensions && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>Dimensions</span>
                    <span className={styles.metaVal}>{work.dimensions}</span>
                  </div>
                )}
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Edition</span>
                  <span className={styles.metaVal}>Unique original</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Location</span>
                  <span className={styles.metaVal}>Copenhagen, Denmark</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Gallery ───────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section className={styles.gallery}>
            <div className={styles.galleryHeader}>
              <span className={styles.galleryLabel}>Studio views</span>
            </div>
            <WorksGallery images={gallery} title={work.title} />
          </section>
        )}

        {/* ── Related ───────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle}>More {label.toLowerCase()}</h2>
              <Link href={`/fine-art?view=grid&category=${work.category}`} className={styles.relatedViewAll}>
                See all {label.toLowerCase()} works →
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <ArtworkCard key={r.slug} work={r} sizes="(max-width: 768px) 50vw, 22vw" showDimensions={false} />
              ))}
            </div>
          </section>
        )}

        <div className={styles.recentlyViewedWrap}>
          <RecentlyViewedWorks currentWork={work} />
        </div>

      </div>
    </>
  );
}
