/**
 * DayInDayIn — full product catalog, 285 SKUs.
 *
 * Structure: each artwork has multiple format variants (different product records).
 * DID = artwork ID. handle = Shopify URL handle (artwork-id + format suffix).
 *
 * Gelato UIDs are correct for standard formats. Framed print UID is a placeholder
 * pending Gelato connection — update when confirmed.
 *
 * Prices in DKK (confirmed, 2026-05-16).
 */

import type { CatalogProduct } from './types'

// Gelato UIDs (from mikofu project, verified DK catalog 2026-05-15)
const G = {
  A4:      'cards_pf_a4_pt_250-gsm-coated-silk_cl_4-0_ver',
  P30x45:  'flat_300x450-mm-12x18-inch_200-gsm-80lb-uncoated_4-0_ver',
  C30x40:  'canvas_300x400-mm-12x16-inch_canvas_wood-fsc-slim_4-0_ver',
  F30x40:  'framed_300x400-mm-12x16-inch_fine-art_matte-white_4-0_ver', // placeholder — confirm with Gelato
  WH70x100:'wall_hanging_poster_1010-mm_black_wood_w14xt20-mm_28x40-inch-700x1000-mm_200-gsm-80lb-uncoated_4-0_ver',
  MUG:     'mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0',
  TOTE:    'bag_product_bsc_tote-bag_bqa_clc_bsi_std-t_bco_black_bpr_4-0',
}

// Price map in DKK
const PRICE = {
  A4: 149,
  P30x45: 299,
  C30x40: 495,
  F30x40: 695,
  WH70x100: 895,
  MUG: 199,
  TOTE: 299,
}

function desc(title: string, medium: string, substrate: string): string {
  return `Art print of ${title} by Stine Weirsøe Flamant. ${medium}. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`
}

// Helper to build variants for a given artwork
function prints(
  did: string,
  baseHandle: string,
  title: string,
  collectionId: string,
  medium: string,
  sourceFile: string,
  tags: string[],
  formats: Array<keyof typeof G> = ['A4', 'P30x45', 'C30x40', 'F30x40', 'WH70x100']
): CatalogProduct[] {
  const substrates: Record<keyof typeof G, string> = {
    A4: '250gsm coated silk paper (A4)',
    P30x45: '200gsm uncoated paper (30×45cm)',
    C30x40: 'gallery-wrap canvas (30×40cm)',
    F30x40: 'fine art paper in a matte white frame (30×40cm)',
    WH70x100: '200gsm uncoated paper with black wood hanging rod (70×100cm)',
    MUG: 'a white ceramic mug (11oz)',
    TOTE: 'a black cotton tote bag',
  }
  const formatNames: Record<keyof typeof G, string> = {
    A4: 'fine-art-print-a4',
    P30x45: 'poster-30x45',
    C30x40: 'canvas-30x40',
    F30x40: 'framed-print-30x40',
    WH70x100: 'wall-hanging-70x100',
    MUG: 'mug-11oz',
    TOTE: 'tote-bag',
  }
  const handleSuffixes: Record<keyof typeof G, string> = {
    A4: 'a4-print',
    P30x45: 'poster',
    C30x40: 'canvas',
    F30x40: 'framed',
    WH70x100: 'wall-hanging',
    MUG: 'mug',
    TOTE: 'tote',
  }
  return formats.map((fmt) => ({
    did,
    title: `${title} — ${fmt === 'MUG' ? 'Mug' : fmt === 'TOTE' ? 'Tote Bag' : fmt === 'A4' ? 'A4 Print' : fmt === 'P30x45' ? 'Poster 30×45' : fmt === 'C30x40' ? 'Canvas 30×40' : fmt === 'F30x40' ? 'Framed Print 30×40' : 'Wall Hanging 70×100'}`,
    handle: `${baseHandle}-${handleSuffixes[fmt]}`,
    description: desc(title, medium, substrates[fmt]),
    collectionId,
    format: formatNames[fmt] as CatalogProduct['format'],
    grade: 'A' as const,
    sourceFile,
    gelatoProductUid: G[fmt],
    priceKr: PRICE[fmt],
    tags: [...tags, formatNames[fmt]],
  }))
}

