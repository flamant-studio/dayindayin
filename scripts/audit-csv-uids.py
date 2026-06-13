#!/usr/bin/env python3
"""
Audit: confirm each CSV's productUid appears in its template's actual variant list.
Reads GELATO_API_KEY from .env.local.
"""
import urllib.request, json, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
ENV  = ROOT / ".env.local"

def read_env(key):
    for line in ENV.read_text().splitlines():
        if line.startswith(f"{key}="):
            val = line[len(key)+1:].strip().strip('"').strip("'")
            return val
    raise ValueError(f"{key} not found in {ENV}")

KEY = read_env("GELATO_API_KEY")

TEMPLATES = {
    "mug":          "0e9a0a04-1016-4216-9a40-4f42a00b8dca",
    "tote":         "a28d9355-d78d-4d13-afec-8f120d989280",
    "tank-top":     "2edd0df8-f9b1-4037-a7a2-456cd768739d",
    "square":       "e88c70d0-745b-436f-962a-c45bee52c2f6",
    "framed-vert":  "392687cd-4959-4186-bc3a-fb135d1e0c1d",
    "framed-horiz": "992be2b6-4005-4abb-884c-9d4fa2f4affb",
    "postcard-h":   "7d1420de-a541-4c80-bea4-3ede650be932",
    "postcard-v":   "31291c4e-afc0-4038-9103-fd58ab3ce441",
    "water-bottle": "8d192eeb-22c2-49cf-bb6f-b7df07fe11ce",
    "wood-print":   "01f297ae-5d03-41bc-8ffe-44e023c4d7c6",
    "dad-cap":      "4350a3d2-888e-4b7f-a504-90d4fc34d9a4",
}

CSV_MAP = [
    ("gelato_mug_export.csv",               "mug",          "mug_product_msz_11-oz_mmat_ceramic-white_cl_4-0"),
    ("gelato_tote_export.csv",              "tote",         "bag_product_bsc_tote-bag_bqa_prm_bsi_std-t_bco_natural_bpr_4-4"),
    ("gelato_tank_top_export.csv",          "tank-top",     "apparel_product_gca_t-shirt_gsc_tank-top_gcu_unisex_gqa_prm_gsi_m_gco_white_gpr_4-0"),
    ("gelato_fap_square_export.csv",        "square",       "fine_arts_poster_geo_simplified_product_12-0_ver_300x300-mm-12x12-inch_200-gsm-80lb-enhanced-uncoated"),
    ("gelato_framed_vertical_export.csv",   "framed-vert",  "framed_poster_mounted_premium_210x297mm-8x12-inch_black_wood_w20xt20-mm_plexiglass_a4-8x12-inch_250-gsm-100lb-uncoated-offwhite-archival_4-0_ver"),
    ("gelato_framed_horizontal_export.csv", "framed-horiz", "framed_poster_mounted_premium_210x297mm-8x12-inch_black_wood_w20xt20-mm_plexiglass_a4-8x12-inch_250-gsm-100lb-uncoated-offwhite-archival_4-0_hor"),
    ("gelato_postcard_hor_export.csv",      "postcard-h",   "pack_of_cards_qt_10_pcs_pf_a6_upt_350-gsm-130lb-coated-silk_cl_4-4_ct_glossy-protection_prt_1-0_sft_none_set_none_hor"),
    ("gelato_postcard_ver_export.csv",      "postcard-v",   "pack_of_cards_qt_10_pcs_pf_a6_upt_350-gsm-130lb-coated-silk_cl_4-4_ct_glossy-protection_prt_1-0_sft_none_set_none_ver"),
    ("gelato_water_bottle_export.csv",      "water-bottle", "bottle_product_bsz_17-oz_bmat_stainless-steel-white_cl_4-0"),
    ("gelato_wood_print_export.csv",        "wood-print",   "wood_200x200-mm-8x8-inch_lined-plywood_20-mm_hor-grain_4-0_ver"),
    ("gelato_dadcap_export.csv",            "dad-cap",      "apparel_product_gca_hat_gsc_dad-hat_gcu_unisex_gqa_organic_gsi_onesize_gco_graphite-grey_gpr_4-0-emb_beechfield_b54n"),
]

def fetch(url):
    req = urllib.request.Request(url, headers={"X-API-KEY": KEY})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

all_ok = True
print(f"\n{'CSV file':<42} {'Template':<13} {'Result'}")
print("-" * 120)

for csv_file, tmpl_key, csv_uid in CSV_MAP:
    tid = TEMPLATES[tmpl_key]
    d = fetch(f"https://ecommerce.gelatoapis.com/v1/templates/{tid}")
    template_uids = list(dict.fromkeys(v.get("productUid","") for v in d.get("variants",[])))
    match = csv_uid in template_uids
    if not match:
        all_ok = False
    status = "✓ OK" if match else "✗ MISMATCH"
    print(f"{csv_file:<42} {tmpl_key:<13} {status}")
    print(f"  CSV uid: {csv_uid}")
    print(f"  Tpl uid: {template_uids}")
    print()

print("=" * 60)
print("ALL OK" if all_ok else "MISMATCHES FOUND — CSVs need fixing before import")
