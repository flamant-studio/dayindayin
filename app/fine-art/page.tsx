import Image from "next/image";
import Link from "next/link";
import { works, WorkCategory } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import ArtworkCard from "@/components/ArtworkCard";
import styles from "./page.module.css";
import type { Metadata } from "next";

const CATEGORY_LABELS: Record<string, string> = {
  tufting: "Hand Tufting",
  embroidery: "Embroidery",
  painting: "Painting",
  photography: "Photography",
};

const GRID_FILTERS = [
  { key: "all", label: "All" },
  { key: "tufting", label: "Tufting" },
  { key: "embroidery", label: "Embroidery" },
  { key: "painting", label: "Painting" },
  { key: "photography", label: "Photography" },
];

interface PageProps {
  searchParams: Promise<{ view?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { view, category } = await searchParams;
  if (view === 'grid') {
    const label = category ? CATEGORY_LABELS[category] : null;
    return {
      title: label ? `${label} — All Works` : "All Works",
      description: "Complete archive of original works by Stine Weirsøe Flamant — tufting, embroidery, painting, photography.",
      alternates: { canonical: '/fine-art?view=grid' },
    };
  }
  return {
    title: "Fine Art — Original Works",
    description: "Original works by Stine Weirsøe Flamant — hand-tufted textiles, embroidery, paintings, and photography. Unique pieces available on enquiry.",
    openGraph: {
      title: "Fine Art — Original Works by Stine Weirsøe Flamant",
      description: "Unique original works — tufted textiles, embroidery, paintings, and photography. Each piece made by hand in Copenhagen and available on enquiry.",
      images: [{ url: "https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/orange-sun.jpg", width: 1200, height: 900 }],
    },
    alternates: { canonical: "/fine-art" },
  };
}

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

const FEATURED_SLUGS = ['orange-sun', 'fuck-alting', 'universe-3', 'taped-objects'];

// Works hidden from the public archive (weak/placeholder shots)
const HIDDEN_SLUGS = ['office-shot'];

const RECENTLY_ADDED_SLUGS = [
  'purple-fabric-in-garden', 'yarn', 'smorrebrod',
  'bedroom-wall-rug', 'red-on-wood', 'stripes-on-beige', 'pink-rug-II',
  'seb-livingroom', 'green-background', 'long-hair-dont-care', 'gud-har-meldt-afbud-II',
];

function ViewToggle({ view, category }: { view: 'carousel' | 'grid'; category?: string }) {
  const gridHref = category ? `/fine-art?view=grid&category=${category}` : '/fine-art?view=grid';
  return (
    <div className={styles.viewToggle}>
      <Link href="/fine-art" className={`${styles.viewToggleBtn} ${view === 'carousel' ? styles.viewToggleBtnActive : ''}`} aria-current={view === 'carousel' ? 'page' : undefined}>
        Carousel
      </Link>
      <Link href={gridHref} className={`${styles.viewToggleBtn} ${view === 'grid' ? styles.viewToggleBtnActive : ''}`} aria-current={view === 'grid' ? 'page' : undefined}>
        Grid
      </Link>
    </div>
  );
}

export default async function FineArt({ searchParams }: PageProps) {
  const { view: viewParam, category } = await searchParams;
  const view = viewParam === 'grid' ? 'grid' : 'carousel';

  if (view === 'grid') {
    const active = category && CATEGORY_LABELS[category] ? category : "all";
    const base = active === "all" ? works : works.filter((w) => w.category === active);
    const filtered = [...base].sort((a, b) => parseInt(b.year) - parseInt(a.year));

    const itemListJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: active === 'all' ? 'All Works — Stine Weirsøe Flamant' : `${CATEGORY_LABELS[active]} — Stine Weirsøe Flamant`,
      url: `https://dayindayin.dk/fine-art?view=grid${active !== 'all' ? `&category=${active}` : ''}`,
      numberOfItems: filtered.length,
      itemListElement: filtered.slice(0, 20).map((w, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://dayindayin.dk/works/${w.slug}`,
        name: w.title,
        image: w.image,
      })),
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <div className={styles.page}>
          <section className={styles.hero}>
            <span className={styles.heroLabel}>Original Works</span>
            <h1>All Works</h1>
            <p className={styles.heroSub}>
              {filtered.length} {active === "all" ? "original" : CATEGORY_LABELS[active]?.toLowerCase()} work{filtered.length !== 1 ? "s" : ""} — the complete catalog, newest first.
            </p>
          </section>

          <ViewToggle view="grid" category={active !== 'all' ? active : undefined} />

          <div className={styles.gridFilters}>
            {GRID_FILTERS.map(({ key, label }) => (
              <Link
                key={key}
                href={key === "all" ? "/fine-art?view=grid" : `/fine-art?view=grid&category=${key}`}
                className={`${styles.gridFilterBtn} ${active === key ? styles.gridFilterBtnActive : ""}`}
                aria-current={active === key ? 'page' : undefined}
              >
                {label} {key !== "all" ? `(${works.filter((w) => w.category === key).length})` : `(${works.length})`}
              </Link>
            ))}
          </div>

          <div className={styles.denseGrid}>
            {filtered.map((work) => (
              <ArtworkCard
                key={work.slug}
                work={work}
                sizes="(max-width: 768px) 33vw, 20vw"
                metaLabel={`${CATEGORY_LABELS[work.category] ?? work.category} · ${work.year}`}
              />
            ))}
          </div>

          <section className={styles.shopNote}>
            All originals are available on enquiry. Looking for prints? The{' '}
            <Link href="/shop">print shop</Link>
            {' '}ships across Europe from 56{' '}kr.
          </section>
        </div>
      </>
    );
  }

  const featuredWorks = FEATURED_SLUGS
    .map(slug => works.find(w => w.slug === slug))
    .filter(Boolean) as typeof works;

  const [heroWork, ...rowWorks] = featuredWorks;

  const recentlyAdded = RECENTLY_ADDED_SLUGS
    .map(slug => works.find(w => w.slug === slug))
    .filter(Boolean) as typeof works;

  const availableCount = works.filter(w => !w.sold).length
  const totalCount = works.length

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artGalleryJsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <span className={styles.heroLabel}>Original Works</span>
        <h1>Fine Art</h1>
        <p className={styles.heroSub}>
          Tufted textiles, embroidery, painting, and photography — made by hand in Copenhagen.
          Each piece exists once and is available on direct enquiry.
        </p>
        <p className={styles.heroCount}>
          {availableCount} of {totalCount} works currently available
        </p>
      </section>

      <ViewToggle view="carousel" />

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

      {/* ── New additions strip ──────────────────────────────── */}
      {recentlyAdded.length > 0 && (
        <section className={styles.recentSection}>
          <div className={styles.recentHead}>
            <span className={styles.recentLabel}>Recent additions</span>
            <span className={styles.recentCount}>{recentlyAdded.length} works added</span>
          </div>
          <div className={styles.recentStrip}>
            {recentlyAdded.map((work) => (
              <Link key={work.slug} href={`/works/${work.slug}`} className={styles.recentCard}>
                <div className={styles.recentImg}>
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 40vw, 180px"
                    className={styles.recentImgEl}
                  />
                </div>
                <span className={styles.recentTitle}>{work.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Category anchor nav ──────────────────────────────── */}
      <nav className={styles.catNav}>
        {sections.map((s) => {
          const count = works.filter((w) => w.category === s.id && !HIDDEN_SLUGS.includes(w.slug)).length;
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
        const categoryWorks = works.filter((w) => w.category === section.id && !HIDDEN_SLUGS.includes(w.slug));
        return (
          <section key={section.id} id={section.id} className={styles.section}>
            <SectionHeading title={section.label} subtitle={section.tagline} />
            <div className={styles.grid}>
              {categoryWorks.map((work) => (
                <ArtworkCard key={work.slug} work={work} />
              ))}
            </div>
          </section>
        );
      })}

      {/* ── Print shop note ─────────────────────────────────── */}
      <div className={styles.shopNote}>
        Looking for prints? The{' '}
        <Link href="/shop">print shop</Link>
        {' '}ships across Europe from 56{' '}kr.
      </div>
    </div>
  );
}
