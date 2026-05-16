/**
 * DayInDayIn — full product catalog.
 *
 * Structure: each artwork has multiple format variants (different product records).
 * DID = artwork ID. handle = Shopify URL handle (artwork-id + format suffix).
 *
 * Gelato UIDs verified against DK catalog 2026-05-16.
 * Prices in DKK.
 *
 * Format sets per category:
 *   Tufting:    Poster 30×45, Canvas 30×40, Wall Hanging 70×100
 *   Embroidery: A4, Poster 30×45, Canvas 30×40
 *   Paintings:  A4, Poster 30×45, Canvas 30×40, Framed 30×40
 *   Photography: Poster 30×45, Canvas 30×40
 *   Mixed:      A4, Poster 30×45
 *   Archive:    A4, Poster 30×45
 */

import type { CatalogProduct } from './types'

// ─── Gelato product UIDs ──────────────────────────────────────────────────────

const G = {
  A4:       'cards_pf_a4_pt_250-gsm-coated-silk_cl_4-0_ver',
  P30x45:   'flat_300x450-mm-12x18-inch_200-gsm-80lb-uncoated_4-0_ver',
  C30x40:   'canvas_300x400-mm-12x16-inch_canvas_wood-fsc-slim_4-0_ver',
  F30x40:   'framed_300x400-mm-12x16-inch_fine-art_matte-white_4-0_ver',
  WH70x100: 'wall_hanging_poster_1010-mm_black_wood_w14xt20-mm_28x40-inch-700x1000-mm_200-gsm-80lb-uncoated_4-0_ver',
} as const

// ─── Prices in DKK ───────────────────────────────────────────────────────────

const PRICE = {
  A4:       149,
  P30x45:   299,
  C30x40:   495,
  F30x40:   695,
  WH70x100: 895,
} as const

// ─── Substrate labels per format ─────────────────────────────────────────────

const SUBSTRATE: Record<keyof typeof G, string> = {
  A4:       '250gsm coated silk paper (A4)',
  P30x45:   '200gsm uncoated paper (30×45cm)',
  C30x40:   'gallery-wrap canvas (30×40cm)',
  F30x40:   'fine art paper in a matte white frame (30×40cm)',
  WH70x100: '200gsm uncoated paper with black wood hanging rod (70×100cm)',
}

const FORMAT_NAME: Record<keyof typeof G, CatalogProduct['format']> = {
  A4:       'fine-art-print-a4',
  P30x45:   'poster-30x45',
  C30x40:   'canvas-30x40',
  F30x40:   'framed-print-30x40',
  WH70x100: 'wall-hanging-70x100',
}

const HANDLE_SUFFIX: Record<keyof typeof G, string> = {
  A4:       'a4-print',
  P30x45:   'poster',
  C30x40:   'canvas',
  F30x40:   'framed',
  WH70x100: 'wall-hanging',
}

const FORMAT_LABEL: Record<keyof typeof G, string> = {
  A4:       'A4 Print',
  P30x45:   'Poster 30×45',
  C30x40:   'Canvas 30×40',
  F30x40:   'Framed Print 30×40',
  WH70x100: 'Wall Hanging 70×100',
}

// ─── Core helper ─────────────────────────────────────────────────────────────

function prints(
  did: string,
  baseHandle: string,
  title: string,
  collectionId: string,
  description: (substrate: string) => string,
  sourceFile: string,
  tags: string[],
  formats: Array<keyof typeof G>,
): CatalogProduct[] {
  return formats.map((fmt) => ({
    did,
    title: `${title} — ${FORMAT_LABEL[fmt]}`,
    handle: `${baseHandle}-${HANDLE_SUFFIX[fmt]}`,
    description: description(SUBSTRATE[fmt]),
    collectionId,
    format: FORMAT_NAME[fmt],
    grade: 'A' as const,
    sourceFile,
    gelatoProductUid: G[fmt],
    priceKr: PRICE[fmt],
    tags: [...tags, FORMAT_NAME[fmt]],
  }))
}

