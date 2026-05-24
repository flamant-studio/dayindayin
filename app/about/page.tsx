import Image from "next/image";
import styles from "./page.module.css";

const BLOB_BASE = "https://29kekabbrd49avje.public.blob.vercel-storage.com";

export const metadata = {
  title: "Bio",
  description: "About Stine Weirsøe Flamant — artist, tufter, embroiderer, photographer. And about Sebastian, who built the studio.",
};

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Stine Weirsøe Flamant</h1>
        <p className={styles.sub}>Contemporary artist · Copenhagen</p>
      </section>

      <section className={styles.bio}>
        <div className={styles.image}>
          <Image
            src={`${BLOB_BASE}/profile/stine.jpg`}
            alt="Stine Weirsøe Flamant"
            width={520}
            height={650}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
        <div className={styles.text}>
          <p>
            We all have <em>superpowers</em>. Mine is making something out of nothing.
            Colour is the fabric of my entire being. I am curious about &ldquo;the human
            condition&rdquo; — how to be human in these strange times, and what humanity
            looks like when you observe from the edges or from deep within.
          </p>
          <p>
            My disability (chronic autoimmune pain syndrome) and my personal history
            is the canvas for every artwork I create. I consider myself an outsider artist.
          </p>
          <p>
            Sometimes my art is literal — working with words and sentences taken from
            what I see and read, enlarging them on embroidery fabric. Sometimes the
            political aspect is more subtle or more personal.
          </p>
          <p>
            I am a textile artist involved in a love affair with embroidery and hand
            tufting. Slowly and gently, my artistic voice sounds more and more familiar
            to me.
          </p>
        </div>
      </section>

      <section className={styles.bio} style={{ borderTop: "1px solid #e2e2e2", paddingTop: "4rem" }}>
        <div className={styles.image}>
          <div style={{ background: "#f5f3f0", height: "400px" }} />
        </div>
        <div className={styles.text}>
          <h2 style={{ fontWeight: 300, fontSize: "1.5rem", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Sebastian Weirsøe Flamant
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Studio
          </p>
          <p>
            I built this. The site, the shop, the infrastructure. I&apos;m Stine&apos;s
            partner, and I run the studio side of Day In Day In under our company,
            Flamant Tekst &amp; Design.
          </p>
          <p>
            My day job is Head of Ecommerce at Organic Basics. I use that experience
            here — but the motivation is different. This is not a marketing project.
            It&apos;s a way to make Stine&apos;s work available to people who would genuinely
            want it on their walls.
          </p>
          <p>
            The shop runs on Shopify, fulfilled by Gelato, built on Next.js. The work
            is Stine&apos;s. I just make sure it can reach you.
          </p>
        </div>
      </section>
    </div>
  );
}
