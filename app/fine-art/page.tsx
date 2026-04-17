import Image from "next/image";
import Link from "next/link";
import { works, WorkCategory } from "@/lib/data";
import styles from "./page.module.css";

export const metadata = { title: "Fine Art — Day In Day In" };

const sections: { id: WorkCategory; label: string; tagline: string }[] = [
  { id: "tufting", label: "Hand Tufting", tagline: "Cosmos, Christmas, rainbows and everything in between" },
  { id: "embroidery", label: "Embroidery", tagline: "Powerful flowers, powerful words" },
  { id: "painting", label: "Paintings", tagline: "Flora and fauna of the colourful universe" },
  { id: "photography", label: "Photography", tagline: "Inside and outside the DayinDayin world, one minute at a time" },
];

export default function FineArt() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Fine Art</h1>
      </section>

      {sections.map((section) => {
        const categoryWorks = works.filter((w) => w.category === section.id);
        return (
          <section key={section.id} id={section.id} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>{section.label}</h2>
              <p>{section.tagline}</p>
            </div>
            <div className={styles.grid}>
              {categoryWorks.map((work) => (
                <Link key={work.slug} href={`/works/${work.slug}`} className={styles.card}>
                  <div className={styles.cardImage}>
                    <Image src={work.image} alt={work.title} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: "cover" }} />
                  </div>
                  <p className={styles.cardTitle}>{work.title}</p>
                  <p className={styles.cardYear}>{work.year}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