function mugsAndTotes(
  did: string,
  baseHandle: string,
  title: string,
  collectionId: string,
  medium: string,
  sourceFile: string,
  tags: string[]
): CatalogProduct[] {
  return prints(did, baseHandle, title, collectionId, medium, sourceFile, tags, ['MUG', 'TOTE'])
}

// ─── NEKO series — 8 artworks × 5 formats = 40 products ─────────────────────

const nekoTags = ['neko', 'cat', 'illustration', 'bold', 'colourful']
const nekoMedium = 'Mixed media illustration'

const neko: CatalogProduct[] = [
  ...prints('DID-T-001', 'neko-cosmos-cat', 'Cosmos Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-001', nekoTags),
  ...prints('DID-T-002', 'neko-rainbow-cat', 'Rainbow Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-002', nekoTags),
  ...prints('DID-T-003', 'neko-moon-cat', 'Moon Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-003', nekoTags),
  ...prints('DID-T-004', 'neko-red-cat', 'Red Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-004', nekoTags),
  ...prints('DID-T-005', 'neko-blue-cat', 'Blue Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-005', nekoTags),
  ...prints('DID-T-006', 'neko-golden-cat', 'Golden Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-006', nekoTags),
  ...prints('DID-T-007', 'neko-disco-cat', 'Disco Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-007', nekoTags),
  ...prints('DID-T-008', 'neko-sleeping-cat', 'Sleeping Cat', 'neko', nekoMedium, '_KUNST/Collection CURRENT/Tufting/NEKO/DID-T-008', nekoTags),
]

// ─── SHERO series — 6 artworks × 5 formats = 30 products ────────────────────

const sheroTags = ['shero', 'feminist', 'women', 'portrait', 'hero']
const sheroMedium = 'Mixed media, embroidery and painting'

const shero: CatalogProduct[] = [
  ...prints('DID-E-001', 'shero-warrior', 'The Warrior', 'shero', sheroMedium, '_KUNST/Collection CURRENT/Shero/DID-E-001', sheroTags),
  ...prints('DID-E-002', 'shero-dreamer', 'The Dreamer', 'shero', sheroMedium, '_KUNST/Collection CURRENT/Shero/DID-E-002', sheroTags),
  ...prints('DID-E-003', 'shero-healer', 'The Healer', 'shero', sheroMedium, '_KUNST/Collection CURRENT/Shero/DID-E-003', sheroTags),
  ...prints('DID-E-004', 'shero-creator', 'The Creator', 'shero', sheroMedium, '_KUNST/Collection CURRENT/Shero/DID-E-004', sheroTags),
  ...prints('DID-E-005', 'shero-wild-one', 'The Wild One', 'shero', sheroMedium, '_KUNST/Collection CURRENT/Shero/DID-E-005', sheroTags),
  ...prints('DID-E-006', 'shero-elder', 'The Elder', 'shero', sheroMedium, '_KUNST/Collection CURRENT/Shero/DID-E-006', sheroTags),
]

// ─── Tufted Works — 6 artworks × 5 formats = 30 products ────────────────────

const tuftingTags = ['tufting', 'textile', 'handmade', 'wool', 'bold']

const tufting: CatalogProduct[] = [
  ...prints('DID-T-009', 'tufting-cosmos-rug', 'Cosmos', 'tufted-works', 'Hand tufted wool', '_KUNST/Collection CURRENT/Tufting/DID-T-009', tuftingTags),
  ...prints('DID-T-010', 'tufting-christmas-rug', 'Christmas', 'tufted-works', 'Hand tufted wool', '_KUNST/Collection CURRENT/Tufting/DID-T-010', tuftingTags),
  ...prints('DID-T-011', 'tufting-rainbow-rug', 'Rainbow', 'tufted-works', 'Hand tufted wool', '_KUNST/Collection CURRENT/Tufting/DID-T-011', tuftingTags),
  ...prints('DID-T-012', 'tufting-flower-rug', 'Flower Field', 'tufted-works', 'Hand tufted wool', '_KUNST/Collection CURRENT/Tufting/DID-T-012', tuftingTags),
  ...prints('DID-T-013', 'tufting-garden-rug', 'Garden', 'tufted-works', 'Hand tufted wool', '_KUNST/Collection CURRENT/Tufting/DID-T-013', tuftingTags),
  ...prints('DID-T-014', 'tufting-abstract-rug', 'Abstract No. 1', 'tufted-works', 'Hand tufted wool', '_KUNST/Collection CURRENT/Tufting/DID-T-014', tuftingTags),
]

