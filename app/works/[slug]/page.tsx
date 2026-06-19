import Image from "next/image";
import Link from "next/link";
import { works, getWork } from "@/lib/data";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import styles from "./page.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return { title: "Work" };
  return {
    title: `${work.title} — Original Work`,
    description: `${work.description} Original work by Stine Weirsøe Flamant, ${work.year}.`,
    alternates: { canonical: `/works/${work.slug}` },
    openGraph: {
      title: `${work.title} — Stine Weirsøe Flamant`,
      description: work.description,
      images: [{ url: work.image, width: 800, height: 800, alt: work.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} — Stine Weirsøe Flamant`,
      description: work.description,
      images: [work.image],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  tufting: "Hand Tufting",
  embroidery: "Embroidery",
  painting: "Painting",
  photography: "Photography",
}

const CATEGORY_MEDIUM: Record<string, string> = {
  tufting: "Wool tufting on cotton canvas",
  embroidery: "Hand embroidery on fabric",
  painting: "Acrylic and oil stick on canvas",
  photography: "Archival inkjet print",
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const label = CATEGORY_LABELS[work.category] ?? work.category
  const medium = CATEGORY_MEDIUM[work.category] ?? work.description

  const related = works
    .filter((w) => w.category === work.category && w.slug !== work.slug)
    .slice(0, 3)

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.page}>
        <Link href={`/archive?category=${work.category}`} className={styles.back}>← {label}</Link>
      <div className={styles.layout}>
        <div className={styles.image}>
          <Image
            src={work.image}
            alt={work.title}
            width={800}
            height={900}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
            priority
          />
        </div>
        <div className={styles.info}>
          <div className={styles.infoInner}>
            <p className={styles.category}>{label}</p>
            <h1>{work.title}</h1>
            <p className={styles.year}>{work.year}</p>
            <p className={styles.description}>{work.description}</p>

            <div className={styles.availability}>
              <span className={styles.availDot} />
              <span className={styles.availLabel}>Original — available on enquiry</span>
            </div>

            <Link
              href={`/contact?subject=Enquiry: ${encodeURIComponent(work.title)}`}
              className={styles.enquiryBtn}
            >
              Enquire about this work
            </Link>

            <div className={styles.meta}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Medium</span>
                <span className={styles.metaVal}>{medium}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Year</span>
                <span className={styles.metaVal}>{work.year}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Dimensions</span>
                <span className={styles.metaVal}>Available on enquiry</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Type</span>
                <span className={styles.metaVal}>Unique original</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Location</span>
                <span className={styles.metaVal}>Copenhagen, Denmark</span>
              </div>
            </div>

            <p className={styles.note}>
              This is a unique original work. Prints of Stine&apos;s designs are available in the{' '}
              <Link href={`/search?q=${encodeURIComponent(work.title)}`}>shop</Link> from 56 kr.
            </p>

            <Link href={`/archive?category=${work.category}`} className={styles.moreLink}>
              See more {label.toLowerCase()} works →
            </Link>

            <ShareButtons
              url={`https://dayindayin.dk/works/${work.slug}`}
              title={`${work.title} — ${label} by Stine Weirsøe Flamant`}
              imageUrl={work.image}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedHead}>
            <h2 className={styles.relatedTitle}>More {label.toLowerCase()}</h2>
            <Link href={`/archive?category=${work.category}`} className={styles.relatedViewAll}>
              See all {label.toLowerCase()} works →
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <Link key={r.slug} href={`/works/${r.slug}`} className={styles.relatedCard}>
                <div className={styles.relatedImg}>
                  <Image src={r.image} alt={r.title} fill sizes="(max-width: 768px) 33vw, 22vw" style={{ objectFit: 'cover' }} />
                </div>
                <span className={styles.relatedName}>{r.title}</span>
                <span className={styles.relatedYear}>{r.year}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
