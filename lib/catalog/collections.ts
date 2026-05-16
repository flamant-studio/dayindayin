import type { CatalogCollection } from './types'

export const COLLECTIONS: CatalogCollection[] = [
  {
    id: 'tufted-works',
    handle: 'tufted-works',
    title: 'Tufted Works',
    description: 'Hand-tufted originals reproduced on fine art paper and canvas. Wool, colour, a tufting gun, and hundreds of hours.',
    tags: ['tufting', 'textile', 'handmade', 'wool', 'colourful'],
    sourceFolder: '_KUNST/COLLECTION CURRENT/Tufting',
  },
  {
    id: 'embroidery',
    handle: 'embroidery',
    title: 'Embroidery',
    description: 'Embroidery on fabric. Text, flowers, figures — sometimes political, always honest. Stine uses thread the way others use a pen.',
    tags: ['embroidery', 'textile', 'words', 'feminist', 'flowers'],
    sourceFolder: '_KUNST/COLLECTION CURRENT/Embroidery',
  },
  {
    id: 'paintings',
    handle: 'paintings',
    title: 'Paintings',
    description: 'Paintings on canvas and board. Instinctive, colourful, without apology. Available as fine art prints.',
    tags: ['painting', 'canvas', 'colour', 'original'],
    sourceFolder: '_KUNST/COLLECTION CURRENT/Paintings',
  },
  {
    id: 'photography',
    handle: 'photography',
    title: 'Photography',
    description: 'Studio photography. Still lifes, found objects, moments from the workspace.',
    tags: ['photography', 'studio', 'still-life', 'objects'],
    sourceFolder: '_KUNST/COLLECTION CURRENT/Photography',
  },
  {
    id: 'shero',
    handle: 'shero',
    title: 'Shero',
    description: 'Feminine strength. Portraits and declarations. Not delicate — powerful.',
    tags: ['shero', 'feminist', 'women', 'portrait', 'strength'],
    sourceFolder: '_KUNST/COLLECTION CURRENT/Shero',
  },
  {
    id: 'mixed',
    handle: 'mixed',
    title: 'Mixed Works',
    description: 'Collage, objects, experiments. Work that does not fit anywhere else, which is exactly where it belongs.',
    tags: ['mixed', 'collage', 'objects', 'experimental'],
    sourceFolder: '_KUNST/COLLECTION CURRENT/Mixed',
  },
  {
    id: 'archive',
    handle: 'archive',
    title: 'Archive',
    description: 'Early works. The beginning of everything. Available as prints for the first time.',
    tags: ['archive', 'early-work', 'historic', 'limited'],
    sourceFolder: '_KUNST/COLLECTION ARCHIVES/ArkivVærker',
  },
  {
    id: 'new-in',
    handle: 'new-in',
    title: 'New In',
    description: 'The latest from the studio.',
    tags: ['new', 'latest', 'fresh'],
    sourceFolder: '',
  },
]

export const COLLECTION_COUNT = COLLECTIONS.length
