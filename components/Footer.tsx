import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <Link href="/fine-art">Art Gallery</Link>
        <Link href="/art-journal">Art Journal</Link>
        <Link href="/about">Bio</Link>
        <Link href="/practical">Practical</Link>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </nav>
      <p className={styles.copy}>
        All art and photos by Stine Weirsøe Flamant. Please don&apos;t reproduce without authorisation.
      </p>
    </footer>
  );
}
