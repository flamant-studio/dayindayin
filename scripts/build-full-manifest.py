#!/usr/bin/env python3
"""
Build full MANIFEST.csv from all Gelato CSV exports.
Also checks GitHub raw URLs for HTTP 200.
"""

import csv
import os
import urllib.request
import urllib.error
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
CSV_DIR = BASE_DIR / "DayInDayIn Images"
MANIFEST_PATH = BASE_DIR / "MANIFEST.csv"

# Product type definitions
PRODUCT_TYPES = [
    {
        "csv": "gelato_fap_vertical_export.csv",
        "type": "Art Print — Vertical",
        "creation": "template",
        "template_uid": "6005fae3-64a6-4f62-8328-93d2ce6bae58",
        "expected_variants": 3,
        "status": "EXISTING",
        "variant_note": "A4 / A3 / A2",
    },
    {
        "csv": "gelato_fap_horizontal_export.csv",
        "type": "Art Print — Horizontal",
        "creation": "template",
        "template_uid": "18600284-2b9d-433a-af02-d728dc81e83b",
        "expected_variants": 3,
        "status": "EXISTING",
        "variant_note": "A5 / A4 / A3",
    },
    {
        "csv": "gelato_fap_square_export.csv",
        "type": "Art Print — Square",
        "creation": "template",
        "template_uid": "e88c70d0-745b-436f-962a-c45bee52c2f6",
        "expected_variants": 4,
        "status": "NEW",
        "variant_note": "25×25 / 30×30 / 40×40 / 50×50 cm",
    },
    {
        "csv": "gelato_framed_vertical_export.csv",
        "type": "Framed Print — Vertical",
        "creation": "template",
        "template_uid": "392687cd-4959-4186-bc3a-fb135d1e0c1d",
        "expected_variants": 12,
        "status": "NEW",
        "variant_note": "A4/A3/A2/A1 × black/white/wood frame",
    },
    {
        "csv": "gelato_framed_horizontal_export.csv",
        "type": "Framed Print — Horizontal",
        "creation": "template",
        "template_uid": "992be2b6-4005-4abb-884c-9d4fa2f4affb",
        "expected_variants": 12,
        "status": "NEW",
        "variant_note": "A4/A3/A2/A1 × black/white/wood frame",
    },
    {
        "csv": "gelato_mug_export.csv",
        "type": "Mug",
        "creation": "template",
        "template_uid": "0e9a0a04-1016-4216-9a40-4f42a00b8dca",
        "expected_variants": 4,
        "status": "EXISTING",
        "variant_note": "White/Black × Design A/B",
    },
    {
        "csv": "gelato_tote_export.csv",
        "type": "Tote Bag",
        "creation": "template",
        "template_uid": "a28d9355",
        "expected_variants": 1,
        "status": "EXISTING",
        "variant_note": "Natural cotton",
    },
    {
        "csv": "gelato_tank_top_export.csv",
        "type": "Tank Top",
        "creation": "template",
        "template_uid": "2edd0df8",
        "expected_variants": 6,
        "status": "EXISTING",
        "variant_note": "XS / S / M / L / XL / 2XL",
    },
    {
        "csv": "gelato_postcard_hor_export.csv",
        "type": "Postcard — Horizontal",
        "creation": "template",
        "template_uid": "7d1420de-a541-4c80-bea4-3ede650be932",
        "expected_variants": 1,
        "status": "NEW",
        "variant_note": "Pack of 10, A6",
    },
    {
        "csv": "gelato_postcard_ver_export.csv",
        "type": "Postcard — Vertical",
        "creation": "template",
        "template_uid": "31291c4e-afc0-4038-9103-fd58ab3ce441",
        "expected_variants": 1,
        "status": "NEW",
        "variant_note": "Pack of 10, A6",
    },
    {
        "csv": "gelato_water_bottle_export.csv",
        "type": "Water Bottle",
        "creation": "template",
        "template_uid": "8d192eeb-22c2-49cf-bb6f-b7df07fe11ce",
        "expected_variants": 1,
        "status": "NEW",
        "variant_note": "17oz stainless white",
    },
    {
        "csv": "gelato_wood_print_export.csv",
        "type": "Wood Print",
        "creation": "template",
        "template_uid": "01f297ae-5d03-41bc-8ffe-44e023c4d7c6",
        "expected_variants": 1,
        "status": "NEW",
        "variant_note": "200×200mm birch",
    },
    {
        "csv": "gelato_dadcap_export.csv",
        "type": "Dad Cap",
        "creation": "template",
        "template_uid": "4350a3d2-888e-4b7f-a504-90d4fc34d9a4",
        "expected_variants": 2,
        "status": "NEW",
        "variant_note": "One size, 2 colour variants, embroidered",
    },
]