// ─── Description factories ────────────────────────────────────────────────────

const tuftingDesc = (title: string) => (substrate: string) =>
  `Art print of ${title} by Stine Weirsøe Flamant. Original hand-tufted work. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`

const embroideryDesc = (title: string) => (substrate: string) =>
  `Art print of ${title} by Stine Weirsøe Flamant. Original embroidery on fabric. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`

const paintingDesc = (title: string) => (substrate: string) =>
  `Art print of ${title} by Stine Weirsøe Flamant. Original painting. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`

const photoDesc = (title: string) => (substrate: string) =>
  `Fine art photo print of ${title} by Stine Weirsøe Flamant. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`

const mixedDesc = (title: string) => (substrate: string) =>
  `Art print of ${title} by Stine Weirsøe Flamant. Mixed media original. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`

const archiveDesc = (title: string) => (substrate: string) =>
  `Archive print of ${title} by Stine Weirsøe Flamant. From the artist's archive collection. Printed by Gelato on ${substrate}. Ships within 3–7 business days to EU, UK, and Norway.`

// ─── Format sets per category ─────────────────────────────────────────────────

const TUFTING_FORMATS:    Array<keyof typeof G> = ['P30x45', 'C30x40', 'WH70x100']
const EMBROIDERY_FORMATS: Array<keyof typeof G> = ['A4', 'P30x45', 'C30x40']
const PAINTING_FORMATS:   Array<keyof typeof G> = ['A4', 'P30x45', 'C30x40', 'F30x40']
const PHOTO_FORMATS:      Array<keyof typeof G> = ['P30x45', 'C30x40']
const MIXED_FORMATS:      Array<keyof typeof G> = ['A4', 'P30x45']
const ARCHIVE_FORMATS:    Array<keyof typeof G> = ['A4', 'P30x45']

// ─── Tags per category ────────────────────────────────────────────────────────

const T_TAGS  = ['tufting', 'textile', 'handmade', 'print']
const E_TAGS  = ['embroidery', 'textile', 'print']
const P_TAGS  = ['painting', 'original', 'print']
const PH_TAGS = ['photography', 'studio', 'print']
const M_TAGS  = ['mixed', 'print']
const A_TAGS  = ['archive', 'print', 'limited']

// ─── TUFTING — 41 artworks × 3 formats = 123 products ───────────────────────

