import Image from "next/image";
import Link from "next/link";
import { works, getWork } from "@/lib/data";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  return {
    title: work ? `${work.title} — Original Work` : "Work",
    description: work ? `${work.description} Original work by Stine Weirsøe Flamant, ${work.year}.` : undefined,
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

  return (
    <div className={styles.page}>
      <Link href="/fine-art" className={styles.back}>← Fine Art</Link>
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
                <span className={styles.metaKey}>Type</span>
                <span className={styles.metaVal}>Unique original</span>
              </div>
            </div>

            <p className={styles.note}>
              This is a unique original work. Prints of Stine&apos;s designs are available in the{' '}
              <Link href="/shop">shop</Link> from 56 kr.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
