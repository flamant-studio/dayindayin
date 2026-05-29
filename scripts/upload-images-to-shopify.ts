/**
 * upload-images-to-shopify.ts
 *
 * Uploads artwork images directly to Shopify products using staged uploads.
 * Bypasses Vercel Blob (currently suspended) and Gelato's async mockup generation.
 *
 * Run:     npx tsx scripts/upload-images-to-shopify.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/upload-images-to-shopify.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync, statSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN        = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID     = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const DRY_RUN       = process.env.DRY_RUN === '1'

// ── Base paths ────────────────────────────────────────────────────────────────

const DROPBOX       = '/Users/flamant-mini/Dropbox/_KUNST'
const DROPBOX_LIB   = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST'
const STINE_DESIGN  = '/Users/flamant-mini/Dropbox/_STINE/Design'
const SHOP_OF_WORDS = `${DROPBOX}/Studio/Shop of Words`
const PRINT_READY   = `${DROPBOX}/Studio/print ready`
const ART_PHOTO     = `${PRINT_READY}/Art photo`
const ARTSTUDIO     = `${DROPBOX}/Studio/dayindayin artstudio`
const PATTERN       = `${DROPBOX_LIB}/Studio/Pattern repeats`
const STINE_FOTO    = `${DROPBOX_LIB}/STINE FOTO`
const PROCREATE     = resolve(process.cwd(), 'assets/Procreate-batch')
const COLLECTION    = `${DROPBOX_LIB}/COLLECTION CURRENT`

// ── Blob-pathname → local file mapping ───────────────────────────────────────

// Each entry: [blobPathname, localFilePath]
const BLOB_TO_LOCAL: [string, string][] = [
  // Neko paw prints
  ['gelato/neko/nekopaw_yellow_outline.png',  `${SHOP_OF_WORDS}/nekopaw_yellow_outline.png`],
  ['gelato/neko/nekopaw_yellow_neon.png',     `${SHOP_OF_WORDS}/nekopaw_yellow_neon.png`],
  ['gelato/neko/nekopaw_yellow_blue.png',     `${SHOP_OF_WORDS}/nekopaw_yellow_blue.png`],
  ['gelato/neko/nekopaw_pink_outline.png',    `${SHOP_OF_WORDS}/nekopaw_pink_outline.png`],
  ['gelato/neko/nekopaw_lilac_outline.png',   `${SHOP_OF_WORDS}/nekopaw_lilac_outline.png`],
  ['gelato/neko/nekopaw_yellow_outline1.png', `${SHOP_OF_WORDS}/nekopaw_yellow_outline1.png`],

  // Art photo / framed-vertical
  ['gelato/artphoto/sheroshine-1.jpg',        `${ART_PHOTO}/Sheroshine_1swf2023-1.jpeg`],
  ['gelato/framed-vertical/sheroshine.jpg',   `${ART_PHOTO}/Sheroshine_1swf2023-1.jpeg`],
  ['gelato/framed-vertical/strong-floral.jpg',`${ART_PHOTO}/Strongfloral-1.jpeg`],

  // Masks
  ['gelato/masks/mask-1.jpg',     `${ARTSTUDIO}/masker/Scan_swf_mask1.png`],
  ['gelato/masks/mask-2.jpg',     `${ARTSTUDIO}/masker/Scan_swf_mask2.png`],
  ['gelato/masks/mask-3.jpg',     `${ARTSTUDIO}/masker/IMG_0643.png`],
  ['gelato/masks/ulrikke-zebra.jpg', `${ARTSTUDIO}/Dayindayin.dk/ulrikkezebra.jpg`],

  // Tourism (TIFF — will be converted to JPEG)
  ['gelato/tourism/tourism-1.jpg', `${PRINT_READY}/Tourism_1.tiff`],
  ['gelato/tourism/tourism-2.jpg', `${PRINT_READY}/Tourism_2.tiff`],
  ['gelato/tourism/tourism-3.jpg', `${PRINT_READY}/Tourism_3.tiff`],
  ['gelato/tourism/tourism-4.jpg', `${PRINT_READY}/Tourism_4.tiff`],

  // Elephants (PNG — will be converted to JPEG)
  ['gelato/elephants/elephant-green.jpg',  `${STINE_DESIGN}/Elefant_groen.png`],
  ['gelato/elephants/elephant-yellow.jpg', `${STINE_DESIGN}/Elefant_gul.png`],
  ['gelato/elephants/elephant-lilac.jpg',  `${STINE_DESIGN}/Elefant_lilla.png`],
  ['gelato/elephants/elephant-red.jpg',    `${STINE_DESIGN}/Elefant_roed.png`],

  // Procreate — portrait
  ['gelato/procreate/solar-face.jpg',       `${PROCREATE}/Untitled_Artwork 1.png`],
  ['gelato/procreate/the-fist.jpg',         `${PROCREATE}/Untitled_Artwork 5.png`],
  ['gelato/procreate/sea-monsters-steel.jpg',`${PROCREATE}/Untitled_Artwork 12.png`],
  ['gelato/procreate/sommerby-elements.jpg', `${PROCREATE}/Sommerby_Elementer.png`],
  ['gelato/procreate/mask-blase.jpg',        `${PROCREATE}/Maske_Mod_Blaserthed.png`],
  ['gelato/procreate/neko-human-i.jpg',      `${PROCREATE}/Neko_Pussy_Human.png`],
  ['gelato/procreate/neko-human-ii.jpg',     `${PROCREATE}/Neko_Pussy_Human 2.png`],
  ['gelato/procreate/botanical-noir.jpg',    `${PROCREATE}/Colour_Exploration.png`],
  ['gelato/procreate/botanical-blanc.jpg',   `${PROCREATE}/Master_Composition2sommertæt.png`],
  ['gelato/procreate/mask-calling.jpg',      `${PROCREATE}/Maske_Mod_Opkald.png`],
  ['gelato/procreate/moon-face.jpg',         `${PROCREATE}/Untitled_Artwork 3.png`],
  ['gelato/procreate/mask-dream.jpg',        `${PROCREATE}/Maske_Mod_Binære_Forventninger.png`],
  ['gelato/procreate/garden-cream.jpg',      `${PROCREATE}/Garden_Cream.png`],
  ['gelato/procreate/garden-sky.jpg',        `${PROCREATE}/Garden_Sky.png`],
  ['gelato/procreate/garden-lavender.jpg',   `${PROCREATE}/Garden_Lavender.png`],
  ['gelato/procreate/garden-sage.jpg',       `${PROCREATE}/Garden_Sage.png`],
  ['gelato/procreate/mask-study.jpg',        `${PROCREATE}/Untitled_Artwork 4.png`],

  // Procreate — landscape
  ['gelato/procreate/shero-purple.jpg',      `${PROCREATE}/Sheroprint_transparent.png`],
  ['gelato/procreate/shero-indigo.jpg',      `${PROCREATE}/Sheroprint_transparent 1.png`],
  ['gelato/procreate/shero-3.jpg',           `${PROCREATE}/Sheroprint_transparent 2.png`],
  ['gelato/procreate/two-cats.jpg',          `${PROCREATE}/IMG_1944.png`],
  ['gelato/procreate/sea-monsters-blue.jpg', `${PROCREATE}/Untitled_Artwork 10.png`],

  // Procreate — square
  ['gelato/procreate/sleeping-cat.jpg',      `${PROCREATE}/Untitled_Artwork 2.png`],
  ['gelato/procreate/floating-poppies.jpg',  `${PROCREATE}/Untitled_Artwork 6.png`],
  ['gelato/procreate/night-poppies.jpg',     `${PROCREATE}/Untitled_Artwork 7.png`],
  ['gelato/procreate/poppy-field.jpg',       `${PROCREATE}/Untitled_Artwork 8.png`],
  ['gelato/procreate/forget-me-not.jpg',     `${PROCREATE}/Untitled_Artwork 9.png`],
  ['gelato/procreate/sea-monsters-gold.jpg', `${PROCREATE}/Untitled_Artwork 11.png`],
  ['gelato/procreate/sea-monsters-cream.jpg',`${PROCREATE}/Untitled_Artwork 13.png`],
  ['gelato/procreate/geometric-garden.jpg',  `${PROCREATE}/Geometric_garden.png`],
  ['gelato/procreate/mask-conformist.jpg',   `${PROCREATE}/Maske_Mod_Medløberi.png`],
  ['gelato/procreate/fist-blue.jpg',         `${PROCREATE}/Neko_pote.png`],
  ['gelato/procreate/fist-ink.jpg',          `${PROCREATE}/Neko_pote 1.png`],

  // Square prints
  ['gelato/square/sheroshine.jpg',       `${ART_PHOTO}/Sheroshine_1swf2023-1.jpeg`],
  ['gelato/square/kaninskoven.jpg',      `${PATTERN}/Kaninskoven_Lille.png`],
  ['gelato/square/monsters-pattern.jpg', `${PATTERN}/2021-10-30 10.59.01-1.png`],
  ['gelato/square/moondancer.jpg',       `${STINE_FOTO}/moondancer.jpeg`],

  // Works — tufting
  ['works/tufting/purple-sun.jpg',        `${COLLECTION}/Tufting/DID-T-003_purple-sun/2019-05-27 11.47.46.jpg`],
  ['works/tufting/candy-I.jpg',           `${COLLECTION}/Tufting/DID-T-004_candy/2021-02-02 14.32.14-1.jpg`],
  ['works/tufting/orange-sun.jpg',        `${COLLECTION}/Tufting/DID-T-014_orange_sol_51x37/2021-02-02 15.29.25.jpg`],
  ['works/tufting/rainbow-I.jpg',         `${COLLECTION}/Tufting/DID-T-018_rainbow/2021-03-03 14.18.32.png`],
  ['works/tufting/birds.jpg',             `${COLLECTION}/Tufting/DID-T-029_birds/2021-05-31 12.48.21.jpg`],
  ['works/tufting/du-und.jpg',            `${COLLECTION}/Tufting/DID-T-039_du-und/2021-07-22 14.05.33.jpg`],
  ['works/tufting/hej.jpg',               `${COLLECTION}/Tufting/DID-T-041_hej/2021-07-12 09.35.03.jpg`],
  ['works/tufting/liebes-panopticon.jpg', `${COLLECTION}/Tufting/DID-T-028_liebes_panopticon/2021-02-24 13.02.42.jpg`],
  ['works/tufting/floral-thing.jpg',      `${COLLECTION}/Tufting/DID-T-001_firkantet_blomst_ting_34x22/2021-02-02 14.21.37-2.jpg`],
  ['works/tufting/round-earth.jpg',       `${COLLECTION}/Tufting/DID-T-002_rund_jord_41x41/2021-02-02 15.01.53.jpg`],
  ['works/tufting/fleur-de-lys.jpg',      `${COLLECTION}/Tufting/DID-T-008_fleur_de_lys_37x27/2021-02-02 14.53.40.jpg`],
  ['works/tufting/jellyfish.jpg',         `${COLLECTION}/Tufting/DID-T-017_gople_56x24/2021-03-03 14.15.04.png`],
  ['works/tufting/rainbow-II.jpg',        `${COLLECTION}/Tufting/DID-T-019_rainbow/2021-03-03 14.25.10.png`],
  ['works/tufting/tufted-mask.jpg',       `${COLLECTION}/Tufting/DID-T-023_mask_39x21/2021-03-03 14.42.15.png`],
  ['works/tufting/sitspot-large.jpg',     `${COLLECTION}/Tufting/DID-T-025_sitspot_large/2021-03-03 16.01.06.png`],
  ['works/tufting/universe-hole.jpg',     `${COLLECTION}/Tufting/DID-T-026_univers_med_hul_i_midten/2021-03-03 16.18.34.png`],
  ['works/tufting/green-flower.jpg',      `${COLLECTION}/Tufting/DID-T-040_green-flower/2021-05-14 10.20.17.jpg`],
  ['works/tufting/pink-rug.jpg',          `${COLLECTION}/Tufting/DID-T-042_lyserødt_tæppe_2/2020-06-08 11.36.36.jpg`],
  ['works/tufting/bedroom-rug.jpg',       `${COLLECTION}/Tufting/DID-T-044_tæppe-på-væggen-i-soveværelset/2020-05-29 10.00.38.png`],

  // Works — embroidery
  ['works/embroidery/fuck-alting.jpg',         `${COLLECTION}/Embroidery/DID-E-001_fuck-alting/2020-11-26 12.48.01.jpg`],
  ['works/embroidery/gud-har-meldt-afbud.jpg', `${COLLECTION}/Embroidery/DID-E-002_gud-har-meldt-afbud/2019-06-12 07.39.28.jpg`],
  ['works/embroidery/elsk.jpg',                `${COLLECTION}/Embroidery/DID-E-006_elsk/2021-03-03 15.18.50.png`],
  ['works/embroidery/be-a-dragon.jpg',         `${COLLECTION}/Embroidery/DID-E-007_be-a-dragon/2021-03-03 15.21.56.png`],
  ['works/embroidery/theres-nothing-here.jpg', `${COLLECTION}/Embroidery/DID-E-015_theres-nothing-here/2020-09-01 07.30.27-1.jpg`],
  ['works/embroidery/mariann.jpg',             `${COLLECTION}/Embroidery/DID-E-016_mariann/2020-06-08 13.50.05.jpg`],
  ['works/embroidery/doodles.jpg',             `${COLLECTION}/Embroidery/DID-E-005_doodles/#23 16x21.png`],
  ['works/embroidery/collage-bw.jpg',          `${COLLECTION}/Embroidery/DID-E-008_collage-white-black_100x70/2021-03-03 15.51.27.png`],
  ['works/embroidery/apple-scraps.jpg',        `${COLLECTION}/Embroidery/DID-E-010_apple-scraps/2020-11-26 12.48.50.jpg`],
  ['works/embroidery/perfidt-perfekt.jpg',     `${COLLECTION}/Embroidery/DID-E-012_perfidt-perfekt/2021-05-07 12.22.39.jpg`],
  ['works/embroidery/ingenting.jpg',           `${COLLECTION}/Embroidery/DID-E-013_ingenting/2020-08-01 12.03.35.jpg`],

  // Works — painting
  ['works/painting/universe-1.jpg',         `${COLLECTION}/Paintings/DID-P-003_universe-1/2021-03-03 15.38.26.png`],
  ['works/painting/universe-2.jpg',         `${COLLECTION}/Paintings/DID-P-009_universe-2/2021-03-25 10.31.41.jpg`],
  ['works/painting/universe-3.jpg',         `${COLLECTION}/Paintings/DID-P-017_universe-3/2021-03-12 13.09.32.jpg`],
  ['works/painting/blue-branch.jpg',        `${COLLECTION}/Paintings/DID-P-010_blue-branch/2021-03-25 13.21.43.jpg`],
  ['works/painting/person-walking.jpg',     `${COLLECTION}/Paintings/DID-P-015_person_walking/2021-04-22 09.22.24.jpg`],
  ['works/painting/green-on-blue.jpg',      `${COLLECTION}/Paintings/DID-P-004_green-on-blue-board/2021-03-03 15.43.55.png`],
  ['works/painting/colour-study.jpg',       `${COLLECTION}/Paintings/DID-P-008_colour-study/2020-07-04 08.38.37-2.jpg`],
  ['works/painting/universe-collection.jpg',`${COLLECTION}/Paintings/DID-P-012_universe-collection/2021-04-27 10.37.32.jpg`],
  ['works/painting/colour-study-blue.jpg',  `${COLLECTION}/Paintings/DID-P-013_colour-study-blue/2021-04-27 10.24.24.jpg`],
  ['works/painting/sri-lanka-masks.jpg',    `${COLLECTION}/Paintings/DID-P-021_sri-lanka-masks/2020-07-31 08.49.50.jpg`],

  // Works — photography
  ['works/photography/view-from-the-studio.jpg',       `${COLLECTION}/Photography/DID-PH-002_view-from-the-studio_1500x1000/_52_photo_view-from-the-studio_1500x1000_1.jpg`],
  ['works/photography/blue-flower-on-green-wood.jpg',  `${COLLECTION}/Photography/DID-PH-006_blue-flower-on-green-wood_1500x1000/_56_photo_blue-flower-on-green-wood_1500x1000_1.png`],
  ['works/photography/red-and-green-moss.jpg',         `${COLLECTION}/Photography/DID-PH-007_red-and-green-moss_1500x1000/_57_photo_red-and-green-moss_1500x1000_1.png`],
  ['works/photography/no-ordinary-stone.jpg',          `${COLLECTION}/Photography/DID-PH-008_no-ordinary-stone_1500x1000/_58_photo_no-ordinary-stone_1500x1000_1.png`],
  ['works/photography/taped-objects.jpg',              `${COLLECTION}/Photography/DID-PH-018_taped-objects_1500x1000/_518_photo_taped-objects_1500x1000_1.png`],
  ['works/photography/flowers-on-linen.jpg',           `${COLLECTION}/Photography/DID-PH-019_flowers-on-linen_1500x1000/_519_photo_flowers-on-linen_1500x1000_1.png`],
  ['works/photography/polaroids.jpg',                  `${COLLECTION}/Photography/DID-PH-009_polaroids_1500x1000/_59_photo_polaroids_1500x1000_1.png`],
  ['works/photography/on-the-light-table.jpg',         `${COLLECTION}/Photography/DID-PH-011_on-the-light-table_1500x1000/_511_photo_on-the-light-table_1500x1000_1.png`],
  ['works/photography/dead-flowers.jpg',               `${COLLECTION}/Photography/DID-PH-012_dead-flowers_1500x1000/_512_photo_dead-flowers_1500x1000_2.png`],
  ['works/photography/vase-on-stool.jpg',              `${COLLECTION}/Photography/DID-PH-017_vase-on-stool_1500x1000/_517_photo_vase-on-stool_1500x1000_4.png`],
  ['works/photography/purple-flower.jpg',              `${COLLECTION}/Photography/DID-PH-016_purple-flower_1500x1000/_516_photo_purple-flower_1500x1000_2.png`],
]

// ── Product list: title → blobPathname (same as in rebuild script) ────────────

// Note: multiple products share the same bg image (e.g. framed vs unframed versions)
const PRODUCT_MAP: { title: string; blobPathname: string }[] = [
  // Portrait prints
  { title: 'Neko Paw Print — Yellow',         blobPathname: 'gelato/neko/nekopaw_yellow_outline.png' },
  { title: 'Neko Paw Print — Yellow Neon',    blobPathname: 'gelato/neko/nekopaw_yellow_neon.png' },
  { title: 'Neko Paw Print — Yellow & Blue',  blobPathname: 'gelato/neko/nekopaw_yellow_blue.png' },
  { title: 'Neko Paw Print — Pink',           blobPathname: 'gelato/neko/nekopaw_pink_outline.png' },
  { title: 'Neko Paw Print — Lilac',          blobPathname: 'gelato/neko/nekopaw_lilac_outline.png' },
  { title: 'Neko Paw Print — Yellow II',      blobPathname: 'gelato/neko/nekopaw_yellow_outline1.png' },
  { title: 'Sheroshine — I',                  blobPathname: 'gelato/artphoto/sheroshine-1.jpg' },
  { title: 'Mask — I',                        blobPathname: 'gelato/masks/mask-1.jpg' },
  { title: 'Mask — II',                       blobPathname: 'gelato/masks/mask-2.jpg' },
  { title: 'Mask — III',                      blobPathname: 'gelato/masks/mask-3.jpg' },
  { title: 'Zebra',                           blobPathname: 'gelato/masks/ulrikke-zebra.jpg' },
  { title: 'Solar Face',                      blobPathname: 'gelato/procreate/solar-face.jpg' },
  { title: 'The Fist',                        blobPathname: 'gelato/procreate/the-fist.jpg' },
  { title: 'Sea Monsters — Steel',            blobPathname: 'gelato/procreate/sea-monsters-steel.jpg' },
  { title: 'Sommerby Elements',               blobPathname: 'gelato/procreate/sommerby-elements.jpg' },
  { title: 'Mask — Blasé',                    blobPathname: 'gelato/procreate/mask-blase.jpg' },
  { title: 'Neko Human I',                    blobPathname: 'gelato/procreate/neko-human-i.jpg' },
  { title: 'Neko Human II',                   blobPathname: 'gelato/procreate/neko-human-ii.jpg' },
  { title: 'Botanical — Noir',                blobPathname: 'gelato/procreate/botanical-noir.jpg' },
  { title: 'Botanical — Blanc',               blobPathname: 'gelato/procreate/botanical-blanc.jpg' },
  { title: 'Mask — Calling',                  blobPathname: 'gelato/procreate/mask-calling.jpg' },
  { title: 'Moon Face',                       blobPathname: 'gelato/procreate/moon-face.jpg' },
  { title: 'Mask — Dream',                    blobPathname: 'gelato/procreate/mask-dream.jpg' },
  { title: 'Garden — Cream',                  blobPathname: 'gelato/procreate/garden-cream.jpg' },
  { title: 'Garden — Sky',                    blobPathname: 'gelato/procreate/garden-sky.jpg' },
  { title: 'Garden — Lavender',               blobPathname: 'gelato/procreate/garden-lavender.jpg' },
  { title: 'Garden — Sage',                   blobPathname: 'gelato/procreate/garden-sage.jpg' },
  // Tufting
  { title: 'Purple Sun',            blobPathname: 'works/tufting/purple-sun.jpg' },
  { title: 'Candy I',              blobPathname: 'works/tufting/candy-I.jpg' },
  { title: 'Orange Sun',           blobPathname: 'works/tufting/orange-sun.jpg' },
  { title: 'Rainbow I',            blobPathname: 'works/tufting/rainbow-I.jpg' },
  { title: 'Birds',                blobPathname: 'works/tufting/birds.jpg' },
  { title: 'Du und',               blobPathname: 'works/tufting/du-und.jpg' },
  { title: 'Hej',                  blobPathname: 'works/tufting/hej.jpg' },
  { title: 'Liebes Panopticon',    blobPathname: 'works/tufting/liebes-panopticon.jpg' },
  { title: 'Floral Thing',         blobPathname: 'works/tufting/floral-thing.jpg' },
  { title: 'Round Earth',          blobPathname: 'works/tufting/round-earth.jpg' },
  { title: 'Fleur de Lys',        blobPathname: 'works/tufting/fleur-de-lys.jpg' },
  { title: 'Jellyfish',            blobPathname: 'works/tufting/jellyfish.jpg' },
  { title: 'Rainbow II',           blobPathname: 'works/tufting/rainbow-II.jpg' },
  { title: 'Tufted Mask',          blobPathname: 'works/tufting/tufted-mask.jpg' },
  { title: 'Sitspot Large',        blobPathname: 'works/tufting/sitspot-large.jpg' },
  { title: 'Universe with a Hole', blobPathname: 'works/tufting/universe-hole.jpg' },
  { title: 'Green Flower',         blobPathname: 'works/tufting/green-flower.jpg' },
  { title: 'Pink Rug',             blobPathname: 'works/tufting/pink-rug.jpg' },
  { title: 'Bedroom Rug',          blobPathname: 'works/tufting/bedroom-rug.jpg' },
  // Embroidery
  { title: 'Fuck Alting',              blobPathname: 'works/embroidery/fuck-alting.jpg' },
  { title: 'Gud Har Meldt Afbud',     blobPathname: 'works/embroidery/gud-har-meldt-afbud.jpg' },
  { title: 'Elsk',                     blobPathname: 'works/embroidery/elsk.jpg' },
  { title: 'Be a Dragon',             blobPathname: 'works/embroidery/be-a-dragon.jpg' },
  { title: "There's Nothing Here",    blobPathname: 'works/embroidery/theres-nothing-here.jpg' },
  { title: 'Mariann',                  blobPathname: 'works/embroidery/mariann.jpg' },
  { title: 'Doodles',                  blobPathname: 'works/embroidery/doodles.jpg' },
  { title: 'Collage (Black & White)', blobPathname: 'works/embroidery/collage-bw.jpg' },
  { title: 'Apple Scraps',            blobPathname: 'works/embroidery/apple-scraps.jpg' },
  { title: 'Perfidt Perfekt',         blobPathname: 'works/embroidery/perfidt-perfekt.jpg' },
  { title: 'Ingenting',               blobPathname: 'works/embroidery/ingenting.jpg' },
  // Landscape prints
  { title: 'Tourism — I',   blobPathname: 'gelato/tourism/tourism-1.jpg' },
  { title: 'Tourism — II',  blobPathname: 'gelato/tourism/tourism-2.jpg' },
  { title: 'Tourism — III', blobPathname: 'gelato/tourism/tourism-3.jpg' },
  { title: 'Tourism — IV',  blobPathname: 'gelato/tourism/tourism-4.jpg' },
  { title: 'Elephant — Green',  blobPathname: 'gelato/elephants/elephant-green.jpg' },
  { title: 'Elephant — Yellow', blobPathname: 'gelato/elephants/elephant-yellow.jpg' },
  { title: 'Elephant — Lilac',  blobPathname: 'gelato/elephants/elephant-lilac.jpg' },
  { title: 'Elephant — Red',    blobPathname: 'gelato/elephants/elephant-red.jpg' },
  { title: 'Mask Study',        blobPathname: 'gelato/procreate/mask-study.jpg' },
  { title: 'SHERO — Purple',    blobPathname: 'gelato/procreate/shero-purple.jpg' },
  { title: 'SHERO — Indigo',    blobPathname: 'gelato/procreate/shero-indigo.jpg' },
  { title: 'SHERO — III',       blobPathname: 'gelato/procreate/shero-3.jpg' },
  { title: 'Two Cats',           blobPathname: 'gelato/procreate/two-cats.jpg' },
  { title: 'Sea Monsters — Blue',blobPathname: 'gelato/procreate/sea-monsters-blue.jpg' },
  // Paintings
  { title: 'Universe I',            blobPathname: 'works/painting/universe-1.jpg' },
  { title: 'Universe II',           blobPathname: 'works/painting/universe-2.jpg' },
  { title: 'Universe III',          blobPathname: 'works/painting/universe-3.jpg' },
  { title: 'Blue Branch',           blobPathname: 'works/painting/blue-branch.jpg' },
  { title: 'Person Walking',        blobPathname: 'works/painting/person-walking.jpg' },
  { title: 'Green on Blue',         blobPathname: 'works/painting/green-on-blue.jpg' },
  { title: 'Colour Study',          blobPathname: 'works/painting/colour-study.jpg' },
  { title: 'Universe Collection',   blobPathname: 'works/painting/universe-collection.jpg' },
  { title: 'Colour Study Blue',     blobPathname: 'works/painting/colour-study-blue.jpg' },
  { title: 'Sri Lanka Masks',       blobPathname: 'works/painting/sri-lanka-masks.jpg' },
  // Photography
  { title: 'View from the Studio',      blobPathname: 'works/photography/view-from-the-studio.jpg' },
  { title: 'Blue Flower on Green Wood', blobPathname: 'works/photography/blue-flower-on-green-wood.jpg' },
  { title: 'Red and Green Moss',        blobPathname: 'works/photography/red-and-green-moss.jpg' },
  { title: 'No Ordinary Stone',         blobPathname: 'works/photography/no-ordinary-stone.jpg' },
  { title: 'Taped Objects',             blobPathname: 'works/photography/taped-objects.jpg' },
  { title: 'Flowers on Linen',          blobPathname: 'works/photography/flowers-on-linen.jpg' },
  { title: 'Polaroids',                 blobPathname: 'works/photography/polaroids.jpg' },
  { title: 'On the Light Table',        blobPathname: 'works/photography/on-the-light-table.jpg' },
  { title: 'Dead Flowers',              blobPathname: 'works/photography/dead-flowers.jpg' },
  { title: 'Vase on Stool',             blobPathname: 'works/photography/vase-on-stool.jpg' },
  { title: 'Purple Flower',             blobPathname: 'works/photography/purple-flower.jpg' },
  // Square
  { title: 'Sheroshine — I',    blobPathname: 'gelato/square/sheroshine.jpg' },
  { title: 'Kaninskoven',        blobPathname: 'gelato/square/kaninskoven.jpg' },
  { title: 'Monsters — Pattern', blobPathname: 'gelato/square/monsters-pattern.jpg' },
  { title: 'Moondancer',         blobPathname: 'gelato/square/moondancer.jpg' },
  { title: 'Sleeping Cat',       blobPathname: 'gelato/procreate/sleeping-cat.jpg' },
  { title: 'Floating Poppies',   blobPathname: 'gelato/procreate/floating-poppies.jpg' },
  { title: 'Night Poppies',      blobPathname: 'gelato/procreate/night-poppies.jpg' },
  { title: 'Poppy Field',        blobPathname: 'gelato/procreate/poppy-field.jpg' },
  { title: 'Forget-Me-Not',      blobPathname: 'gelato/procreate/forget-me-not.jpg' },
  { title: 'Sea Monsters — Gold',blobPathname: 'gelato/procreate/sea-monsters-gold.jpg' },
  { title: 'Sea Monsters — Cream',blobPathname: 'gelato/procreate/sea-monsters-cream.jpg' },
  { title: 'Geometric Garden',   blobPathname: 'gelato/procreate/geometric-garden.jpg' },
  { title: 'Mask — Conformist',  blobPathname: 'gelato/procreate/mask-conformist.jpg' },
  { title: 'The Fist — Blue',    blobPathname: 'gelato/procreate/fist-blue.jpg' },
  { title: 'The Fist — Ink',     blobPathname: 'gelato/procreate/fist-ink.jpg' },
  // Framed portrait
  { title: 'Neko Paw — Yellow (Framed)',       blobPathname: 'gelato/neko/nekopaw_yellow_outline.png' },
  { title: 'Neko Paw — Yellow Neon (Framed)',  blobPathname: 'gelato/neko/nekopaw_yellow_neon.png' },
  { title: 'Neko Paw — Yellow & Blue (Framed)',blobPathname: 'gelato/neko/nekopaw_yellow_blue.png' },
  { title: 'Neko Paw — Pink (Framed)',         blobPathname: 'gelato/neko/nekopaw_pink_outline.png' },
  { title: 'Neko Paw — Lilac (Framed)',        blobPathname: 'gelato/neko/nekopaw_lilac_outline.png' },
  { title: 'Sheroshine (Framed)',              blobPathname: 'gelato/framed-vertical/sheroshine.jpg' },
  { title: 'Strong Floral (Framed)',           blobPathname: 'gelato/framed-vertical/strong-floral.jpg' },
  // Framed horizontal
  { title: 'Tourism I — Framed',      blobPathname: 'gelato/tourism/tourism-1.jpg' },
  { title: 'Tourism II — Framed',     blobPathname: 'gelato/tourism/tourism-2.jpg' },
  { title: 'Tourism III — Framed',    blobPathname: 'gelato/tourism/tourism-3.jpg' },
  { title: 'Tourism IV — Framed',     blobPathname: 'gelato/tourism/tourism-4.jpg' },
  { title: 'Elephant Green — Framed', blobPathname: 'gelato/elephants/elephant-green.jpg' },
  { title: 'Elephant Yellow — Framed',blobPathname: 'gelato/elephants/elephant-yellow.jpg' },
  { title: 'Elephant Lilac — Framed', blobPathname: 'gelato/elephants/elephant-lilac.jpg' },
  { title: 'Elephant Red — Framed',   blobPathname: 'gelato/elephants/elephant-red.jpg' },
  // Posters
  { title: 'Neko Paw — Yellow (Poster)',       blobPathname: 'gelato/neko/nekopaw_yellow_outline.png' },
  { title: 'Neko Paw — Yellow Neon (Poster)',  blobPathname: 'gelato/neko/nekopaw_yellow_neon.png' },
  { title: 'Neko Paw — Yellow & Blue (Poster)',blobPathname: 'gelato/neko/nekopaw_yellow_blue.png' },
  { title: 'Neko Paw — Pink (Poster)',         blobPathname: 'gelato/neko/nekopaw_pink_outline.png' },
]

// ── Auth ──────────────────────────────────────────────────────────────────────

let _token: string | null = null

async function getToken(): Promise<string> {
  if (_token) return _token
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
  })
  if (!res.ok) throw new Error(`Token mint failed: ${res.status}`)
  const data = await res.json() as { access_token: string }
  _token = data.access_token
  return _token
}

async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = await getToken()
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as { data: T; errors?: unknown[] }
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  return json.data
}

// ── File helpers ──────────────────────────────────────────────────────────────

function toJpeg(srcPath: string): string {
  const tmp = `${tmpdir()}/shopify-upload-${Date.now()}.jpg`
  execSync(`sips -s format jpeg -s formatOptions 92 "${srcPath}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

function prepareFile(localPath: string): { path: string; mimeType: string; cleanup?: () => void } {
  if (!existsSync(localPath)) throw new Error(`File not found: ${localPath}`)
  const ext = localPath.toLowerCase().split('.').pop() ?? ''

  if (['tif', 'tiff'].includes(ext)) {
    const jpegPath = toJpeg(localPath)
    return { path: jpegPath, mimeType: 'image/jpeg', cleanup: () => { try { unlinkSync(jpegPath) } catch {} } }
  }

  // Convert large PNGs to JPEG to keep file size manageable
  if (ext === 'png') {
    const sizeMb = statSync(localPath).size / 1024 / 1024
    if (sizeMb > 8) {
      const jpegPath = toJpeg(localPath)
      return { path: jpegPath, mimeType: 'image/jpeg', cleanup: () => { try { unlinkSync(jpegPath) } catch {} } }
    }
    return { path: localPath, mimeType: 'image/png' }
  }

  return { path: localPath, mimeType: 'image/jpeg' }
}

// ── Shopify staged upload ──────────────────────────────────────────────────────

async function stageUpload(filename: string, mimeType: string, fileSize: number) {
  const data = await graphql<{
    stagedUploadsCreate: {
      stagedTargets: {
        url: string
        resourceUrl: string
        parameters: { name: string; value: string }[]
      }[]
      userErrors: { field: string[]; message: string }[]
    }
  }>(
    `mutation StagedUpload($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
        userErrors { field message }
      }
    }`,
    {
      input: [{
        filename,
        mimeType,
        resource: 'IMAGE',
        httpMethod: 'POST',
        fileSize: String(fileSize),
      }],
    }
  )
  const errs = data.stagedUploadsCreate.userErrors
  if (errs.length) throw new Error(`Stage upload errors: ${errs.map(e => e.message).join(', ')}`)
  return data.stagedUploadsCreate.stagedTargets[0]
}

async function uploadToStage(target: { url: string; parameters: { name: string; value: string }[] }, filePath: string, mimeType: string) {
  const form = new FormData()
  for (const { name, value } of target.parameters) {
    form.append(name, value)
  }
  const fileBuffer = readFileSync(filePath)
  const filename = filePath.split('/').pop() ?? 'image'
  form.append('file', new Blob([fileBuffer], { type: mimeType }), filename)

  const res = await fetch(target.url, { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`S3 upload failed ${res.status}: ${body.slice(0, 200)}`)
  }
}

async function attachImageToProduct(productId: string, resourceUrl: string, alt: string) {
  const data = await graphql<{
    productCreateMedia: {
      media: { id?: string; status?: string }[]
      mediaUserErrors: { field: string[]; message: string }[]
    }
  }>(
    `mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id status } }
        mediaUserErrors { field message }
      }
    }`,
    {
      productId,
      media: [{ originalSource: resourceUrl, mediaContentType: 'IMAGE', alt }],
    }
  )
  const errs = data.productCreateMedia.mediaUserErrors
  if (errs.length) throw new Error(`Media errors: ${errs.map(e => e.message).join(', ')}`)
}

// ── Get all Shopify products ───────────────────────────────────────────────────

async function getAllProducts(): Promise<{ id: string; title: string; hasImage: boolean }[]> {
  const products: { id: string; title: string; hasImage: boolean }[] = []
  let cursor: string | null = null

  while (true) {
    const data = await graphql<{
      products: {
        edges: { node: { id: string; title: string; images: { edges: unknown[] } } }[]
        pageInfo: { hasNextPage: boolean; endCursor: string }
      }
    }>(
      `query GetProducts($after: String) {
        products(first: 100, query: "status:active", after: $after) {
          edges { node { id title images(first: 1) { edges { node { id } } } } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after: cursor }
    )

    for (const { node } of data.products.edges) {
      products.push({ id: node.id, title: node.title, hasImage: node.images.edges.length > 0 })
    }

    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
    await delay(300)
  }

  return products
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const blobToLocal = new Map(BLOB_TO_LOCAL)

  console.log('Fetching all Shopify products...')
  const shopifyProducts = await getAllProducts()
  const productByTitle = new Map(shopifyProducts.map(p => [p.title.toLowerCase(), p]))

  const alreadyHaveImages = shopifyProducts.filter(p => p.hasImage).length
  console.log(`Total products: ${shopifyProducts.length}`)
  console.log(`Already have images: ${alreadyHaveImages}`)
  console.log(`Need images: ${shopifyProducts.length - alreadyHaveImages}`)
  console.log()

  let ok = 0, skipped = 0, failed = 0, notFound = 0

  for (const { title, blobPathname } of PRODUCT_MAP) {
    const product = productByTitle.get(title.toLowerCase())
    if (!product) {
      console.log(`⚠ Not in Shopify: "${title}"`)
      notFound++
      continue
    }

    if (product.hasImage) {
      process.stdout.write(`⟳ ${title.slice(0, 60)} — already has image, skipping\n`)
      skipped++
      continue
    }

    const localPath = blobToLocal.get(blobPathname)
    if (!localPath) {
      console.log(`⚠ No local file mapping for: ${blobPathname}`)
      failed++
      continue
    }

    if (!existsSync(localPath)) {
      console.log(`⚠ File missing: ${localPath}`)
      failed++
      continue
    }

    process.stdout.write(`▸ ${title.slice(0, 60)}... `)

    if (DRY_RUN) {
      console.log(`DRY RUN — would upload ${localPath.split('/').pop()}`)
      ok++
      continue
    }

    let cleanup: (() => void) | undefined
    try {
      const prepared = prepareFile(localPath)
      cleanup = prepared.cleanup

      const fileSize = statSync(prepared.path).size
      const filename = prepared.path.split('/').pop()!

      const target = await stageUpload(filename, prepared.mimeType, fileSize)
      await uploadToStage(target, prepared.path, prepared.mimeType)
      await attachImageToProduct(product.id, target.resourceUrl, title)

      console.log('✓')
      ok++
      await delay(500)
    } catch (err) {
      console.log(`FAILED: ${err}`)
      failed++
    } finally {
      cleanup?.()
    }
  }

  console.log(`\n── Done ──────────────────────────────────`)
  console.log(`Uploaded:   ${ok}`)
  console.log(`Skipped:    ${skipped} (already had images)`)
  console.log(`Not found:  ${notFound} (not in Shopify)`)
  console.log(`Failed:     ${failed}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
