'use client'
import { useProduct } from '@/contexts/ProductContext'

interface Props {
  initialPrice: string
  className?: string
}

export default function SelectedPrice({ initialPrice, className }: Props) {
  const { selectedPrice } = useProduct()
  return <p className={className}>{selectedPrice ?? initialPrice}</p>
}