const tufting: CatalogProduct[] = [
  ...prints('DID-T-001', 'did-t-001', 'Square Flower Thing',   'tufted-works', tuftingDesc('Square Flower Thing'),   '_KUNST/COLLECTION CURRENT/Tufting/DID-T-001_firkantet_blomst_ting_34x22',    T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-002', 'did-t-002', 'Round Earth',           'tufted-works', tuftingDesc('Round Earth'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-002_rund_jord_41x41',               T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-003', 'did-t-003', 'Purple Sun',            'tufted-works', tuftingDesc('Purple Sun'),            '_KUNST/COLLECTION CURRENT/Tufting/DID-T-003_purple-sun',                    T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-004', 'did-t-004', 'Candy No. 1',           'tufted-works', tuftingDesc('Candy No. 1'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-004_candy',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-005', 'did-t-005', 'Stripes on Beige',      'tufted-works', tuftingDesc('Stripes on Beige'),      '_KUNST/COLLECTION CURRENT/Tufting/DID-T-005_striber_på_beige_22x22',        T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-006', 'did-t-006', 'Little Round',          'tufted-works', tuftingDesc('Little Round'),          '_KUNST/COLLECTION CURRENT/Tufting/DID-T-006_lille_rund_hvid-blå-rød_24x21', T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-007', 'did-t-007', 'Candy No. 2',           'tufted-works', tuftingDesc('Candy No. 2'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-007_candy',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-008', 'did-t-008', 'Fleur de Lys',          'tufted-works', tuftingDesc('Fleur de Lys'),          '_KUNST/COLLECTION CURRENT/Tufting/DID-T-008_fleur_de_lys_37x27',           T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-010', 'did-t-010', 'Sitspot No. 1',         'tufted-works', tuftingDesc('Sitspot No. 1'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-010_sitspot',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-011', 'did-t-011', 'Sitspot No. 2',         'tufted-works', tuftingDesc('Sitspot No. 2'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-011_sitspot',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-012', 'did-t-012', 'Sitspot No. 3',         'tufted-works', tuftingDesc('Sitspot No. 3'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-012_sitspot',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-013', 'did-t-013', 'Sitspot Large',         'tufted-works', tuftingDesc('Sitspot Large'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-013_sitspot_74x44',                 T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-014', 'did-t-014', 'Orange Sun',            'tufted-works', tuftingDesc('Orange Sun'),            '_KUNST/COLLECTION CURRENT/Tufting/DID-T-014_orange_sol_51x37',              T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-015', 'did-t-015', 'Green Square',          'tufted-works', tuftingDesc('Green Square'),          '_KUNST/COLLECTION CURRENT/Tufting/DID-T-015_firkantet_grøn_60x51',          T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-016', 'did-t-016', 'Jeweled Hand',          'tufted-works', tuftingDesc('Jeweled Hand'),          '_KUNST/COLLECTION CURRENT/Tufting/DID-T-016_jeweled_hand_27x14',            T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-017', 'did-t-017', 'Jellyfish',             'tufted-works', tuftingDesc('Jellyfish'),             '_KUNST/COLLECTION CURRENT/Tufting/DID-T-017_gople_56x24',                   T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-018', 'did-t-018', 'Rainbow No. 1',         'tufted-works', tuftingDesc('Rainbow No. 1'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-018_rainbow',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-019', 'did-t-019', 'Rainbow No. 2',         'tufted-works', tuftingDesc('Rainbow No. 2'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-019_rainbow',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-020', 'did-t-020', 'Rainbow No. 3',         'tufted-works', tuftingDesc('Rainbow No. 3'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-020_rainbow',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-022', 'did-t-022', 'Rainbow No. 4',         'tufted-works', tuftingDesc('Rainbow No. 4'),         '_KUNST/COLLECTION CURRENT/Tufting/DID-T-022_rainbow',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-023', 'did-t-023', 'Mask',                  'tufted-works', tuftingDesc('Mask'),                  '_KUNST/COLLECTION CURRENT/Tufting/DID-T-023_mask_39x21',                    T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-024', 'did-t-024', 'Fireworks',             'tufted-works', tuftingDesc('Fireworks'),             '_KUNST/COLLECTION CURRENT/Tufting/DID-T-024_fyrværkeri',                    T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-025', 'did-t-025', 'Sitspot XL',            'tufted-works', tuftingDesc('Sitspot XL'),            '_KUNST/COLLECTION CURRENT/Tufting/DID-T-025_sitspot_large',                 T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-026', 'did-t-026', 'Universe with a Hole',  'tufted-works', tuftingDesc('Universe with a Hole'),  '_KUNST/COLLECTION CURRENT/Tufting/DID-T-026_univers_med_hul_i_midten',      T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-027', 'did-t-027', 'Pink Rug',              'tufted-works', tuftingDesc('Pink Rug'),              '_KUNST/COLLECTION CURRENT/Tufting/DID-T-027_lyserødt_tæppe',                T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-028', 'did-t-028', 'Liebes Panopticon',     'tufted-works', tuftingDesc('Liebes Panopticon'),     '_KUNST/COLLECTION CURRENT/Tufting/DID-T-028_liebes_panopticon',             T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-029', 'did-t-029', 'Birds',                 'tufted-works', tuftingDesc('Birds'),                 '_KUNST/COLLECTION CURRENT/Tufting/DID-T-029_birds',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-030', 'did-t-030', 'Candy No. 3',           'tufted-works', tuftingDesc('Candy No. 3'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-030_candy_26x24',                   T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-031', 'did-t-031', 'Candy No. 4',           'tufted-works', tuftingDesc('Candy No. 4'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-031_candy',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-032', 'did-t-032', 'POW',                   'tufted-works', tuftingDesc('POW'),                   '_KUNST/COLLECTION CURRENT/Tufting/DID-T-032_pow',                           T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-033', 'did-t-033', 'Square Flower Thing II','tufted-works', tuftingDesc('Square Flower Thing II'),'_KUNST/COLLECTION CURRENT/Tufting/DID-T-033_firkantet_blomst_ting_34x23',   T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-034', 'did-t-034', 'Candy No. 5',           'tufted-works', tuftingDesc('Candy No. 5'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-034_candy',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-035', 'did-t-035', 'Candy Collection',      'tufted-works', tuftingDesc('Candy Collection'),      '_KUNST/COLLECTION CURRENT/Tufting/DID-T-035_collection_candy',              T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-036', 'did-t-036', 'Candy No. 6',           'tufted-works', tuftingDesc('Candy No. 6'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-036_candy',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-037', 'did-t-037', 'Candy No. 7',           'tufted-works', tuftingDesc('Candy No. 7'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-037_candy',                         T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-038', 'did-t-038', 'Collage',               'tufted-works', tuftingDesc('Collage'),               '_KUNST/COLLECTION CURRENT/Tufting/DID-T-038_collage',                       T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-039', 'did-t-039', 'Du und',                'tufted-works', tuftingDesc('Du und'),                '_KUNST/COLLECTION CURRENT/Tufting/DID-T-039_du-und',                        T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-040', 'did-t-040', 'Green Flower',          'tufted-works', tuftingDesc('Green Flower'),          '_KUNST/COLLECTION CURRENT/Tufting/DID-T-040_green-flower',                  T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-041', 'did-t-041', 'Hej',                   'tufted-works', tuftingDesc('Hej'),                   '_KUNST/COLLECTION CURRENT/Tufting/DID-T-041_hej',                           T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-042', 'did-t-042', 'Pink Rug II',           'tufted-works', tuftingDesc('Pink Rug II'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-042_lyserødt_tæppe_2',              T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-043', 'did-t-043', 'Red on Wood',           'tufted-works', tuftingDesc('Red on Wood'),           '_KUNST/COLLECTION CURRENT/Tufting/DID-T-043_red_on_wood_board',             T_TAGS, TUFTING_FORMATS),
  ...prints('DID-T-044', 'did-t-044', 'Rug on the Wall',       'tufted-works', tuftingDesc('Rug on the Wall'),       '_KUNST/COLLECTION CURRENT/Tufting/DID-T-044_tæppe-på-væggen-i-soveværelset',T_TAGS, TUFTING_FORMATS),
]

// ─── EMBROIDERY — 16 artworks × 3 formats = 48 products ──────────────────────

const embroidery: CatalogProduct[] = [
  ...prints('DID-E-001', 'did-e-001', 'Fuck Alting',             'embroidery', embroideryDesc('Fuck Alting'),             '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-001_fuck-alting',                        E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-002', 'did-e-002', 'God Has Cancelled',       'embroidery', embroideryDesc('God Has Cancelled'),       '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-002_gud-har-meldt-afbud',               E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-003', 'did-e-003', 'God Has Cancelled II',    'embroidery', embroideryDesc('God Has Cancelled II'),    '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-003_gud-har-meldt-afbud-2',             E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-004', 'did-e-004', 'Stranger Things',         'embroidery', embroideryDesc('Stranger Things'),         '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-004_stranger-things',                    E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-005', 'did-e-005', 'Doodles',                 'embroidery', embroideryDesc('Doodles'),                 '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-005_doodles',                            E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-006', 'did-e-006', 'Elsk',                    'embroidery', embroideryDesc('Elsk'),                    '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-006_elsk',                               E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-007', 'did-e-007', 'Be a Dragon',             'embroidery', embroideryDesc('Be a Dragon'),             '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-007_be-a-dragon',                        E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-008', 'did-e-008', 'Collage Black & White',   'embroidery', embroideryDesc('Collage Black & White'),   '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-008_collage-white-black_100x70',         E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-009', 'did-e-009', "Long Hair Don't Care",    'embroidery', embroideryDesc("Long Hair Don't Care"),    '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-009_long-hair-dont-care',               E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-010', 'did-e-010', 'Apple Scraps',            'embroidery', embroideryDesc('Apple Scraps'),            '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-010_apple-scraps',                      E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-011', 'did-e-011', 'Det Er Bare Tanker',      'embroidery', embroideryDesc('Det Er Bare Tanker'),      '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-011_det-er-bare-tanker',                E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-012', 'did-e-012', 'Perfidt Perfekt',         'embroidery', embroideryDesc('Perfidt Perfekt'),         '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-012_perfidt-perfekt',                   E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-013', 'did-e-013', 'Ingenting',               'embroidery', embroideryDesc('Ingenting'),               '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-013_ingenting',                         E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-014', 'did-e-014', 'Red to Blue',             'embroidery', embroideryDesc('Red to Blue'),             '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-014_red-to-blue broderi',               E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-015', 'did-e-015', "There's Nothing Here",    'embroidery', embroideryDesc("There's Nothing Here"),    '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-015_theres-nothing-here',               E_TAGS, EMBROIDERY_FORMATS),
  ...prints('DID-E-016', 'did-e-016', 'Mariann',                 'embroidery', embroideryDesc('Mariann'),                 '_KUNST/COLLECTION CURRENT/Embroidery/DID-E-016_mariann',                           E_TAGS, EMBROIDERY_FORMATS),
]

// ─── PAINTINGS — 17 artworks × 4 formats = 68 products ───────────────────────

const paintings: CatalogProduct[] = [
  ...prints('DID-P-001', 'did-p-001', 'Green Background',      'paintings', paintingDesc('Green Background'),      '_KUNST/COLLECTION CURRENT/Paintings/DID-P-001_green-background',         P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-002', 'did-p-002', 'Bird Man',              'paintings', paintingDesc('Bird Man'),              '_KUNST/COLLECTION CURRENT/Paintings/DID-P-002_bird-man',                  P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-003', 'did-p-003', 'Universe No. 1',        'paintings', paintingDesc('Universe No. 1'),        '_KUNST/COLLECTION CURRENT/Paintings/DID-P-003_universe-1',                P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-004', 'did-p-004', 'Green on Blue',         'paintings', paintingDesc('Green on Blue'),         '_KUNST/COLLECTION CURRENT/Paintings/DID-P-004_green-on-blue-board',       P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-005', 'did-p-005', 'H.C. Andersen',         'paintings', paintingDesc('H.C. Andersen'),         '_KUNST/COLLECTION CURRENT/Paintings/DID-P-005_hc-andersen',               P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-006', 'did-p-006', 'Vaginals',              'paintings', paintingDesc('Vaginals'),              '_KUNST/COLLECTION CURRENT/Paintings/DID-P-006_vaginals',                  P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-007', 'did-p-007', 'Fantasy',               'paintings', paintingDesc('Fantasy'),               '_KUNST/COLLECTION CURRENT/Paintings/DID-P-007_fantasy',                   P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-008', 'did-p-008', 'Colour Study',          'paintings', paintingDesc('Colour Study'),          '_KUNST/COLLECTION CURRENT/Paintings/DID-P-008_colour-study',              P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-009', 'did-p-009', 'Universe No. 2',        'paintings', paintingDesc('Universe No. 2'),        '_KUNST/COLLECTION CURRENT/Paintings/DID-P-009_universe-2',                P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-010', 'did-p-010', 'Blue Branch',           'paintings', paintingDesc('Blue Branch'),           '_KUNST/COLLECTION CURRENT/Paintings/DID-P-010_blue-branch',               P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-012', 'did-p-012', 'Universe Collection',   'paintings', paintingDesc('Universe Collection'),   '_KUNST/COLLECTION CURRENT/Paintings/DID-P-012_universe-collection',       P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-013', 'did-p-013', 'Colour Study Blue',     'paintings', paintingDesc('Colour Study Blue'),     '_KUNST/COLLECTION CURRENT/Paintings/DID-P-013_colour-study-blue',         P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-014', 'did-p-014', 'Her Er En Sandhed',     'paintings', paintingDesc('Her Er En Sandhed'),     '_KUNST/COLLECTION CURRENT/Paintings/DID-P-014_her-er-en-sandhed',         P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-015', 'did-p-015', 'Person Walking',        'paintings', paintingDesc('Person Walking'),        '_KUNST/COLLECTION CURRENT/Paintings/DID-P-015_person_walking',            P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-017', 'did-p-017', 'Universe No. 3',        'paintings', paintingDesc('Universe No. 3'),        '_KUNST/COLLECTION CURRENT/Paintings/DID-P-017_universe-3',                P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-019', 'did-p-019', 'Blue Background',       'paintings', paintingDesc('Blue Background'),       '_KUNST/COLLECTION CURRENT/Paintings/DID-P-019_blue-background-dayin',     P_TAGS, PAINTING_FORMATS),
  ...prints('DID-P-021', 'did-p-021', 'Sri Lanka Masks',       'paintings', paintingDesc('Sri Lanka Masks'),       '_KUNST/COLLECTION CURRENT/Paintings/DID-P-021_sri-lanka-masks',           P_TAGS, PAINTING_FORMATS),
]

// ─── PHOTOGRAPHY — 19 artworks × 2 formats = 38 products ─────────────────────

const photography: CatalogProduct[] = [
  ...prints('DID-PH-001', 'did-ph-001', 'Purple Fabric in Garden',         'photography', photoDesc('Purple Fabric in Garden'),         '_KUNST/COLLECTION CURRENT/Photography/DID-PH-001_purple-fabric-in-garden',            PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-002', 'did-ph-002', 'View from the Studio',            'photography', photoDesc('View from the Studio'),            '_KUNST/COLLECTION CURRENT/Photography/DID-PH-002_view-from-the-studio_1500x1000',      PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-003', 'did-ph-003', 'Linen & Yellow Flower',           'photography', photoDesc('Linen & Yellow Flower'),           '_KUNST/COLLECTION CURRENT/Photography/DID-PH-003_linen-and-yellow-flower_1500x1000',   PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-004', 'did-ph-004', 'Minnie Mouse and the Neko Cat',   'photography', photoDesc('Minnie Mouse and the Neko Cat'),   '_KUNST/COLLECTION CURRENT/Photography/DID-PH-004_minnie-mouse-and-the-neko-cat_1500x1000', PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-005', 'did-ph-005', 'A Very Small Frog',               'photography', photoDesc('A Very Small Frog'),               '_KUNST/COLLECTION CURRENT/Photography/DID-PH-005_a-very-small-frog_1500x1000',         PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-006', 'did-ph-006', 'Blue Flower on Green Wood',       'photography', photoDesc('Blue Flower on Green Wood'),       '_KUNST/COLLECTION CURRENT/Photography/DID-PH-006_blue-flower-on-green-wood_1500x1000', PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-007', 'did-ph-007', 'Red & Green Moss',                'photography', photoDesc('Red & Green Moss'),                '_KUNST/COLLECTION CURRENT/Photography/DID-PH-007_red-and-green-moss_1500x1000',        PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-008', 'did-ph-008', 'No Ordinary Stone',               'photography', photoDesc('No Ordinary Stone'),               '_KUNST/COLLECTION CURRENT/Photography/DID-PH-008_no-ordinary-stone_1500x1000',         PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-009', 'did-ph-009', 'Polaroids',                       'photography', photoDesc('Polaroids'),                       '_KUNST/COLLECTION CURRENT/Photography/DID-PH-009_polaroids_1500x1000',                  PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-010', 'did-ph-010', 'Colourful Shadows',               'photography', photoDesc('Colourful Shadows'),               '_KUNST/COLLECTION CURRENT/Photography/DID-PH-010_colourful-shadows_1500x1000',         PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-011', 'did-ph-011', 'On the Light Table',              'photography', photoDesc('On the Light Table'),              '_KUNST/COLLECTION CURRENT/Photography/DID-PH-011_on-the-light-table_1500x1000',        PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-012', 'did-ph-012', 'Dead Flowers',                    'photography', photoDesc('Dead Flowers'),                    '_KUNST/COLLECTION CURRENT/Photography/DID-PH-012_dead-flowers_1500x1000',              PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-013', 'did-ph-013', 'Smørrebrød',                      'photography', photoDesc('Smørrebrød'),                      '_KUNST/COLLECTION CURRENT/Photography/DID-PH-013_smørrebrød_1500x1000',               PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-014', 'did-ph-014', 'Yarn',                            'photography', photoDesc('Yarn'),                            '_KUNST/COLLECTION CURRENT/Photography/DID-PH-014_yarn_1500x1000',                      PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-015', 'did-ph-015', 'Office Shot',                     'photography', photoDesc('Office Shot'),                     '_KUNST/COLLECTION CURRENT/Photography/DID-PH-015_office-shot_1500x1000',               PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-016', 'did-ph-016', 'Purple Flower',                   'photography', photoDesc('Purple Flower'),                   '_KUNST/COLLECTION CURRENT/Photography/DID-PH-016_purple-flower_1500x1000',             PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-017', 'did-ph-017', 'Vase on Stool',                   'photography', photoDesc('Vase on Stool'),                   '_KUNST/COLLECTION CURRENT/Photography/DID-PH-017_vase-on-stool_1500x1000',             PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-018', 'did-ph-018', 'Taped Objects',                   'photography', photoDesc('Taped Objects'),                   '_KUNST/COLLECTION CURRENT/Photography/DID-PH-018_taped-objects_1500x1000',             PH_TAGS, PHOTO_FORMATS),
  ...prints('DID-PH-019', 'did-ph-019', 'Flowers on Linen',                'photography', photoDesc('Flowers on Linen'),                '_KUNST/COLLECTION CURRENT/Photography/DID-PH-019_flowers-on-linen_1500x1000',          PH_TAGS, PHOTO_FORMATS),
]

// ─── MIXED — 7 artworks × 2 formats = 14 products ────────────────────────────

const mixed: CatalogProduct[] = [
  ...prints('DID-M-001', 'did-m-001', 'Cat Doll',                    'mixed', mixedDesc('Cat Doll'),                    '_KUNST/COLLECTION CURRENT/Mixed/DID-M-001_cat-doll',                           M_TAGS, MIXED_FORMATS),
  ...prints('DID-M-002', 'did-m-002', 'Pink Bag',                    'mixed', mixedDesc('Pink Bag'),                    '_KUNST/COLLECTION CURRENT/Mixed/DID-M-002_pink-bag',                           M_TAGS, MIXED_FORMATS),
  ...prints('DID-M-003', 'did-m-003', 'Alt Opløst',                  'mixed', mixedDesc('Alt Opløst'),                  '_KUNST/COLLECTION CURRENT/Mixed/DID-M-003_alt-opløst',                         M_TAGS, MIXED_FORMATS),
  ...prints('DID-M-004', 'did-m-004', 'Polaroids on Fabric',         'mixed', mixedDesc('Polaroids on Fabric'),         '_KUNST/COLLECTION CURRENT/Mixed/DID-M-004_polaroids-on-fabrics',               M_TAGS, MIXED_FORMATS),
  ...prints('DID-M-005', 'did-m-005', 'Tufting on Embroidery',       'mixed', mixedDesc('Tufting on Embroidery'),       '_KUNST/COLLECTION CURRENT/Mixed/DID-M-005_tufting-on-embroided-background',    M_TAGS, MIXED_FORMATS),
  ...prints('DID-M-006', 'did-m-006', 'Wooden Figurine',             'mixed', mixedDesc('Wooden Figurine'),             '_KUNST/COLLECTION CURRENT/Mixed/DID-M-006_wooden-figurine',                    M_TAGS, MIXED_FORMATS),
  ...prints('DID-M-007', 'did-m-007', 'Laundry Bags',                'mixed', mixedDesc('Laundry Bags'),                '_KUNST/COLLECTION CURRENT/Mixed/DID-M-007_laundry-bags',                       M_TAGS, MIXED_FORMATS),
]

// ─── ARCHIVE — 22 artworks × 2 formats = 44 products ─────────────────────────

const archive: CatalogProduct[] = [
  ...prints('DID-A-001', 'did-a-001', 'Archive No. 1',  'archive', archiveDesc('Archive No. 1'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-001',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-002', 'did-a-002', 'Archive No. 2',  'archive', archiveDesc('Archive No. 2'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-002',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-003', 'did-a-003', 'Archive No. 3',  'archive', archiveDesc('Archive No. 3'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-003',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-004', 'did-a-004', 'Archive No. 4',  'archive', archiveDesc('Archive No. 4'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-004',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-005', 'did-a-005', 'Archive No. 5',  'archive', archiveDesc('Archive No. 5'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-005',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-006', 'did-a-006', 'Archive No. 6',  'archive', archiveDesc('Archive No. 6'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-006',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-007', 'did-a-007', 'Archive No. 7',  'archive', archiveDesc('Archive No. 7'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-007',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-008', 'did-a-008', 'Archive No. 8',  'archive', archiveDesc('Archive No. 8'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-008',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-009', 'did-a-009', 'Archive No. 9',  'archive', archiveDesc('Archive No. 9'),  '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-009',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-010', 'did-a-010', 'Archive No. 10', 'archive', archiveDesc('Archive No. 10'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-010',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-011', 'did-a-011', 'Archive No. 11', 'archive', archiveDesc('Archive No. 11'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-011',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-012', 'did-a-012', 'Archive No. 12', 'archive', archiveDesc('Archive No. 12'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-012',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-013', 'did-a-013', 'Archive No. 13', 'archive', archiveDesc('Archive No. 13'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-013',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-014', 'did-a-014', 'Archive No. 14', 'archive', archiveDesc('Archive No. 14'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-014',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-015', 'did-a-015', 'Archive No. 15', 'archive', archiveDesc('Archive No. 15'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-015',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-016', 'did-a-016', 'Archive No. 16', 'archive', archiveDesc('Archive No. 16'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-016',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-017', 'did-a-017', 'Archive No. 17', 'archive', archiveDesc('Archive No. 17'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-017',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-018', 'did-a-018', 'Archive No. 18', 'archive', archiveDesc('Archive No. 18'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-018',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-019', 'did-a-019', 'Archive No. 19', 'archive', archiveDesc('Archive No. 19'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-019',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-020', 'did-a-020', 'Archive No. 20', 'archive', archiveDesc('Archive No. 20'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-020',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-021', 'did-a-021', 'Archive No. 21', 'archive', archiveDesc('Archive No. 21'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-021',  A_TAGS, ARCHIVE_FORMATS),
  ...prints('DID-A-022', 'did-a-022', 'Archive No. 22', 'archive', archiveDesc('Archive No. 22'), '_KUNST/COLLECTION ARCHIVES/ArkivVærker/DID-A-022',  A_TAGS, ARCHIVE_FORMATS),
]

// ─── Full catalog export ───────────────────────────────────────────────────────

export const ALL_PRODUCTS: CatalogProduct[] = [
  ...tufting,
  ...embroidery,
  ...paintings,
  ...photography,
  ...mixed,
  ...archive,
]

export const PRODUCT_COUNT = ALL_PRODUCTS.length

export function getProductByHandle(handle: string): CatalogProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.handle === handle)
}

export function getProductsByCollection(collectionId: string): CatalogProduct[] {
  return ALL_PRODUCTS.filter((p) => p.collectionId === collectionId)
}

export function getProductsByFormat(format: CatalogProduct['format']): CatalogProduct[] {
  return ALL_PRODUCTS.filter((p) => p.format === format)
}
