# Seed Scripts

Scripts to populate the DayInDayIn Shopify store with collections and products.

## Prerequisites

Before running any seed script:

1. **Install Gelato in Shopify admin**
   - Go to dayindayin.myshopify.com/admin
   - Apps → Gelato → Install
   - Connect Gelato account and configure DK as the primary market

2. **Environment variables in `.env.local`**
   - `SHOPIFY_STORE_DOMAIN` — already set
   - `SHOPIFY_CLIENT_ID` — already set
   - `SHOPIFY_CLIENT_SECRET` — already set

3. **Install tsx** (for running TypeScript scripts directly)
   ```
   npm install -D tsx
   ```

## Step 1: Seed collections

Creates 25 Shopify collections.

```bash
npx tsx scripts/seed-collections.ts
```

Verify in Shopify admin that all 25 collections were created before proceeding.

## Step 2: Seed products

Creates 285 products in Shopify, all in DRAFT status.

```bash
npx tsx scripts/seed-products.ts
```

Expected runtime: ~20–30 minutes.

Products are created as DRAFT. You will need to add artwork images via Gelato and then publish manually.

## Step 3: Upload images and publish

For each product:
1. In Shopify admin, open the product
2. Use the Gelato app to attach the artwork image (from Dropbox)
3. Set the product status to Active

This part cannot be automated — Gelato requires the image to be uploaded through their app interface to generate the print-ready file.

## Notes

- All products use DKK pricing as confirmed: A4 Print 149 kr, Poster 30×45 299 kr, Canvas 495 kr, Framed Print 695 kr, Wall Hanging 895 kr, Mug 199 kr, Tote Bag 299 kr
- Products are tagged with DID IDs (e.g. DID-T-001) in the `did` metafield for reference
- Gelato product UIDs are stored in the `gelato.product_uid` metafield
- The framed print Gelato UID is a placeholder — confirm the exact UID with Gelato before running
