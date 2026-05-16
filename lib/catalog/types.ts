// Shared TypeScript types for the DayInDayIn product catalog

export type ProductFormat =
  | 'fine-art-print-a4'
  | 'poster-30x45'
  | 'canvas-30x40'
  | 'framed-print-30x40'
  | 'wall-hanging-70x100'
  | 'mug-11oz'
  | 'tote-bag'

export type ProductGrade = 'A' | 'B' | 'C' | 'D'

export type ProductCategory =
  | 'tufting'
  | 'embroidery'
  | 'painting'
  | 'photography'
  | 'mixed'
  | 'archive'

export interface CatalogCollection {
  id: string
  handle: string
  title: string
  description: string
  tags: string[]
  sourceFolder: string // Dropbox path
}

export interface CatalogProduct {
  did: string // DID-T-028 etc
  title: string
  handle: string // Shopify URL handle
  description: string
  collectionId: string
  format: ProductFormat
  grade: ProductGrade
  sourceFile: string // Dropbox path to image
  gelatoProductUid: string // placeholder until Gelato is connected
  priceKr: number
  tags: string[]
}

export interface GelatoFormatMap {
  productUid: string
  description: string
  orientation: 'ver' | 'hor' | 'both'
}
