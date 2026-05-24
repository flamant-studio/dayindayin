'use client'
import { useState, useEffect } from 'react'
import styles from './CurrencyToggle.module.css'

const CURRENCIES = ['DKK', 'EUR', 'GBP'] as const
export type Currency = typeof CURRENCIES[number]
const STORAGE_KEY = 'did_currency'

export function getCurrency(): Currency {
  if (typeof window === 'undefined') return 'DKK'
  return (localStorage.getItem(STORAGE_KEY) as Currency) ?? 'DKK'
}

export function setCurrencyPreference(c: Currency) {
  localStorage.setItem(STORAGE_KEY, c)
  window.dispatchEvent(new CustomEvent('currency-change', { detail: c }))
}

export default function CurrencyToggle() {
  const [currency, setCurrencyState] = useState<Currency>('DKK')

  useEffect(() => {
    setCurrencyState(getCurrency())
    const handler = (e: Event) => setCurrencyState((e as CustomEvent<Currency>).detail)
    window.addEventListener('currency-change', handler)
    return () => window.removeEventListener('currency-change', handler)
  }, [])

  return (
    <div className={styles.toggle} role="group" aria-label="Currency">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          className={`${styles.btn} ${currency === c ? styles.active : ''}`}
          onClick={() => { setCurrencyPreference(c); setCurrencyState(c) }}
          aria-pressed={currency === c}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
