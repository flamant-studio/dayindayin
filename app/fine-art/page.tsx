import Image from "next/image";
import Link from "next/link";
import { works, WorkCategory } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import ArtworkCard from "@/components/ArtworkCard";
import SeriesTile from "@/components/SeriesTile";
import styles from "./page.module.css";
import type { Metadata } from "next";

const CATEGORY_LABELS: Record<string, string> = {
  tufting: "Hand Tufting",
  embroidery: "Embroidery",
  painting: "Painting",
  photography: "Photography",
  mixed: "Mixed Media",
  handhooking: "Handhooking",
};

const CATEGORY_FILTERS = [
  { key: "all", label: "All" },
  { key: "tufting", label: "Tufting" },
  { key: "embroidery", label: "Embroidery" },
  { key: "painting", label: "Painting" },
  { key: "photography", label: "Photography" },
  { key: "mixed", label: "Mixed Media" },
  { key: "handhooking", label: "Handhooking" },
];

interface PageProps {
  searchParams: Promise<{ view?: string; category?: string }>;
}

export const metadata: Metadata = {
  title: "Fine Art — Original Works",
  description: "Original works by Stine Weirsøe Flamant — hand-tufted textiles, embroidery, paintings, and photography. Unique pieces available on enquiry.",
  openGraph: {
    title: "Fine Art — Original Works by Stine Weirsøe Flamant",
    description: "Unique original works — tufted textiles, embroidery, paintings, and photography. Each piece made by hand in Copenhagen and available on enquiry.",
    images: [{ url: "https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/orange-sun.jpg", width: 1200, height: 900 }],
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
  { id: "mixed",       label: "Mixed Media",   tagline: "Where the mediums stop staying in their lanes — sewn, painted, woven, and assembled objects that don't fit the other categories." },
  { id: "handhooking", label: "Handhooking",   tagline: "A separate technique from tufting — worked in mixed fibres." },
];

const FEATURED_SLUGS = ['orange-sun', 'fuck-alting', 'universe-3', 'taped-objects'];

// Works hidden from the public archive (weak/placeholder shots)
const HIDDEN_SLUGS = ['office-shot'];

// Capped at 6 (2026-07-17, per Sebastian) — dropped Purple Fabric in Garden,
// Seb Livingroom, Long Hair Don't Care. Uses the same tile component as the
// homepage "Browse by Series" strip (SeriesTile), not a bespoke card.
const RECENTLY_ADDED_SLUGS = [
  'yarn', 'smorrebrod', 'you-and-i-and-the-universe', 'wallflower', 'stripes-on-beige', 'green-background',
];

function ViewToggle({ view, category }: { view: 'list' | 'grid'; category: string }) {
  const qs = category !== 'all' ? `&category=${category}` : ''
  return (
    <div className={styles.viewToggle}>
      <Link href={category !== 'all' ? `/fine-art?category=${category}` : '/fine-art'} className={`${styles.viewToggleBtn} ${view === 'list' ? styles.viewToggleBtnActive : ''}`} aria-current={view === 'list' ? 'page' : undefined}>
        List
      </Link>
      <Link href={`/fine-art?view=grid${qs}`} className={`${styles.viewToggleBtn} ${view === 'grid' ? styles.viewToggleBtnActive : ''}`} aria-current={view === 'grid' ? 'page' : undefined}>
        Grid
      </Link>
    </div>
  );
}

// Same control, same URL semantics (`?category=`), in both views — was grid-only before,
// which read as "why does only one view let me filter."
function CategoryFilter({ view, active }: { view: 'list' | 'grid'; active: string }) {
  const base = view === 'grid' ? '/fine-art?view=grid' : '/fine-art'
  const sep = view === 'grid' ? '&' : '?'
  return (
    <div className={styles.gridFilters}>
      {CATEGORY_FILTERS.map(({ key, label }) => (
        <Link
          key={key}
          href={key === "all" ? base : `${base}${sep}category=${key}`}
          className={`${styles.gridFilterBtn} ${active === key ? styles.gridFilterBtnActive : ""}`}
          aria-current={active === key ? 'page' : undefined}
        >
          {label} {key !== "all" ? `(${works.filter((w) => w.category === key).length})` : `(${works.length})`}
        </Link>
      ))}
    </div>
  );
}

export default async function FineArt({ searchParams }: PageProps) {
  const { view: viewParam, category: categoryParam } = await searchParams;
  const view = viewParam === 'grid' ? 'grid' : 'list';
  const active = categoryParam && CATEGORY_LABELS[categoryParam] ? categoryParam : "all";

  const availableCount = works.filter(w => !w.sold).length
  const totalCount = works.length

  // Hero is identical regardless of view/filter — only what's below it changes.
  const hero = (
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
  );

  if (view === 'grid') {
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
          {hero}
          <ViewToggle view="grid" category={active} />
          <CategoryFilter view="grid" active={active} />

          <p className={styles.gridResultCount}>
            {filtered.length} {active === "all" ? "original" : CATEGORY_LABELS[active]?.toLowerCase()} work{filtered.length !== 1 ? "s" : ""} — newest first
          </p>

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

  // Filtered down to the active category — "all" shows every section, same as before.
  const visibleSections = active === "all" ? sections : sections.filter(s => s.id === active);

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artGalleryJsonLd) }} />

      {hero}
      <ViewToggle view="list" category={active} />
      <CategoryFilter view="list" active={active} />

      {active === "all" && heroWork && (
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

      {active === "all" && recentlyAdded.length > 0 && (
        <section className={styles.recentSection}>
          <div className={styles.recentHead}>
            <span className={styles.recentLabel}>Recent additions</span>
            <span className={styles.recentCount}>{recentlyAdded.length} works added</span>
          </div>
          <div className={styles.recentGrid}>
            {recentlyAdded.map((work) => (
              <SeriesTile
                key={work.slug}
                href={`/works/${work.slug}`}
                label={work.title}
                sub={work.year}
                accent="#1A1714"
                imgUrl={work.image}
                sizes="(max-width: 768px) 33vw, 16vw"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Sections ─────────────────────────────────────────── */}
      {visibleSections.map((section) => {
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
