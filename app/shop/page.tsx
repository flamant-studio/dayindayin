import Image from 'next/image'
import Link from 'next/link'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import styles from './page.module.css'

export const metadata = {
  title: 'Shop — Day In Day In',
  description:
    'Art prints, canvases, mugs, and totes. Original works by Stine Weirsøe Flamant. Printed by Gelato, shipped to EU, UK, and Norway.',
}

export default async function ShopPage() {
  const products = await getProducts().catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Shop</h1>
        <p className={styles.subtitle}>
          Art prints, canvases, mugs, and totes. All prints are Stine&apos;s own work.
          Fulfilled by Gelato — printed and shipped to order. Ships to EU, UK, and Norway
          within 3–7 business days.
        </p>
      </header>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Coming soon</h2>
          <p className={styles.emptyText}>
            The shop is being stocked. Follow along or check back shortly — the
            first products will be up soon.
          </p>
          <Link href="/fine-art" className={styles.emptyCta}>
            See the artwork first
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
              <div className={styles.imageWrap}>
                {p.firstImage ? (
                  <Image
                    src={p.firstImage.url}
                    alt={p.firstImage.altText ?? p.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.productTitle}>{p.title}</span>
                <span className={styles.price}>{formatPrice(p.minPrice.amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
