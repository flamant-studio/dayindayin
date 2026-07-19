import { getProductsByTitleKeyword, type NormalizedProduct } from '@/lib/shopify/products'
import { MOTIFS } from '@/lib/motifs'
import SeriesTile from '@/components/SeriesTile'
import ProductCard from '@/components/ProductCard'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Shop by Motif',
  description: 'Every recurring subject in Stine Weirsøe Flamant\'s work, gathered in one place — SHERO, NEKO, the masks, the rabbits, Tourism, and more.',
  alternates: { canonical: '/motifs' },
}

export const revalidate = 300

async function getMotifProducts() {
  const keywordCache = new Map<string, Promise<NormalizedProduct[]>>()
  const fetchByKeyword = (keyword: string) => {
    if (!keywordCache.has(keyword)) {
      keywordCache.set(keyword, getProductsByTitleKeyword(keyword, 40).catch(() => []))
    }
    return keywordCache.get(keyword)!
  }

  const results = await Promise.all(
    MOTIFS.map(async (motif) => {
      if (motif.fineArtOnly || !motif.keyword || !motif.match) {
        return { motif, products: [] as NormalizedProduct[] }
      }
      const candidates = await fetchByKeyword(motif.keyword)
      const products = candidates.filter((p) => motif.match!(p.title))
      return { motif, products }
    })
  )
  return results
}

export default async function MotifsPage() {
  const motifResults = await getMotifProducts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shop by Motif — Day In Day In',
    description: metadata.description,
    url: 'https://dayindayin.dk/motifs',
    hasPart: MOTIFS.map((m) => ({
      '@type': 'CreativeWork',
      name: m.name,
      url: `https://dayindayin.dk/motifs#${m.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.page}>
        <div className={styles.header}>
          <span className={styles.headerLabel}>Shop by motif</span>
          <h1 className={styles.title}>Every subject, in one place</h1>
          <p className={styles.sub}>
            Stine returns to the same handful of subjects again and again — a cat&apos;s paw, a mask,
            a woman refusing to look away. Each one below is a thread through the whole body of work.
          </p>
        </div>

        <div className={styles.jumpGrid}>
          {motifResults.map(({ motif, products }) => (
            <SeriesTile
              key={motif.slug}
              href={motif.fineArtOnly ? motif.fineArtHref! : `#${motif.slug}`}
              label={motif.name}
              sub={
                motif.fineArtOnly
                  ? 'Original — not yet a print'
                  : `${products.length} product${products.length !== 1 ? 's' : ''}`
              }
              accent={motif.accent}
              imgUrl={motif.image}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ))}
        </div>

        {motifResults.map(({ motif, products }) => (
          <section key={motif.slug} id={motif.slug} className={styles.motifSection}>
            <div className={styles.motifHead} style={{ borderColor: motif.accent }}>
              <h2 className={styles.motifTitle}>{motif.name}</h2>
              {motif.fineArtOnly ? (
                <p className={styles.motifSub}>Original work — not yet available as a print.</p>
              ) : (
                products[0]?.description && (
                  <p className={styles.motifSub}>{products[0].description}</p>
                )
              )}
            </div>

            {motif.fineArtOnly ? (
              <Link href={motif.fineArtHref!} className={styles.fineArtCard}>
                <div className={styles.fineArtImg}>
                  <Image src={motif.image} alt={motif.name} fill sizes="(max-width: 768px) 100vw, 480px" style={{ objectFit: 'cover' }} />
                </div>
                <span className={styles.fineArtCta}>See the original work →</span>
              </Link>
            ) : products.length > 0 ? (
              <div className={styles.productGrid}>
                {products.map((p) => (
                  <ProductCard key={p.handle} product={p} />
                ))}
              </div>
            ) : (
              <p className={styles.emptyNote}>Nothing live for this motif yet.</p>
            )}
          </section>
        ))}
      </div>
    </>
  )
}
