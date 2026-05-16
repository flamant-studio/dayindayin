/**
 * Gelato product UID catalog.
 * Maps DayInDayIn product formats to Gelato product UIDs.
 * UIDs verified against Gelato DK catalog (reference: mikofu project, 2026-05-15).
 *
 * Format key matches ProductFormat in lib/catalog/types.ts
 */

import type { GelatoFormatMap } from '../catalog/types'

export const GELATO_FORMAT_UIDS: Record<string, GelatoFormatMap> = {
  'fine-art-print-a4': {
    productUid: 'cards_pf_a4_pt_250-gsm-coated-silk_cl_4-0_ver',
    description: 'A4 Fine Art Print, 250gsm coated silk',
    orientation: 'ver',
  },
  'poster-30x45': {
    productUid: 'flat_300x450-mm-12x18-inch_200-gsm-80lb-uncoated_4-0_ver',
    description: 'Poster 30×45cm, 200gsm uncoated',
    orientation: 'ver',
  },
  'canvas-30x40': {
    productUid: 'canvas_300x400-mm-12x16-inch_canvas_wood-fsc-slim_4-0_ver',
    description: 'Canvas 30×40cm, slim wood frame, FSC certified',
    orientation: 'ver',
  },
  'framed-print-30x40': {
    productUid: 'framed_300x400-mm-12x16-inch_fine-art_matte-white_4-0_ver',
    description: 'Framed Print 30×40cm, matte white frame',
    orientation: 'ver',
  },
  'wall-hanging-70x100': {
    productUid: 'wall_hanging_poster_1010-mm_black_wood_w14xt20-mm_28x40-inch-700x1000-mm_200-gsm-80lb-uncoated_4-0_ver',
    description: 'Wall Hanging 70×100cm, black wood rod, 200gsm uncoated',
    orientation: 'ver',
  },
  'mug-11oz': {
    productUid: 'mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0',
    description: 'Ceramic Mug 11oz, white',
    orientation: 'both',
  },
  'tote-bag': {
    productUid: 'bag_product_bsc_tote-bag_bqa_clc_bsi_std-t_bco_black_bpr_4-0',
    description: 'Tote Bag, black, standard size',
    orientation: 'ver',
  },
}

/**
 * Get Gelato product UID for a given format.
 * Returns null if format is unknown (do not throw — caller decides what to do).
 */
export function getGelatoUid(format: string): string | null {
  return GELATO_FORMAT_UIDS[format]?.productUid ?? null
}
