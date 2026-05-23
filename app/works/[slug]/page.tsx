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
  return { title: work ? work.title : "Work" };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <div className={styles.page}>
      <Link href="/fine-art" className={styles.back}>← Back to Fine Art</Link>
      <div className={styles.layout}>
        <div className={styles.image}>
          <Image src={work.image} alt={work.title} width={800} height={900} style={{ objectFit: "cover", width: "100%", height: "auto" }} />
        </div>
        <div className={styles.info}>
          <p className={styles.category}>{work.category}</p>
          <h1>{work.title}</h1>
          <p className={styles.year}>{work.year}</p>
          <p className={styles.description}>{work.description}</p>
        </div>
      </div>
    </div>
  );
}
