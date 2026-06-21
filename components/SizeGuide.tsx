'use client'
import { useState } from 'react'
import styles from './SizeGuide.module.css'

interface Variant {
  title: string
}

interface Props {
  variants: Variant[]
  productType?: string
}

const ALL_ROWS = [
  { size: 'A4',    cm: '21 × 29.7',   outerCm: '25.5 × 34.2', inches: '8.3 × 11.7',   approx: 'desk or bedside' },
  { size: 'A3',    cm: '29.7 × 42',   outerCm: '34.2 × 46.5', inches: '11.7 × 16.5',  approx: 'compact wall piece' },
  { size: 'A2',    cm: '42 × 59.4',   outerCm: '46.5 × 63.9', inches: '16.5 × 23.4',  approx: 'statement print' },
  { size: 'A1',    cm: '59.4 × 84.1', outerCm: '63.9 × 88.6', inches: '23.4 × 33.1',  approx: 'large wall piece' },
  { size: '30×30', cm: '30 × 30',     outerCm: '',             inches: '11.8 × 11.8',  approx: 'vinyl record size' },
  { size: '40×40', cm: '40 × 40',     outerCm: '',             inches: '15.7 × 15.7',  approx: '—' },
  { size: '70×70', cm: '70 × 70',     outerCm: '',             inches: '27.6 × 27.6',  approx: 'large canvas' },
]

function matchesVariant(row: (typeof ALL_ROWS)[0], titles: string[]): boolean {
  const combined = titles.join(' ').toLowerCase()
  if (row.size === 'A4')    return combined.includes('a4')
  if (row.size === 'A3')    return combined.includes('a3')
  if (row.size === 'A2')    return combined.includes('a2')
  if (row.size === 'A1')    return combined.includes('a1')
  if (row.size === '30×30') return combined.includes('30')
  if (row.size === '40×40') return combined.includes('40')
  if (row.size === '70×70') return combined.includes('70')
  return false
}

export default function SizeGuide({ variants, productType }: Props) {
  const [open, setOpen] = useState(false)

  const titles = variants.map((v) => v.title)
  const matched = ALL_ROWS.filter((row) => matchesVariant(row, titles))

  if (matched.length === 0) return null

  const isFramed = productType === 'Framed Print'

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
        <div className={styles.tableInner}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Size</th>
                <th>{isFramed ? 'Print (cm)' : 'cm'}</th>
                {isFramed && <th>Frame outer (cm)</th>}
                <th>inches</th>
                <th>approx.</th>
              </tr>
            </thead>
            <tbody>
              {matched.map((row) => (
                <tr key={row.size}>
                  <td>{row.size}</td>
                  <td>{row.cm}</td>
                  {isFramed && <td>{row.outerCm || '—'}</td>}
                  <td>{row.inches}</td>
                  <td className={styles.approx}>{row.approx}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isFramed && (
            <p className={styles.frameNote}>Frame outer dimensions are approximate. Frame molding: 20 mm wide, available in black, white, and natural wood.</p>
          )}
        </div>
      </div>
    </div>
  )
}
