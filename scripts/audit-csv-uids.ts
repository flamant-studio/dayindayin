/**
 * audit-csv-uids.ts
 * Confirms each CSV's productUid appears in the actual template variant list.
 * Run: npx tsx scripts/audit-csv-uids.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!

const TEMPLATES: Record<string, string> = {
  'mug':          '0e9a0a04-1016-4216-9a40-4f42a00b8dca',
  'tote':         'a28d9355-d78d-4d13-afec-8f120d989280',
  'tank-top':     '2edd0df8-f9b1-4037-a7a2-456cd768739d',
  'square':       'e88c70d0-745b-436f-962a-c45bee52c2f6',
  'framed-vert':  '392687cd-4959-4186-bc3a-fb135d1e0c1d',
  'framed-horiz': '992be2b6-4005-4abb-884c-9d4fa2f4affb',
  'postcard-h':   '7d1420de-a541-4c80-bea4-3ede650be932',
  'postcard-v':   '31291c4e-afc0-4038-9103-fd58ab3ce441',
  'water-bottle': '8d192eeb-22c2-49cf-bb6f-b7df07fe11ce',
  'wood-print':   '01f297ae-5d03-41bc-8ffe-44e023c4d7c6',
  'dad-cap':      '4350a3d2-888e-4b7f-a504-90d4fc34d9a4',
}

const CSV_MAP: Array<[string, string, string]> = [
  ['gelato_mug_export.csv',               'mug',          'mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0'],
  ['gelato_tote_export.csv',              'tote',         'bag_product_bsc_tote-bag_bqa_prm_bsi_std-t_bco_natural_bpr_4-4'],
  ['gelato_tank_top_export.csv',          'tank-top',     'apparel_product_gca_t-shirt_gsc_tank-top_gcu_unisex_gqa_prm_gsi_m_gco_white_gpr_4-0'],
  ['gelato_fap_square_export.csv',        'square',       'fine_arts_poster_geo_simplified_product_12-0_ver_300x300-mm-12x12-inch_200-gsm-80lb-enhanced-uncoated'],
  ['gelato_framed_vertical_export.csv',   'framed-vert',  'framed_poster_mounted_premium_210x297mm-8x12-inch_black_wood_w20xt20-mm_plexiglass_a4-8x12-inch_250-gsm-100lb-uncoated-offwhite-archival_4-0_ver'],
  ['gelato_framed_horizontal_export.csv', 'framed-horiz', 'framed_poster_mounted_premium_210x297mm-8x12-inch_black_wood_w20xt20-mm_plexiglass_a4-8x12-inch_250-gsm-100lb-uncoated-offwhite-archival_4-0_hor'],
  ['gelato_postcard_hor_export.csv',      'postcard-h',   'pack_of_cards_qt_10_pcs_pf_a6_upt_350-gsm-130lb-coated-silk_cl_4-4_ct_glossy-protection_prt_1-0_sft_none_set_none_hor'],
  ['gelato_postcard_ver_export.csv',      'postcard-v',   'pack_of_cards_qt_10_pcs_pf_a6_upt_350-gsm-130lb-coated-silk_cl_4-4_ct_glossy-protection_prt_1-0_sft_none_set_none_ver'],
  ['gelato_water_bottle_export.csv',      'water-bottle', 'bottle_product_bsz_17-oz_bmat_stainless-steel-white_cl_4-0'],
  ['gelato_wood_print_export.csv',        'wood-print',   'wood_200x200-mm-8x8-inch_lined-plywood_20-mm_hor-grain_4-0_ver'],
  ['gelato_dadcap_export.csv',            'dad-cap',      'apparel_product_gca_hat_gsc_dad-hat_gcu_unisex_gqa_organic_gsi_onesize_gco_graphite-grey_gpr_4-0-emb_beechfield_b54n'],
]

async function fetchTemplate(tid: string): Promise<any> {
  const res = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${tid}`, {
    headers: { 'X-API-KEY': KEY },
  })
  if (!res.ok) throw new Error(`${res.status} fetching template ${tid}`)
  return res.json()
}

async function main() {
  let allOk = true
  console.log(`\n${'CSV file'.padEnd(42)} ${'Template'.padEnd(13)} Result`)
  console.log('-'.repeat(110))

  for (const [csvFile, tmplKey, csvUid] of CSV_MAP) {
    const tid = TEMPLATES[tmplKey]
    const d = await fetchTemplate(tid)
    const tplUids: string[] = [...new Set<string>(
      (d.variants ?? []).map((v: any) => v.productUid as string)
    )]
    const match = tplUids.includes(csvUid)
    if (!match) allOk = false
    const status = match ? '✓ OK   ' : '✗ MISMATCH'
    console.log(`${csvFile.padEnd(42)} ${tmplKey.padEnd(13)} ${status}`)
    console.log(`  CSV: ${csvUid}`)
    console.log(`  TPL: ${tplUids.join(' | ')}`)
    console.log()
    await new Promise(r => setTimeout(r, 200))
  }

  console.log('='.repeat(60))
  console.log(allOk ? 'ALL OK — CSVs safe to import' : 'MISMATCHES FOUND — fix CSVs before import')
}

main().catch(e => { console.error(e); process.exit(1) })
