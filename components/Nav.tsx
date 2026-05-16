"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>Day In Day In</Link>

      <button
        className={styles.menuToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      <ul className={`${styles.links} ${mobileOpen ? styles.open : ""}`}>
        <li className={styles.dropdown}>
          <Link href="/fine-art">Fine Art</Link>
          <ul className={styles.dropdownMenu}>
            <li><Link href="/fine-art#tufting" onClick={() => setMobileOpen(false)}>Tufting</Link></li>
            <li><Link href="/fine-art#embroidery" onClick={() => setMobileOpen(false)}>Embroidery</Link></li>
            <li><Link href="/fine-art#painting" onClick={() => setMobileOpen(false)}>Painting</Link></li>
            <li><Link href="/fine-art#photography" onClick={() => setMobileOpen(false)}>Photography</Link></li>
          </ul>
        </li>
        <li><Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link></li>
        <li><Link href="/art-journal" onClick={() => setMobileOpen(false)}>Art Journal</Link></li>
        <li><Link href="/archive" onClick={() => setMobileOpen(false)}>Archive</Link></li>
        <li><Link href="/about" onClick={() => setMobileOpen(false)}>Bio</Link></li>
        <li><Link href="/practical" onClick={() => setMobileOpen(false)}>Practical</Link></li>
      </ul>
    </nav>
  );
}