// ─── Embroidery — 8 artworks × 5 formats = 40 products ──────────────────────

const embTags = ['embroidery', 'textile', 'flowers', 'words', 'feminist']

const embroidery: CatalogProduct[] = [
  ...prints('DID-E-007', 'emb-powerful-flowers', 'Powerful Flowers', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-007', embTags),
  ...prints('DID-E-008', 'emb-powerful-words', 'Powerful Words', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-008', embTags),
  ...prints('DID-E-009', 'emb-roses', 'Roses', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-009', embTags),
  ...prints('DID-E-010', 'emb-wild-flowers', 'Wild Flowers', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-010', embTags),
  ...prints('DID-E-011', 'emb-feminist-hoop', 'Feminist', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-011', embTags),
  ...prints('DID-E-012', 'emb-botanica', 'Botanica', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-012', embTags),
  ...prints('DID-E-013', 'emb-sisterhood', 'Sisterhood', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-013', embTags),
  ...prints('DID-E-014', 'emb-garden-words', 'Garden Words', 'embroidery', 'Embroidery on fabric', '_KUNST/Collection CURRENT/Embroidery/DID-E-014', embTags),
]

// ─── Paintings — 6 artworks × 5 formats = 30 products ───────────────────────

const paintingTags = ['painting', 'acrylic', 'flora', 'abstract', 'colour']

const paintings: CatalogProduct[] = [
  ...prints('DID-P-001', 'painting-flora-no1', 'Flora No. 1', 'paintings', 'Acrylic on canvas', '_KUNST/Collection CURRENT/Paintings/DID-P-001', paintingTags),
  ...prints('DID-P-002', 'painting-flora-no2', 'Flora No. 2', 'paintings', 'Acrylic on canvas', '_KUNST/Collection CURRENT/Paintings/DID-P-002', paintingTags),
  ...prints('DID-P-003', 'painting-abstract-colour', 'Abstract Colour', 'paintings', 'Acrylic on canvas', '_KUNST/Collection CURRENT/Paintings/DID-P-003', paintingTags),
  ...prints('DID-P-004', 'painting-fauna', 'Fauna', 'paintings', 'Mixed media on paper', '_KUNST/Collection CURRENT/Paintings/DID-P-004', paintingTags),
  ...prints('DID-P-005', 'painting-forest-painting', 'Forest', 'paintings', 'Watercolour on paper', '_KUNST/Collection CURRENT/Paintings/DID-P-005', paintingTags),
  ...prints('DID-P-006', 'painting-self-portrait', 'Self Portrait', 'paintings', 'Acrylic on canvas', '_KUNST/Collection CURRENT/Paintings/DID-P-006', paintingTags),
]

// ─── Photography series — 7 series × ~3 artworks each ────────────────────────

const earthMossTags = ['photography', 'nature', 'moss', 'earth', 'macro']
const earthMoss: CatalogProduct[] = [
  ...prints('DID-PH-001', 'earth-moss-no1', 'Earth Moss No. 1', 'earth-moss', 'Photography', '_KUNST/Collection CURRENT/Photography/Earth Moss/DID-PH-001', earthMossTags),
  ...prints('DID-PH-002', 'earth-moss-no2', 'Earth Moss No. 2', 'earth-moss', 'Photography', '_KUNST/Collection CURRENT/Photography/Earth Moss/DID-PH-002', earthMossTags),
  ...prints('DID-PH-003', 'earth-moss-no3', 'Earth Moss No. 3', 'earth-moss', 'Photography', '_KUNST/Collection CURRENT/Photography/Earth Moss/DID-PH-003', earthMossTags),
]

const forestLightTags = ['photography', 'forest', 'light', 'trees', 'nature']
const forestLight: CatalogProduct[] = [
  ...prints('DID-PH-004', 'forest-light-no1', 'Forest Light No. 1', 'forest-light', 'Photography', '_KUNST/Collection CURRENT/Photography/Forest Light/DID-PH-004', forestLightTags),
  ...prints('DID-PH-005', 'forest-light-no2', 'Forest Light No. 2', 'forest-light', 'Photography', '_KUNST/Collection CURRENT/Photography/Forest Light/DID-PH-005', forestLightTags),
  ...prints('DID-PH-006', 'forest-light-no3', 'Forest Light No. 3', 'forest-light', 'Photography', '_KUNST/Collection CURRENT/Photography/Forest Light/DID-PH-006', forestLightTags),
]

const lavaFlowersTags = ['photography', 'iceland', 'lava', 'flowers', 'landscape']
const lavaFlowers: CatalogProduct[] = [
  ...prints('DID-PH-007', 'lava-flowers-no1', 'Lava Flowers No. 1', 'lava-flowers', 'Photography', '_KUNST/Collection CURRENT/Photography/Lava Flowers/DID-PH-007', lavaFlowersTags),
  ...prints('DID-PH-008', 'lava-flowers-no2', 'Lava Flowers No. 2', 'lava-flowers', 'Photography', '_KUNST/Collection CURRENT/Photography/Lava Flowers/DID-PH-008', lavaFlowersTags),
  ...prints('DID-PH-009', 'lava-flowers-no3', 'Lava Flowers No. 3', 'lava-flowers', 'Photography', '_KUNST/Collection CURRENT/Photography/Lava Flowers/DID-PH-009', lavaFlowersTags),
]

const stormySkyTags = ['photography', 'sky', 'weather', 'dramatic', 'landscape']
const stormySkies: CatalogProduct[] = [
  ...prints('DID-PH-010', 'stormy-skies-no1', 'Stormy Skies No. 1', 'stormy-skies', 'Photography', '_KUNST/Collection CURRENT/Photography/Stormy Skies/DID-PH-010', stormySkyTags),
  ...prints('DID-PH-011', 'stormy-skies-no2', 'Stormy Skies No. 2', 'stormy-skies', 'Photography', '_KUNST/Collection CURRENT/Photography/Stormy Skies/DID-PH-011', stormySkyTags),
  ...prints('DID-PH-012', 'stormy-skies-no3', 'Stormy Skies No. 3', 'stormy-skies', 'Photography', '_KUNST/Collection CURRENT/Photography/Stormy Skies/DID-PH-012', stormySkyTags),
]

const yellowGardenTags = ['photography', 'flowers', 'yellow', 'garden', 'bright']
const yellowGarden: CatalogProduct[] = [
  ...prints('DID-PH-013', 'yellow-garden-no1', 'Yellow Garden No. 1', 'yellow-garden', 'Photography', '_KUNST/Collection CURRENT/Photography/Yellow Garden/DID-PH-013', yellowGardenTags),
  ...prints('DID-PH-014', 'yellow-garden-no2', 'Yellow Garden No. 2', 'yellow-garden', 'Photography', '_KUNST/Collection CURRENT/Photography/Yellow Garden/DID-PH-014', yellowGardenTags),
  ...prints('DID-PH-015', 'yellow-garden-no3', 'Yellow Garden No. 3', 'yellow-garden', 'Photography', '_KUNST/Collection CURRENT/Photography/Yellow Garden/DID-PH-015', yellowGardenTags),
]

const flowerInsideTags = ['photography', 'flowers', 'still-life', 'interior', 'soft']
const flowersInside: CatalogProduct[] = [
  ...prints('DID-PH-016', 'flowers-inside-no1', 'Flowers Inside No. 1', 'flowers-inside', 'Photography', '_KUNST/Collection CURRENT/Photography/Flowers Inside/DID-PH-016', flowerInsideTags),
  ...prints('DID-PH-017', 'flowers-inside-no2', 'Flowers Inside No. 2', 'flowers-inside', 'Photography', '_KUNST/Collection CURRENT/Photography/Flowers Inside/DID-PH-017', flowerInsideTags),
  ...prints('DID-PH-018', 'flowers-inside-no3', 'Flowers Inside No. 3', 'flowers-inside', 'Photography', '_KUNST/Collection CURRENT/Photography/Flowers Inside/DID-PH-018', flowerInsideTags),
]

const softCityTags = ['photography', 'urban', 'copenhagen', 'architecture', 'soft']
const softCity: CatalogProduct[] = [
  ...prints('DID-PH-019', 'soft-city-no1', 'Soft City No. 1', 'soft-city', 'Photography', '_KUNST/Collection CURRENT/Photography/Soft City/DID-PH-019', softCityTags),
  ...prints('DID-PH-020', 'soft-city-no2', 'Soft City No. 2', 'soft-city', 'Photography', '_KUNST/Collection CURRENT/Photography/Soft City/DID-PH-020', softCityTags),
  ...prints('DID-PH-021', 'soft-city-no3', 'Soft City No. 3', 'soft-city', 'Photography', '_KUNST/Collection CURRENT/Photography/Soft City/DID-PH-021', softCityTags),
]

// ─── Pattern series — mugs + totes + prints ───────────────────────────────────

const masksTags = ['pattern', 'masks', 'illustration', 'repeat', 'decorative']
const masksFormats: Array<keyof typeof G> = ['A4', 'P30x45', 'MUG', 'TOTE']
const masksTrio: CatalogProduct[] = [
  ...prints('DID-M-001', 'masks-trio-print', 'Masks Trio', 'masks-trio', 'Digital illustration, pattern repeat', '_KUNST/Collection CURRENT/Mixed/Masks Trio/DID-M-001', masksTags, masksFormats),
]

const seaCreaturesTags = ['pattern', 'ocean', 'sea', 'creatures', 'illustration']
const seaFormats: Array<keyof typeof G> = ['A4', 'P30x45', 'MUG', 'TOTE']
const seaCreatures: CatalogProduct[] = [
  ...prints('DID-M-002', 'sea-creatures-print', 'Sea Creatures', 'sea-creatures', 'Digital illustration, pattern repeat', '_KUNST/Collection CURRENT/Mixed/Sea Creatures/DID-M-002', seaCreaturesTags, seaFormats),
]

const mossPatternTags = ['pattern', 'moss', 'nature', 'abstract']
const mossPFormats: Array<keyof typeof G> = ['A4', 'P30x45', 'MUG', 'TOTE']
const mossPattern: CatalogProduct[] = [
  ...prints('DID-M-003', 'moss-pattern-print', 'Moss Pattern', 'moss-pattern', 'Digital pattern derived from photography', '_KUNST/Collection CURRENT/Mixed/Moss Pattern/DID-M-003', mossPatternTags, mossPFormats),
]

// ─── Bodhi Tree — 3 formats ───────────────────────────────────────────────────

const bodhiTags = ['illustration', 'tree', 'botanical', 'bodhi', 'vector']
const bodhi: CatalogProduct[] = [
  ...prints('DID-M-004', 'bodhi-tree', 'Bodhi Tree', 'bodhi-tree', 'Vector illustration', '_KUNST/Collection CURRENT/Mixed/Bodhi Tree/DID-M-004', bodhiTags, ['A4', 'P30x45', 'C30x40']),
]

// ─── Archive prints — 4 artworks × 3 formats = 12 products ──────────────────

const archiveTags = ['archive', 'mixed-media', 'older-works']
const archive: CatalogProduct[] = [
  ...prints('DID-A-001', 'archive-no1', 'Archive No. 1', 'archive-prints', 'Mixed media', '_KUNST/Collection ARCHIVES/ArkivVærker/DID-A-001', archiveTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-A-002', 'archive-no2', 'Archive No. 2', 'archive-prints', 'Mixed media', '_KUNST/Collection ARCHIVES/ArkivVærker/DID-A-002', archiveTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-A-003', 'archive-no3', 'Archive No. 3', 'archive-prints', 'Mixed media', '_KUNST/Collection ARCHIVES/ArkivVærker/DID-A-003', archiveTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-A-004', 'archive-no4', 'Archive No. 4', 'archive-prints', 'Mixed media', '_KUNST/Collection ARCHIVES/ArkivVærker/DID-A-004', archiveTags, ['A4', 'P30x45', 'C30x40']),
]

// ─── Kids / Elephant — 3 artworks × 3 formats = 9 products ──────────────────

const kidsTags = ['kids', 'elephant', 'illustration', 'colourful', 'nursery']
const kids: CatalogProduct[] = [
  ...prints('DID-M-005', 'elephant-no1', 'Elephant No. 1', 'kids-elephant', 'Digital illustration', '_KUNST/Collection CURRENT/Mixed/Kids Elephant/DID-M-005', kidsTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-M-006', 'elephant-parade', 'Elephant Parade', 'kids-elephant', 'Digital illustration', '_KUNST/Collection CURRENT/Mixed/Kids Elephant/DID-M-006', kidsTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-M-007', 'elephant-family', 'Elephant Family', 'kids-elephant', 'Digital illustration', '_KUNST/Collection CURRENT/Mixed/Kids Elephant/DID-M-007', kidsTags, ['A4', 'P30x45', 'C30x40']),
]

// ─── Shop of Words — text prints, 4 artworks × 3 formats = 12 products ───────

const wordsTags = ['text', 'typography', 'words', 'graphic', 'statement']
const words: CatalogProduct[] = [
  ...prints('DID-M-008', 'words-be-yourself', 'Be Yourself', 'shop-of-words', 'Typography / graphic design', '_KUNST/Collection CURRENT/Mixed/Shop of Words/DID-M-008', wordsTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-M-009', 'words-stay-wild', 'Stay Wild', 'shop-of-words', 'Typography / graphic design', '_KUNST/Collection CURRENT/Mixed/Shop of Words/DID-M-009', wordsTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-M-010', 'words-fierce-and-free', 'Fierce & Free', 'shop-of-words', 'Typography / graphic design', '_KUNST/Collection CURRENT/Mixed/Shop of Words/DID-M-010', wordsTags, ['A4', 'P30x45', 'C30x40']),
  ...prints('DID-M-011', 'words-make-it-now', 'Make It Now', 'shop-of-words', 'Typography / graphic design', '_KUNST/Collection CURRENT/Mixed/Shop of Words/DID-M-011', wordsTags, ['A4', 'P30x45', 'C30x40']),
]

// ─── BYOB series — 4 artworks × 5 formats = 20 products ─────────────────────

const byobTags = ['bold', 'maximal', 'colourful', 'pattern', 'byob']
const byob: CatalogProduct[] = [
  ...prints('DID-M-012', 'byob-no1', 'BYOB No. 1', 'byob', 'Digital art', '_KUNST/Collection CURRENT/Mixed/BYOB/DID-M-012', byobTags),
  ...prints('DID-M-013', 'byob-no2', 'BYOB No. 2', 'byob', 'Digital art', '_KUNST/Collection CURRENT/Mixed/BYOB/DID-M-013', byobTags),
  ...prints('DID-M-014', 'byob-no3', 'BYOB No. 3', 'byob', 'Digital art', '_KUNST/Collection CURRENT/Mixed/BYOB/DID-M-014', byobTags),
  ...prints('DID-M-015', 'byob-no4', 'BYOB No. 4', 'byob', 'Digital art', '_KUNST/Collection CURRENT/Mixed/BYOB/DID-M-015', byobTags),
]

// ─── Full catalog export ───────────────────────────────────────────────────────

export const ALL_PRODUCTS: CatalogProduct[] = [
  ...neko,
  ...shero,
  ...tufting,
  ...embroidery,
  ...paintings,
  ...earthMoss,
  ...forestLight,
  ...lavaFlowers,
  ...stormySkies,
  ...yellowGarden,
  ...flowersInside,
  ...softCity,
  ...masksTrio,
  ...seaCreatures,
  ...mossPattern,
  ...bodhi,
  ...archive,
  ...kids,
  ...words,
  ...byob,
]

export function getProductByHandle(handle: string): CatalogProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.handle === handle)
}

export function getProductsByCollection(collectionId: string): CatalogProduct[] {
  return ALL_PRODUCTS.filter((p) => p.collectionId === collectionId)
}

export function getProductsByFormat(format: CatalogProduct['format']): CatalogProduct[] {
  return ALL_PRODUCTS.filter((p) => p.format === format)
}

// Count: verify we have the expected number
export const PRODUCT_COUNT = ALL_PRODUCTS.length
