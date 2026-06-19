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
    images: [{ url: "https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/neko-cat-orange.jpg", width: 1200, height: 900 }],
  },
  alternates: { canonical: "/fine-art" },
};

const sections: { id: WorkCategory; label: string; tagline: string; note?: string }[] = [
  { id: "tufting", label: "Hand Tufting", tagline: "Each piece takes days — the pile height, density, and texture chosen entirely by hand. No two are alike." },
  { id: "embroidery", label: "Embroidery", tagline: "Needle and thread on canvas and linen. Where the work started and where it keeps returning." },
  { id: "painting", label: "Paintings", tagline: "Acrylic and oil stick on canvas, worked on the studio floor. Layers built up and scraped back over multiple sessions." },
  { id: "photography", label: "Photography", tagline: "Shot on location across Denmark and beyond. Stillness, observation, the moment just after.", note: "Archival inkjet prints on museum-grade paper. Shot on film and digital. All photography prints are available as limited editions — enquire for edition size and pricing." },
];

export default function FineArt() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroLabel}>Original Works</span>
        <h1>Fine Art</h1>
        <p className={styles.heroSub}>
          These are the originals — unique pieces made by hand in Stine&apos;s Copenhagen studio.
          Not prints. Not reproductions. Each one exists once.
        </p>
        <Link href="/archive" className={styles.heroArchiveLink}>
          View all {works.length} works →
        </Link>
      </section>

      {/* ── Category nav ──────────────────────────────────────── */}
      <nav className={styles.catNav}>
        {sections.map((s) => {
          const count = works.filter((w) => w.category === s.id).length
          return (
            <a key={s.id} href={`#${s.id}`} className={styles.catNavLink}>
              {s.label} <span className={styles.catNavCount}>{count}</span>
            </a>
          )
        })}
      </nav>

      {/* ── Distinction banner ─────────────────────────────────── */}
      <div className={styles.distinctionBanner}>
        <div className={styles.distinctionBlock}>
          <span className={styles.distinctionLabel}>Original Fine Art</span>
          <p className={styles.distinctionText}>
            Unique pieces — tufting, embroidery, paintings, photography. Available on enquiry. Priced individually.
          </p>
          <span className={styles.distinctionTag}>You are here</span>
        </div>
        <div className={styles.distinctionDivider} />
        <div className={styles.distinctionBlock}>
          <span className={styles.distinctionLabel}>Print Shop</span>
          <p className={styles.distinctionText}>
            High-quality prints of Stine&apos;s work, printed on demand by Gelato. Ships across Europe. From 56 kr.
          </p>
          <Link href="/shop" className={styles.distinctionLink}>Go to the shop →</Link>
        </div>
      </div>

      {sections.map((section) => {
        const categoryWorks = works.filter((w) => w.category === section.id);
        return (
          <section key={section.id} id={section.id} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>{section.label} <span className={styles.sectionCount}>({categoryWorks.length})</span></h2>
              <p>{section.tagline}</p>
              {section.note && <p className={styles.sectionNote}>{section.note}</p>}
            </div>
            <div className={styles.grid}>
              {categoryWorks.map((work) => (
                <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
                  <div className={styles.cardImage}>
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardEnquire}>Enquire →</span>
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <p className={styles.cardTitle}>{work.title}</p>
                    <p className={styles.cardYear}>{work.year}</p>
                  </div>
                  <p className={styles.cardAvail}>Original — available on enquiry</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* ── Enquiry CTA ────────────────────────────────────────── */}
      <section className={styles.enquiryCta}>
        <span className={styles.enquiryCtaLabel}>Collecting original work</span>
        <h2>Each piece exists once.</h2>
        <p>
          If something catches you, reach out. Stine responds directly. She also takes commissions —
          embroidery, tufting, painting — when she has the space for it. Tell her the size,
          the context, and your budget. She will say yes or no.
        </p>
        <Link href="/contact?subject=Fine%20Art%20enquiry" className={styles.enquiryBtn} aria-label="Send an enquiry about original fine art">Send an enquiry →</Link>
      </section>
    </div>
  );
}
