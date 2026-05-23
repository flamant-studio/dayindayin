# Stine's Artwork Catalog — How To Do The Walkthrough

*This is the instructions file for Sebastian. Read this before opening the CSV.*

---

## What we're doing and why

We need a master list of every physical piece Stine has made. This serves three purposes:
1. **Website** — every piece needs a title, category, and image to be listed
2. **Insurance / record** — knowing what exists, where it is, and its approximate value
3. **Sales** — knowing which pieces are available and at what price

Stine doesn't need to be involved in this. You do the walkthrough, take photos on your phone, fill in what you can. Claude fills in the rest (titles, descriptions) from the photos later.

---

## The numbering system

Every piece gets a unique ID: **DID-[category]-[number]**

| Category | Code | Example |
|---|---|---|
| Hand Tufting | T | DID-T-001 |
| Embroidery | E | DID-E-001 |
| Painting | P | DID-P-001 |
| Photography | PH | DID-PH-001 |

Number sequentially within each category. Don't skip numbers.

---

## How to do the walkthrough

1. **Open `artwork-catalog.csv`** in Numbers or Google Sheets
2. **Walk room by room** through the flat — don't try to do it all at once
3. **For each piece:**
   - Assign the next available ID (write it on a Post-it and stick it to the back of the piece if helpful)
   - Take a photo on your phone (good light, straight on if possible)
   - Fill in the row — leave blanks where you don't know, Claude will help fill those in later
4. **Upload your photos** to `Dropbox/Hovedmappe Kunst/catalog-photos/[ID].jpg` so they can be processed

---

## Fields explained

| Field | What to enter | Can be left blank? |
|---|---|---|
| **id** | DID-T-001 etc | No |
| **title** | Your best guess or leave blank | Yes — Claude fills this |
| **category** | tufting / embroidery / painting / photography | No |
| **year** | Approx year made — "2020" or "2019-2020" | Best guess |
| **dimensions_cm** | Height × Width e.g. "60x80" | Fill if you can measure |
| **medium** | e.g. "hand-tufted wool on canvas" | Yes — Claude fills this |
| **location** | Room + spot e.g. "bedroom, east wall" | No — this is key |
| **condition** | good / minor wear / needs attention | No |
| **dropbox_path** | Path to best image in Dropbox | Fill when you can |
| **on_website** | yes / no | Fill after catalog is done |
| **for_sale** | yes / no / enquire | Your call |
| **price_dkk** | Asking price if for sale | Leave blank if unsure |
| **notes** | Anything — provenance, story, exhibitions | Optional |

---

## After the walkthrough

Hand the filled CSV back to Claude. The next step (FLA-86) runs AI content generation across every piece to fill in titles, descriptions, and SEO text from the photos.
