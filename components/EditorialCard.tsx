import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/data'
import styles from './EditorialCard.module.css'

/**
 * The one editorial/post card (journal). 3:2 image, date (+ optional read
 * time), title, excerpt. See DESIGN_SYSTEM.md › Cards.
 */
export default function EditorialCard({
  post,
  sizes = '(max-width: 768px) 100vw, 33vw',
  showReadTime = false,
}: {
  post: BlogPost
  sizes?: string
  showReadTime?: boolean
}) {
  const date = new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
  let meta = date
  if (showReadTime) {
    const words = post.body ? post.body.join(' ').split(/\s+/).length : post.excerpt.split(/\s+/).length
    const mins = Math.max(1, Math.round(words / 200))
    meta = `${date} · ${mins} min read`
  }

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        <Image src={post.image} alt={post.title} fill sizes={sizes} className={styles.cardImg} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.date}>{meta}</span>
        <span className={styles.cardTitle}>{post.title}</span>
        <span className={styles.excerpt}>{post.excerpt}</span>
      </div>
    </Link>
  )
}
