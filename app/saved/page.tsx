import type { Metadata } from 'next'
import SavedContent from '@/components/SavedContent'

export const metadata: Metadata = {
  title: 'Saved',
  description: 'Your saved products from Day In Day In — art prints by Stine Weirsøe Flamant.',
}

export default function SavedPage() {
  return <SavedContent />
}