def parse_csv(csv_path):
    rows = []
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def infer_series(title, url):
    t = title.lower()
    u = url.lower()
    if 'neko' in t or 'neko' in u:
        return 'NEKO'
    if 'shero' in t or 'shero' in u:
        return 'SHERO'
    if 'sea monster' in t or 'sea_monster' in u:
        return 'Sea Monsters'
    if 'monster' in t and 'sea' not in t:
        return 'Patterns'
    if 'kaninskoven' in t:
        return 'Patterns'
    if 'botanical' in t or 'garden' in t or 'poppy' in t or 'poppies' in t or 'forget' in t:
        return 'Botanical'
    if 'elephant' in t:
        return 'Elephant'
    if 'mask' in t or 'moon face' in t or 'solar face' in t:
        return 'Masks'
    if 'tourism' in t:
        return 'Tourism'
    if 'zebra' in t:
        return 'Animals'
    if 'sleeping cat' in t:
        return 'NEKO'
    if 'geometric' in t:
        return 'Various'
    if 'sommerby' in t or 'floating' in t or 'night' in t:
        return 'Various'
    return 'Various'

def check_url(url):
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=10) as resp:
            return str(resp.status)
    except urllib.error.HTTPError as e:
        return str(e.code)
    except Exception as e:
        return f"ERR:{str(e)[:30]}"

rows_out = []
all_urls = set()

for pt in PRODUCT_TYPES:
    csv_path = CSV_DIR / pt["csv"]
    if not csv_path.exists():
        print(f"MISSING CSV: {pt['csv']}")
        continue

    products = parse_csv(csv_path)
    for p in products:
        title = p.get("Product Title", "").strip()
        url = p.get("Print File URL", "").strip()
        if not title:
            continue
        all_urls.add(url)
        series = infer_series(title, url)
        rows_out.append({
            "product_title": title,
            "type": pt["type"],
            "series": series,
            "artwork_url": url,
            "creation_method": pt["creation"],
            "template_or_productuid": pt["template_uid"],
            "expected_variants": pt["expected_variants"],
            "variant_note": pt["variant_note"],
            "status": pt["status"],
            "url_check": "",
        })

print(f"Total rows: {len(rows_out)}")
print(f"Unique URLs to check: {len(all_urls)}")

# Check all unique URLs
print("Checking GitHub URLs...")
url_results = {}
for i, url in enumerate(sorted(all_urls)):
    result = check_url(url)
    url_results[url] = result
    if result != "200":
        print(f"  [{i+1}/{len(all_urls)}] {result}: {url}")
    elif (i+1) % 20 == 0:
        print(f"  [{i+1}/{len(all_urls)}] OK so far...")

# Backfill url_check
for row in rows_out:
    row["url_check"] = url_results.get(row["artwork_url"], "?")

# Count results
ok_count = sum(1 for r in url_results.values() if r == "200")
fail_count = len(url_results) - ok_count
print(f"\nURL audit: {ok_count}/{len(url_results)} OK, {fail_count} failed")

# Write manifest
fieldnames = ["product_title","type","series","artwork_url","creation_method",
              "template_or_productuid","expected_variants","variant_note","status","url_check"]

with open(MANIFEST_PATH, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows_out)

# Summary table
from collections import Counter
type_counts = Counter(r["type"] for r in rows_out)
status_counts = Counter(r["status"] for r in rows_out)
method_counts = Counter(r["creation_method"] for r in rows_out)

print("\n=== MANIFEST SUMMARY ===")
print(f"Total products: {len(rows_out)}")
print(f"  EXISTING (in Gelato already): {status_counts['EXISTING']}")
print(f"  NEW (to be created): {status_counts['NEW']}")
print(f"  Template-based: {method_counts['template']}")
print(f"  CSV-import: {method_counts['csv-import']}")
print("\nBy type:")
for t, c in sorted(type_counts.items()):
    print(f"  {t}: {c}")

print(f"\nManifest written to: {MANIFEST_PATH}")
