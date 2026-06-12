'use client'
import { useState } from 'react'
import styles from './SizeGuide.module.css'

interface Variant {
  title: string
}

interface Props {
  variants: Variant[]
}

const ALL_ROWS = [
  { size: 'A4',      cm: '21 × 29.7',   inches: '8.3 × 11.7',   approx: 'magazine page' },
  { size: 'A3',      cm: '29.7 × 42',   inches: '11.7 × 16.5',  approx: 'large magazine' },
  { size: 'A2',      cm: '42 × 59.4',   inches: '16.5 × 23.4',  approx: 'half a door' },
  { size: '30×30',   cm: '30 × 30',     inches: '11.8 × 11.8',  approx: 'vinyl record' },
  { size: '40×40',   cm: '40 × 40',     inches: '15.7 × 15.7',  approx: '—' },
  { size: '70×70',   cm: '70 × 70',     inches: '27.6 × 27.6',  approx: 'large canvas' },
]

function matchesVariant(row: (typeof ALL_ROWS)[0], titles: string[]): boolean {
  const combined = titles.join(' ').toLowerCase()
  if (row.size === 'A4')    return combined.includes('a4')
  if (row.size === 'A3')    return combined.includes('a3')
  if (row.size === 'A2')    return combined.includes('a2')
  if (row.size === '30×30') return combined.includes('30')
  if (row.size === '40×40') return combined.includes('40')
  if (row.size === '70×70') return combined.includes('70')
  return false
}

export default function SizeGuide({ variants }: Props) {
  const [open, setOpen] = useState(false)

  const titles = variants.map((v) => v.title)
  const matched = ALL_ROWS.filter((row) => matchesVariant(row, titles))

  // Only show size guide for products with recognisable print sizes (A4/A3/etc.)
  // Mugs, tank tops, totes have no matching rows — don't show a misleading guide.
  if (matched.length === 0) return null

  const rows = matched

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Size guide {open ? '↑' : '↓'}
      </button>

      <div className={`${styles.tableWrap} ${open ? styles.open : ''}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Size</th>
              <th>cm</th>
              <th>inches</th>
              <th>approx.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size}>
                <td>{row.size}</td>
                <td>{row.cm}</td>
                <td>{row.inches}</td>
                <td className={styles.approx}>{row.approx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
