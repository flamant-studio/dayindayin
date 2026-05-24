'use client'
import { useState, useEffect } from 'react'
import { getCurrency, type Currency } from './CurrencyToggle'

const RATES: Record<Currency, number> = { DKK: 1, EUR: 0.134, GBP: 0.115 }
const SYMBOLS: Record<Currency, string> = { DKK: 'kr', EUR: '€', GBP: '£' }

interface Props { dkk: number }

export default function CurrencyPrice({ dkk }: Props) {
  const [currency, setCurrency] = useState<Currency>('DKK')

  useEffect(() => {
    setCurrency(getCurrency())
    const handler = (e: Event) => setCurrency((e as CustomEvent<Currency>).detail)
    window.addEventListener('currency-change', handler)
    return () => window.removeEventListener('currency-change', handler)
  }, [])

  const converted = Math.round(dkk * RATES[currency])
  const sym = SYMBOLS[currency]
  return <>{currency === 'DKK' ? `${converted} ${sym}` : `${sym}${converted}`}</>
}
