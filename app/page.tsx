import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ContactForm from "@/components/ContactForm";
import { getProducts, formatPrice } from "@/lib/shopify/products";

const BLOB_BASE = "https://29kekabbrd49avje.public.blob.vercel-storage.com";

const categories = [
  { slug: "tufting", label: "Hand Tufting", tagline: "Cosmos, Christmas, rainbows and everything in between", image: `${BLOB_BASE}/tufting/hero.jpg` },
  { slug: "embroidery", label: "Embroidery", tagline: "Powerful flowers, powerful words", image: `${BLOB_BASE}/embroidery/hero.jpg` },
  { slug: "painting", label: "Paintings", tagline: "Flora and fauna of the colourful universe", image: `${BLOB_BASE}/painting/hero.jpg` },
  { slug: "photography", label: "Photography", tagline: "Inside and outside the DayinDayin world, one minute at a time", image: `${BLOB_BASE}/photography/hero.jpg` },
];

export default async function Home() {
  const featuredProducts = await getProducts(4).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroName}>Stine Weirsøe Flamant</h1>
        <p className={styles.heroTagline}>Contemporary artist in a love affair with embroidery and hand tufting</p>
        <h2 className={styles.heroHeading}>Contemporary art objects from the feminine realm</h2>
      </section>

      <section className={styles.grid}>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/fine-art#${cat.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={cat.image} alt={cat.label} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
            <div className={styles.cardBody}>
              <h3>{cat.label}</h3>
              <p>{cat.tagline}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className={styles.intro}>
        <div className={styles.introText}>
          <p>We all have <em>superpowers</em>. Mine is making something out of nothing. Colour is the fabric of my entire being. I am curious about <em>&ldquo;the human condition&rdquo;</em>. How to be human in these strange times.</p>
          <p><em>My disability</em> (chronic autoimmune pain syndrome) and my personal history is the canvas for every artwork I create. I consider myself an outsider artist.</p>
          <p>I am a textile artist involved in <em>a love affair</em> with embroidery and hand tufting. Slowly and gently, my artistic voice sounds more and more familiar to me.</p>
          <Link href="/about" className={styles.cta}>Full story</Link>
        </div>
        <div className={styles.introImage}>
          <Image src={`${BLOB_BASE}/profile/stine.jpg`} alt="Stine Weirsøe Flamant" width={480} height={600} style={{ objectFit: "cover" }} />
        </div>
      </section>

      <section className={styles.shopSection}>
        <div className={styles.shopHeader}>
          <h2 className={styles.shopTitle}>Shop</h2>
          <Link href="/shop" className={styles.shopViewAll}>All products &rarr;</Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className={styles.shopGrid}>
            {featuredProducts.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.shopCard}>
                <div className={styles.shopCardImage}>
                  {p.firstImage ? (
                    <Image
                      src={p.firstImage.url}
                      alt={p.firstImage.altText ?? p.title}
                      fill
                      sizes="(max-width: 600px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className={styles.shopCardPlaceholder} />
                  )}
                </div>
                <div className={styles.shopCardInfo}>
                  <span className={styles.shopCardTitle}>{p.title}</span>
                  <span className={styles.shopCardPrice}>{formatPrice(p.minPrice.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.shopEmpty}>
            <p>The shop is being stocked. Art prints, canvases, mugs, and totes coming soon.</p>
            <Link href="/shop" className={styles.cta}>Go to shop</Link>
          </div>
        )}
      </section>

      <section className={styles.contact}>
        <h2>Want to get in touch? Drop me a line!</h2>
        <p>Allow a few days for a response. Due to my disability, I ask for your understanding.</p>
        <ContactForm />
      </section>
    </>
  );
}
