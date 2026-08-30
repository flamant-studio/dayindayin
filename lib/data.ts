export type WorkCategory = "tufting" | "embroidery" | "painting" | "photography" | "mixed" | "handhooking";

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  year: string;
  description: string;
  image: string;
  gallery?: string[];   // additional views uploaded to Vercel Blob
  dimensions?: string;  // e.g. "37×27 cm"
  materials?: string;   // more specific than CATEGORY_MEDIUM default
  sold?: boolean;       // true if no longer available
  availabilityNote?: string; // overrides the default Sold/Original label text, e.g. "Not for sale — currently with X"
  series?: string;      // cross-work grouping tag, e.g. 'candy', 'bifrost', 'liebes-panopticon', 'floral-things'
  companionSlug?: string; // paired work meant to be shown alongside this one
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  body?: string[];
}

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

const g = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => `${BLOB}/${slug}/gallery/${i + 1}.jpg`)

export const works: Work[] = [
  // Tufting
  { slug: 'purple-sun',        title: 'Purple Sun',        category: 'handhooking', year: '2019', description: 'Handhooking in mixed fibres — wool, cotton, silk, acrylic, and recycled cotton.', materials: 'Mixed fibres — wool, cotton, silk, acrylic, recycled cotton', image: `${BLOB}/tufting/purple-sun.jpg`,        gallery: g('tufting/purple-sun', 5), sold: true, availabilityNote: 'Not for sale — currently with Ulrikke' },
  { slug: 'candy-1',           title: 'Candy 1',           category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Horizontal stripes in different height loops.',                                     image: `${BLOB}/tufting/candy-I.jpg`,           gallery: g('tufting/candy-I', 5) },
  // Candy 2–6 + Candy Cane added 2026-07-18 — the full Dropbox sweep found 7 more
  // distinct pieces in this series; each visually confirmed as a different shape/colorway.
  // Renamed/renumbered 2026-08-30 per Stine's 2026-07-30 recording — Candy II–VII, Green
  // Flower, Small Round Tricolor, POW, and Square Flower Thing are Candy 2–10; old Candy IV
  // (a separate, standalone piece) is now Star, not part of this series.
  { slug: 'candy-2',    title: 'Candy 2',    category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Horizontal stripes in different height loops.', image: `${BLOB}/tufting/candy-ii.jpg`, gallery: g('tufting/candy-ii', 1) },
  { slug: 'candy-3',   title: 'Candy 3',   category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Horizontal stripes in different height loops.', image: `${BLOB}/tufting/candy-iii.jpg`, gallery: g('tufting/candy-iii', 1) },
  { slug: 'star',    title: 'Star',    category: 'tufting', year: '2021', description: 'Wool tufting on cotton canvas with beading. A star-shaped form.', dimensions: '26×24 cm', materials: 'Wool tufting on cotton canvas with beading', image: `${BLOB}/tufting/candy-iv.jpg`, gallery: g('tufting/candy-iv', 1) },
  // Gallery updated 2026-08-02 — the only image on file was a tight macro crop with no
  // full shot anywhere. Added a genuine full-piece photo from Dropbox as gallery[0] (image audit).
  { slug: 'candy-4',     title: 'Candy 4',     category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Horizontal stripes in different height loops.', image: `${BLOB}/tufting/candy-v.jpg`, gallery: [2, 1].map(i => `${BLOB}/tufting/candy-v/gallery/${i}.jpg`) },
  { slug: 'candy-5',    title: 'Candy 5',    category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Horizontal stripes in different height loops.', materials: 'Hand-tufted wool with metallic tinsel accent', image: `${BLOB}/tufting/candy-vi.jpg`, gallery: g('tufting/candy-vi', 1) },
  { slug: 'candy-cane',  title: 'Candy Cane',  category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Part of the Candy series.', image: `${BLOB}/tufting/candy-cane.jpg`, gallery: g('tufting/candy-cane', 1) },
  { slug: 'candy-6',   title: 'Candy 6',   category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Horizontal stripes in different height loops.', image: `${BLOB}/tufting/candy-vii.jpg`, gallery: g('tufting/candy-vii', 1) },
  { slug: 'orange-sun',        title: 'Orange Sun',        category: 'tufting', year: '2021', companionSlug: 'green-earth', description: 'The sun as form, this time in terracotta and amber. Short and long pile radiating from a tight centre.',                        image: `${BLOB}/tufting/orange-sun.jpg`,        gallery: g('tufting/orange-sun', 4) },
  // Main image + all gallery slots point at gallery/1.jpg (2026-07-17, per Sebastian) — the
  // old main image (tufting/rainbow-I.jpg) was the piece's raw back (burlap, inventory number),
  // same root pattern as Liebes Panopticon/Bedroom Rug. gallery/1.jpg is the real finished front.
  { slug: 'bifrost-i',         title: 'Bifrost I',         category: 'tufting', year: '2021', series: 'bifrost', description: 'Wool tufting on cotton canvas. Five colours. Loop pile. Part of the Bifrost series.',                              image: `${BLOB}/tufting/rainbow-I/gallery/1.jpg`,         gallery: Array(4).fill(`${BLOB}/tufting/rainbow-I/gallery/1.jpg`) },
  // Gallery reordered 2026-08-02 — every gallery/N.jpg is a texture close-up; the hero
  // image is the only genuine full shot, promoted to gallery[0] (image audit).
  { slug: 'birds',             title: 'Birds',             category: 'mixed', year: '2021', materials: 'Wool and cotton tufting, embroidery, and acrylic painting on canvas', description: 'A mixture of tufting and embroidery on canvas. Wool and cotton, with acrylic painting. Two birds.',                                                    image: `${BLOB}/tufting/birds.jpg`,             gallery: [`${BLOB}/tufting/birds.jpg`, ...g('tufting/birds', 5)] },
  { slug: 'you-and-i-du-und',            title: 'You and I',            category: 'tufting', year: '2021', series: 'liebes-panopticon', description: 'Wool tufting on cotton canvas. Loop pile. Part of the Liebes Panopticon series.',                                                      image: `${BLOB}/tufting/du-und/gallery/3.jpg`,  gallery: g('tufting/du-und', 5) },
  { slug: 'hej',               title: 'Hej',               category: 'tufting', year: '2021', description: 'The simplest Danish greeting, tufted in loop pile on cotton canvas. Saying hello in wool takes hours. The word earns its place. It is not decorative — it means exactly what it says.',                                   image: `${BLOB}/tufting/hej.jpg`,               gallery: g('tufting/hej', 5) },
  // Cache-busted with ?v=2 — the underlying Blob content was overwritten 2026-07-11 (was a
  // back/WIP shot) but Next's image optimizer keeps a URL-keyed cache, so the old bytes kept
  // serving at the same URL until the query string changed. See LOG.md 2026-07-11.
  // Note — do not implement now: Stine thinks this series may deserve its own dedicated
  // page (2026-07-30 recording). Flagged as a future consideration, not built.
  { slug: 'liebes-panopticon', title: 'Liebes Panopticon', category: 'tufting', year: '2021', series: 'liebes-panopticon', description: 'A Bauhaus-inspired series worked entirely in inherited, plant-dyed wool. Hand-tufted — not machine-made. One of the most labour-intensive bodies of work in the studio. The series is made up of several distinct parts, meant to be seen together.',  image: `${BLOB}/tufting/liebes-panopticon.jpg?v=2`, gallery: [1, 2, 3, 4, 5, 6].map((i) => `${BLOB}/tufting/liebes-panopticon/gallery/${i}.jpg?v=2`) },
  { slug: 'floral-thing',      title: 'Floral Thing',      category: 'tufting', year: '2021', series: 'floral-things', description: 'An abstracted botanical form in loop pile — not quite a flower, not quite an animal. The uncertainty is intentional. 34×22 cm; small enough that you have to get close.',                          dimensions: '34×22 cm', image: `${BLOB}/tufting/floral-thing/gallery/2.jpg`, gallery: g('tufting/floral-thing', 5) },
  // Not addressed in Stine's 2026-07-30 recording — "cut pile" left as-is pending confirmation.
  { slug: 'round-earth',       title: 'Round Earth',       category: 'tufting', year: '2021', description: 'A sphere on a rectangular canvas — the circle as the only honest shape for a planet. Cut pile, high density. The earth is not complicated. 41×41 cm.',                                             dimensions: '41×41 cm', image: `${BLOB}/tufting/round-earth.jpg`,       gallery: g('tufting/round-earth', 4) },
  // Gallery added 2026-08-02 — this piece previously had no gallery array at all (no
  // Studio views section on its PDP). Added a full-piece photo from Dropbox (image audit).
  { slug: 'floral-thing-ii',      title: 'Floral Thing II',      category: 'tufting', year: '2021', series: 'floral-things', description: 'Wool tufting on cotton canvas. Loop pile. Part of the Floral Things series.',                                                           image: `${BLOB}/tufting/fleur-de-lys.jpg`, gallery: g('tufting/fleur-de-lys', 1) },
  { slug: 'jellyfish',         title: 'Jellyfish',         category: 'tufting', year: '2021', series: 'bifrost', description: 'Wool tufting on canvas, 56×24 cm — a vertical format that suits the subject. The jellyfish hangs as a jellyfish hangs. Loop pile gives the tentacles a softness that feels accurate.',          dimensions: '56×24 cm', image: `${BLOB}/tufting/jellyfish/gallery/1.jpg`, gallery: g('tufting/jellyfish', 5) },
  { slug: 'bifrost-ii',        title: 'Bifrost II',        category: 'tufting', year: '2021', series: 'bifrost', description: 'Wool tufting on cotton canvas. Five colours. Loop pile. Part of the Bifrost series.',                                  image: `${BLOB}/tufting/rainbow-II.jpg`,        gallery: g('tufting/rainbow-II', 5) },
  // Rainbow III + IV added 2026-07-18 — full Dropbox sweep found 4 rainbow colorway
  // folders; 2 pixel-matched the live Rainbow I/II exactly, these 2 were genuinely new.
  { slug: 'bifrost-iii',       title: 'Bifrost III',       category: 'tufting', year: '2021', series: 'bifrost', description: 'Wool tufting on cotton canvas. Five colours. Loop pile. Part of the Bifrost series.',                        image: `${BLOB}/tufting/rainbow-iii.jpg`,       gallery: g('tufting/rainbow-iii', 1) },
  { slug: 'bifrost-iv',        title: 'Bifrost IV',        category: 'tufting', year: '2021', series: 'bifrost', description: 'Wool tufting on cotton canvas. Five colours. Loop pile. Part of the Bifrost series.',    image: `${BLOB}/tufting/rainbow-iv.jpg`,        gallery: g('tufting/rainbow-iv', 1) },
  { slug: 'tufted-mask',       title: 'Tufted Mask',       category: 'tufting', year: '2021', description: 'Loop pile, hand-stitched. A protective mask.',                      dimensions: '39×21 cm', image: `${BLOB}/tufting/tufted-mask/gallery/4.jpg`,       gallery: g('tufting/tufted-mask', 5), sold: true },
  // Dimension corrected 2026-07-17 — "74×44 cm" was borrowed from a different, separate
  // Sitspot piece (see sitspot-iii below); this piece's actual size wasn't on file, so the
  // wrong number was dropped rather than guessed at a replacement.
  { slug: 'sitspot-large',     title: 'Sitspot Large',     category: 'tufting', year: '2021', description: 'Originally designed to sit on — a functional object made seriously. High loop pile wool. Fine art and utility occupying the same object. The large version; the small version no longer exists.',              image: `${BLOB}/tufting/sitspot-large.jpg`,     gallery: g('tufting/sitspot-large', 6) },
  { slug: 'universe-hole',     title: 'Universe with a Hole', category: 'tufting', year: '2021', description: 'A square form with a circular void at its centre. Hand-tufted — the pile reads differently at the edges of the opening, where the handwork becomes visible in the organic texture of the boundary.',                                      image: `${BLOB}/tufting/universe-hole.jpg`,     gallery: g('tufting/universe-hole', 7) },
  { slug: 'candy-7',      title: 'Candy 7',      category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Part of the Candy series.',                                                                           image: `${BLOB}/tufting/green-flower.jpg`,      gallery: g('tufting/green-flower', 1) },
  // Added 2026-07-18 — confirmed missing from the site entirely (full Dropbox sweep)
  { slug: 'candy-8', title: 'Candy 8', category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Part of the Candy series.', dimensions: '24×21 cm', image: `${BLOB}/tufting/small-round-tricolor.jpg`, gallery: g('tufting/small-round-tricolor', 1) },
  { slug: 'candy-10', title: 'Candy 10', category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Part of the Candy series.', dimensions: '34×23 cm', image: `${BLOB}/tufting/square-flower-thing.jpg`, gallery: g('tufting/square-flower-thing', 1) },
  { slug: 'green-earth',       title: 'Green Earth',       category: 'tufting', year: '2021', companionSlug: 'orange-sun', description: 'Wool tufting on cotton canvas. A companion piece to Orange Sun — the earth to its sun.', dimensions: '60×51 cm', image: `${BLOB}/tufting/green-square.jpg`, gallery: g('tufting/green-square', 1) },
  { slug: 'pink-rug',          title: 'Soften My City I',          category: 'tufting', year: '2020', description: 'A floor piece. Made to be walked on. The tufting is dense enough to hold underfoot — the pile compresses and springs back. It is also art. These are not in conflict.',                                                  image: `${BLOB}/tufting/pink-rug.jpg`,          gallery: g('tufting/pink-rug', 5), sold: true },
  // Slug intentionally NOT changed yet (still 'pink-rug') — Sebastian to confirm availability
  // status before this goes live with its new slug + redirect. Title only, per the brief.
  { slug: 'candy-9',               title: 'Candy 9',               category: 'tufting', year: '2021', series: 'candy', description: 'Wool tufting on cotton canvas. Part of the Candy series.', image: `${BLOB}/tufting/pow.jpg`,               gallery: g('tufting/pow', 5) },
  { slug: 'jewel-hand',      title: 'Jewel Hand',      category: 'tufting', year: '2021', materials: 'Hand-tufted cotton', description: 'Hand-tufted cotton on canvas, 27×14 cm. A hand adorned — rings, gemstones, the hand as a site of ornament and care.', dimensions: '27×14 cm', image: `${BLOB}/tufting/jeweled-hand.jpg`,      gallery: g('tufting/jeweled-hand', 6) },
  { slug: 'sitspot',           title: 'Sitspot',           category: 'tufting', year: '2021', description: 'The original Sitspot — tufted wool on cotton canvas, made to be sat on and moved between rooms. A functional object treated as seriously as any wall piece. Before the large version came the question of whether this counted as art or furniture. It is both.', image: `${BLOB}/tufting/sitspot.jpg`,           gallery: g('tufting/sitspot', 5) },
  // Added 2026-07-17 — the Sitspot family turned out to have (at least) 3 distinct
  // colorways in Dropbox; the site only showed one before this
  { slug: 'sitspot-ii',        title: 'Sitspot II',        category: 'tufting', year: '2021', description: 'A second colorway of the same four-quadrant leaf shape — mustard, purple, sage green, and cobalt in place of the original\'s mustard, mint, navy, and lavender. Same question asked in a different palette.', image: `${BLOB}/tufting/sitspot-ii.jpg`, gallery: g('tufting/sitspot-ii', 1) },
  { slug: 'sitspot-iii',       title: 'Sitspot III',       category: 'tufting', year: '2021', description: 'A third colorway of the Sitspot shape — purple, teal, red, and yellow, higher-contrast than the first two. 74×44 cm.', dimensions: '74×44 cm', image: `${BLOB}/tufting/sitspot-iii.jpg`, gallery: g('tufting/sitspot-iii', 1) },
  { slug: 'stripes-on-beige', title: 'Stripes on Beige',  category: 'tufting', year: '2021', description: 'A sample piece. Wool tufting on canvas.', dimensions: '22×22 cm', image: `${BLOB}/tufting/stripes-on-beige.jpg`, gallery: g('tufting/stripes-on-beige', 5) },
  { slug: 'pink-rug-ii',      title: 'Soften My City II',       category: 'tufting', year: '2021', description: 'The second floor piece — same material as the first, a different pink. Made to be walked on in a specific room in a specific season. The pile is high enough that your feet disappear slightly as you stand on it. This one is lighter, more morning than afternoon.', image: `${BLOB}/tufting/pink-rug-II.jpg`,      gallery: g('tufting/pink-rug-II', 6) },
  // Slug intentionally NOT changed yet (still 'pink-rug-ii') — same as Soften My City I above.
  // Gallery updated 2026-08-02 — gallery[0-2] + hero were all extreme macro/texture crops
  // of the wood board, no full shot anywhere. Added a genuine full-piece photo from
  // Dropbox as gallery[0] (image audit).
  { slug: 'wallflower',      title: 'Wallflower',       category: 'tufting', year: '2022', materials: 'Hand-tufted wool on canvas, mounted on wood board substrate', description: 'Hand-tufted wool on canvas, mounted on a wood board backing. Made with a hand tufting needle.', image: `${BLOB}/tufting/red-on-wood.jpg`,       gallery: [4, 1, 2, 3].map(i => `${BLOB}/tufting/red-on-wood/gallery/${i}.jpg`) },
  // Gallery reordered 2026-08-02 — gallery[0] was a texture close-up; gallery/4.jpg (a full
  // shot, rug draped over a white chair) promoted to position 0 (image audit).
  { slug: 'you-and-i-and-the-universe', title: 'You and I and the Universe',  category: 'tufting', year: '2022', materials: 'Wool tufting on cotton canvas', description: 'Wool tufting on cotton canvas.', image: `${BLOB}/tufting/bedroom-wall-rug.jpg?v=2`,  gallery: [4, 1, 2, 3, 5, 6].map(i => `${BLOB}/tufting/bedroom-wall-rug/gallery/${i}.jpg?v=2`) },
  // TODO: tufting work from the stairs — image to be found in Dropbox and added.
  // Embroidery
  // TODO: Stine to confirm which embroidery works belong to the Monument series (made at
  // night during insomnia) — not tagged on any work yet, she didn't name which ones on the recording.
  // TODO: Stine to confirm which embroidery works are missing from the site.
  { slug: 'fuck-alting',         title: 'Fuck Alting',            category: 'embroidery', year: '2020', description: '"Fuck everything" in Danish, stitched by hand. The tone is not angry — it is tired and specific. The slowness of embroidery makes the message stranger and more serious.',                                                image: `${BLOB}/embroidery/fuck-alting.jpg`,         gallery: g('embroidery/fuck-alting', 5) },
  // Gallery reordered 2026-08-02 — gallery[0] was an angled close-up; gallery/2.jpg (a
  // clean full shot) promoted to position 0 (image audit).
  { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud',    category: 'embroidery', year: '2019', description: '"God has cancelled." One of the earliest text works. Made during a period when it felt exactly true. The stitch count is several hundred. Saying it this slowly changes what it means.',                                    image: `${BLOB}/embroidery/gud-har-meldt-afbud.jpg`, gallery: [2, 1, 3, 4].map(i => `${BLOB}/embroidery/gud-har-meldt-afbud/gallery/${i}.jpg`) },
  // Gallery reordered 2026-08-02 — gallery[0] was an extreme macro of the stitched heart;
  // gallery/2.jpg (a full shot of the whole piece) promoted to position 0 (image audit).
  { slug: 'elsk',                title: 'Elsk',                   category: 'embroidery', year: '2021', description: 'The Danish word for love — "elsk" — stitched in hand embroidery and nothing else. No decoration. No frame of reference. Just the word, made slow, given weight.',                                                         image: `${BLOB}/embroidery/elsk.jpg`,                gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/embroidery/elsk/gallery/${i}.jpg`) },
  { slug: 'be-a-dragon',         title: 'Be a Dragon',            category: 'embroidery', year: '2021', description: 'An instruction in hand embroidery on canvas. Not "be like a dragon" — the command is simpler than that. The invitation is open. What it means depends on who reads it.',                                                  image: `${BLOB}/embroidery/be-a-dragon.jpg`,         gallery: g('embroidery/be-a-dragon', 3) },
  { slug: 'theres-nothing-here', title: "There's Nothing Here",   category: 'embroidery', year: '2020', description: 'A statement stitched on fabric. It might be a refusal or a description — the text genuinely does not decide. Read it fast and it is dismissive. Read it slowly and something opens up.',                                  image: `${BLOB}/embroidery/theres-nothing-here.jpg`, gallery: g('embroidery/theres-nothing-here', 1) },
  // Gallery reordered 2026-08-02 — gallery[0] was a badly blurred close-up with a bicycle
  // in the foreground; gallery/2.jpg (a clean full shot) promoted to position 0 (image audit).
  { slug: 'mariann',             title: 'Mariann',                category: 'embroidery', year: '2020', description: 'A name stitched as portrait. To embroider a name is to insist it is here. Mariann exists in this piece in a way that does not require explanation or justification.',                                                     image: `${BLOB}/embroidery/mariann.jpg`,             gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/embroidery/mariann/gallery/${i}.jpg`) },
  { slug: '38-homes',             title: '38 Homes',                category: 'embroidery', year: '2021', description: 'Freehand embroidery — marks that follow their own logic without trying to arrive anywhere. Not sketches for something else. These lines are the destination.',                                                            image: `${BLOB}/embroidery/doodles.jpg`,             gallery: g('embroidery/doodles', 5) },
  { slug: 'collage-bw',          title: 'Collage (Black & White)', category: 'embroidery', year: '2021', description: 'Hand embroidery on fabric in monochrome. 100×70 cm — the largest embroidery work. Collage logic in thread: cut from one reference, placed against another, the seams visible by design.', dimensions: '100×70 cm', materials: 'Hand embroidery on linen, monochrome thread', image: `${BLOB}/embroidery/collage-bw.jpg`,          gallery: g('embroidery/collage-bw', 5) },
  { slug: 'apple-scraps',        title: 'Apple Scraps',           category: 'embroidery', year: '2020', description: 'Domestic remnants embroidered on fabric. The apple core, the peel, the ordinary aftermath of a meal. Embroidery is a practice that dignifies things — it takes time, and time makes objects matter.',                    image: `${BLOB}/embroidery/apple-scraps.jpg`,        gallery: g('embroidery/apple-scraps', 2) },
  { slug: 'perfidt-perfekt',     title: 'Perfidt Perfekt',        category: 'embroidery', year: '2021', description: '"Perfectly perfidious" in Danish — the two words cancel each other and yet land together. Hand embroidery on canvas. A sentence from an argument Stine was in and couldn\'t let go of.',                                 image: `${BLOB}/embroidery/perfidt-perfekt.jpg`,     gallery: g('embroidery/perfidt-perfekt', 1) },
  // Main image + all gallery slots point at gallery/1.jpg (2026-07-17, per Sebastian) — the
  // old main image was mirrored/reversed (text illegible), gallery/1.jpg reads correctly.
  { slug: 'ingenting',           title: 'Ingenting',              category: 'embroidery', year: '2020', description: '"Nothing" in Danish, stitched. The word for absence given material form. There is something satisfying about spending several hours making the word nothing. It resolves a contradiction.',                               image: `${BLOB}/embroidery/ingenting/gallery/1.jpg`,           gallery: Array(4).fill(`${BLOB}/embroidery/ingenting/gallery/1.jpg`) },
  { slug: 'gud-har-meldt-afbud-ii', title: 'Gud Har Meldt Afbud II', category: 'embroidery', year: '2020', description: 'The second version of "God has cancelled." The same sentence, differently stitched. One version was not enough — the phrase needed to be made twice to understand what it actually said the first time. A repetition that is not redundancy.', image: `${BLOB}/embroidery/gud-har-meldt-afbud-II.jpg`, gallery: g('embroidery/gud-har-meldt-afbud-II', 5) },
  { slug: 'long-hair-dont-care', title: "Long Hair Don't Care",  category: 'embroidery', year: '2020', description: 'Hand embroidery on canvas. A phrase that refuses to apologise for itself — not a political statement so much as a position. Took longer to stitch than to say. The time changes what it means: something casual made slow becomes something else.', image: `${BLOB}/embroidery/long-hair-dont-care.jpg`, gallery: g('embroidery/long-hair-dont-care', 2) },
  // Added 2026-07-18 — confirmed missing from the site; also a medium correction: this
  // piece sat in the Dropbox Tufting folder but is satin-stitch embroidery, not tufted wool.
  { slug: 'fireworks', title: 'Fireworks', category: 'embroidery', year: '2020', description: 'Five embroidered starbursts in gold, crimson, and lavender thread, scattered across deep teal fabric. Satin stitch radiating from a tight centre — the stitch direction does the same job a firework\'s trail of sparks does.', image: `${BLOB}/embroidery/fireworks.jpg`, gallery: g('embroidery/fireworks', 1) },
  // Added 2026-07-17 — confirmed missing from the site entirely (full Dropbox sweep)
  { slug: 'det-er-bare-tanker',  title: 'Det Er Bare Tanker',    category: 'embroidery', year: '2018', description: 'Hand embroidery on vintage floral fabric, framed. Danish for "it\'s just thoughts" — stitched in a fading rainbow gradient, yellow into red. The busy printed rose fabric underneath does the opposite of quieting the text: it makes the thought feel like it interrupted something already in progress.', image: `${BLOB}/embroidery/det-er-bare-tanker.jpg`, gallery: g('embroidery/det-er-bare-tanker', 1) },
  { slug: 'red-to-blue-broderi', title: 'Red to Blue',          category: 'embroidery', year: '2021', description: 'Hand embroidery on hand-dyed cotton, dip-dyed pink to purple to gold. A wave in beads, sequins, and thread breaks across one corner; loose French knots scatter across the dyed field like seed heads caught mid-drift.', image: `${BLOB}/embroidery/red-to-blue-broderi.jpg`, gallery: g('embroidery/red-to-blue-broderi', 3) },
  // Paintings
  { slug: 'universe-1',          title: 'Universe I',          category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. The first in the Universe series — an ongoing investigation into scale, mark, and what a painted surface can hold. Started in 2019 and still not finished in the sense the series still continues.', image: `${BLOB}/painting/universe-1.jpg`,          gallery: g('painting/universe-1', 5) },
  // Cache-busted with ?v=2 — old main image was an extreme detail crop with a harsh shadow
  // cast across it, no context of the whole canvas. New set uses the clean full-canvas shot
  // + confirmed-matching detail crops (see LOG.md 2026-07-17).
  { slug: 'universe-2',          title: 'Universe II',         category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. A different attempt at the same question as Universe I. Deeper ground colour, more layers scraped back. The question the series asks doesn\'t change — the answers keep changing.',       image: `${BLOB}/painting/universe-2.jpg?v=2`,          gallery: g('painting/universe-2', 4).map(u => `${u}?v=2`) },
  { slug: 'universe-3',          title: 'Universe III',        category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. Third iteration. A darker palette than the first two — more purple, less ground visible. Worked on the studio floor; you can see the direction of the marks.',                           image: `${BLOB}/painting/universe-3.jpg`,          gallery: g('painting/universe-3', 5) },
  // Gallery reordered 2026-08-02 — gallery[0] was an unrelated shot of an unpainted branch,
  // not even the finished piece; gallery/2.jpg (= the hero, a genuine full shot) promoted
  // to position 0 (image audit).
  { slug: 'blue-branch',         title: 'Blue Branch',         category: 'painting', year: '2021', description: 'Acrylic on canvas. A branch painted in cadmium blue — the form is botanical, the temperature is wrong in an interesting way. It should be brown. It is blue. The wrongness is the painting.',                             image: `${BLOB}/painting/blue-branch.jpg`,         gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/painting/blue-branch/gallery/${i}.jpg`) },
  // Gallery updated 2026-08-02 — the whole gallery array was unrelated compositions (a
  // still life, a sketchbook spread), never this painting itself. Added the correct
  // full-piece photo from Dropbox as gallery[0] (image audit).
  { slug: 'person-walking',      title: 'Person Walking',      category: 'painting', year: '2021', description: 'Acrylic on canvas. A figure in mid-stride — not a portrait, not an illustration. The movement is the subject. Everything else was removed.',                                                                              image: `${BLOB}/painting/person-walking.jpg`,      gallery: [6, 1, 2, 3, 4, 5].map(i => `${BLOB}/painting/person-walking/gallery/${i}.jpg`) },
  { slug: 'green-on-blue',       title: 'Green on Blue',       category: 'painting', year: '2021', description: 'Acrylic on canvas. Green laid over blue — the boundary between them is where the painting lives. Each colour changes in contact with the other. A study in adjacency.',                                                   image: `${BLOB}/painting/green-on-blue.jpg`, gallery: g('painting/green-on-blue', 5) },
  { slug: 'colour-study',        title: 'Colour Study',        category: 'painting', year: '2020', description: 'Acrylic on canvas. Not a preliminary sketch — a finished inquiry into colour relationship. What happens between warm and cool on the same surface. This is the work, not a preparation for something else.',               image: `${BLOB}/painting/colour-study.jpg`,        gallery: g('painting/colour-study', 2) },
  // Gallery reordered 2026-08-02 — gallery[0] showed only 2 of 3 canvases, one cropped off;
  // gallery/2.jpg (all 3 canvases fully in frame) promoted to position 0 (image audit).
  { slug: 'universe-collection', title: 'Universe Collection', category: 'painting', year: '2021', description: 'A group of Universe works photographed together as a single composition. The series in conversation with itself — each canvas a different answer, seen simultaneously.',                                                   image: `${BLOB}/painting/universe-collection.jpg`, gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/painting/universe-collection/gallery/${i}.jpg`) },
  { slug: 'colour-study-blue',   title: 'Colour Study Blue',   category: 'painting', year: '2021', description: 'Acrylic on canvas. Blue as the entire subject — not a colour in service of a subject, but the thing being studied. How many blues can occupy the same surface without cancelling each other.',                            image: `${BLOB}/painting/colour-study-blue.jpg`,   gallery: g('painting/colour-study-blue', 1) },
  { slug: 'sri-lanka-masks',     title: 'Sri Lanka Masks',     category: 'painting', year: '2020', description: 'Acrylic and mixed media on canvas. Based on ceremonial masks encountered in Sri Lanka — the colour amplified past documentation into something invented. Where observation ends and response begins.',                     materials: 'Acrylic and mixed media on canvas', image: `${BLOB}/painting/sri-lanka-masks.jpg`,     gallery: g('painting/sri-lanka-masks', 5) },
  { slug: 'bird-man',           title: 'Bird Man',            category: 'painting', year: '2021', description: 'Ink and acrylic on paper. A figure standing at the intersection of human and bird — not a mythology, just a person who has decided. Made in a single session. The directness of the drawing is the work.',                                                           image: `${BLOB}/painting/bird-man.jpg`,           gallery: g('painting/bird-man', 4) },
  { slug: 'vaginals',           title: 'Vaginals',            category: 'painting', year: '2020', description: 'Acrylic on canvas. A painting that names what it depicts, plainly. Made during a period of naming things as they are. Not intended to provoke — intended to be accurate. The title and the image are exactly the same statement.',                                  image: `${BLOB}/painting/vaginals.jpg`,           gallery: g('painting/vaginals', 3) },
  { slug: 'green-background',  title: 'Green Background',    category: 'painting', year: '2020', description: 'Acrylic on canvas. A field of green — not botanical, not symbolic, just green as the full subject of a canvas. The question was what happens if you commit entirely to one colour. What you find is that one colour is never one thing.',                         image: `${BLOB}/painting/green-background.jpg`,  gallery: g('painting/green-background', 5) },
  { slug: 'seb-livingroom',    title: 'Seb Livingroom',      category: 'painting', year: '2021', description: 'Acrylic on canvas. A room painted from memory rather than observation — the forms are architectural but the proportions are felt, not measured. Painted from sitting in the room repeatedly until the image formed from what remained after the details fell away.', image: `${BLOB}/painting/seb-livingroom.jpg`,    gallery: g('painting/seb-livingroom', 5) },
  // Added 2026-07-17 — confirmed missing from the site entirely (Sebastian caught the gap)
  { slug: 'hc-andersen',       title: 'H.C. Andersen',       category: 'painting', year: '2020', description: 'Watercolour on paper. A small robed figure in a flame-coloured crown, planted among loose washes of grass and flowers. Named for the fairytale writer without illustrating any particular story of his — the reference is tone, not plot.', image: `${BLOB}/painting/hc-andersen.jpg`, gallery: g('painting/hc-andersen', 3) },
  { slug: 'her-er-en-sandhed', title: 'Her Er En Sandhed',   category: 'painting', year: '2019', description: 'Acrylic and collage on a sketchbook page. Danish text painted straight into the surface: "Her er en sandhed: det er nok at stå ud af søgen" — here is a truth, it is enough to stand outside the searching. A torn tea-packet illustration collaged in below it, sun rays drawn around it like something has just been poured.', image: `${BLOB}/painting/her-er-en-sandhed.jpg`, gallery: g('painting/her-er-en-sandhed', 3) },
  { slug: 'fantasy',           title: 'Fantasy',             category: 'painting', year: '2020', description: 'Watercolour on paper. A small egg-shaped creature, eyes shut, a lit fuse curling out of its head. Somewhere between a fairytale character and something about to go off — the painting doesn\'t resolve which.', image: `${BLOB}/painting/fantasy.jpg`, gallery: g('painting/fantasy', 1) },
  { slug: 'blue-background-dayin', title: 'Blue Background (Day In Day In)', category: 'painting', year: '2020', description: 'A pressed dandelion seed head and a decaying leaf on a wash of studio blue, with a torn scrap of pink fabric tucked beneath. The brand\'s name, hand-lettered into a painted ribbon, sits over the top — this is the original piece the site is named after.', image: `${BLOB}/painting/blue-background-dayin.jpg`, gallery: g('painting/blue-background-dayin', 1) },
  // Photography
  { slug: 'view-from-the-studio',      title: 'View from the Studio',      category: 'photography', year: '2021', description: 'What the studio window holds — light at a specific time of day, the outside seen from inside the practice. Shot in Copenhagen. Archival inkjet on photo paper.',                                                                      image: `${BLOB}/photography/view-from-the-studio.jpg`,      gallery: g('photography/view-from-the-studio', 1) },
  { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood', category: 'photography', year: '2021', description: 'A single blue flower laid against weathered green wood. Two specific colours, exactly right against each other. Colour study as still life; still life as composition. Archival inkjet print.',                                      image: `${BLOB}/photography/blue-flower-on-green-wood.jpg`, gallery: g('photography/blue-flower-on-green-wood', 1) },
  { slug: 'red-and-green-moss',        title: 'Red and Green Moss',        category: 'photography', year: '2021', description: 'Close-up of moss photographed at the moment where red and green meet. The scale makes the familiar unrecognisable. Shot in Gørlev on a phone — the camera decides what matters, even when you do. Archival inkjet print.',         image: `${BLOB}/photography/red-and-green-moss.jpg`, gallery: g('photography/red-and-green-moss', 3) },
  { slug: 'no-ordinary-stone',         title: 'No Ordinary Stone',         category: 'photography', year: '2021', description: 'A stone brought inside and examined at close range. The longer you look, the less ordinary it gets. That is not a metaphor — it is what happens when you look. Archival inkjet print.',                                           image: `${BLOB}/photography/no-ordinary-stone.jpg`, gallery: g('photography/no-ordinary-stone', 1) },
  // Gallery updated 2026-08-02 — every existing image was a crop of one section of the
  // arrangement, never the whole board. Added a wide establishing shot (converted from
  // the original RAW capture) from Dropbox as gallery[0] (image audit).
  { slug: 'taped-objects',             title: 'Taped Objects',             category: 'photography', year: '2021', description: 'Domestic objects fixed in place with tape — the makeshift as formal decision. The tape shows. That is the point: provisional arrangements can also be compositions. Archival inkjet print.',                                    image: `${BLOB}/photography/taped-objects.jpg`,      gallery: [7, 1, 2, 3, 4, 5, 6].map(i => `${BLOB}/photography/taped-objects/gallery/${i}.jpg`) },
  { slug: 'flowers-on-linen',          title: 'Flowers on Linen',          category: 'photography', year: '2021', description: 'Flowers arranged on a ground of linen cloth — textile meeting botanical, two materials that know each other. The colour shifts of the linen behind the petals is what this photograph is actually about. Archival inkjet print.', image: `${BLOB}/photography/flowers-on-linen.jpg`,   gallery: g('photography/flowers-on-linen', 6) },
  { slug: 'polaroids',                 title: 'Polaroids',                 category: 'photography', year: '2021', description: 'A photograph of polaroid photographs — the medium turned back on itself, the image as object. The physical flatness of the polaroid is the subject. Archival inkjet print.',                                                      image: `${BLOB}/photography/polaroids.jpg`, gallery: g('photography/polaroids', 1) },
  { slug: 'on-the-light-table',        title: 'On the Light Table',        category: 'photography', year: '2021', description: 'Objects placed on a light table — backlit, translucent, revealed differently. A method for looking at things that are usually opaque. Transparency as technique and as theme. Archival inkjet print.',                          image: `${BLOB}/photography/on-the-light-table.jpg`, gallery: g('photography/on-the-light-table', 1) },
  { slug: 'dead-flowers',              title: 'Dead Flowers',              category: 'photography', year: '2021', description: 'Dried flowers photographed close up. After the bloom there is a different kind of beauty — drier, more structural, more architectural. This is a photograph of what remains. Archival inkjet print.',                            image: `${BLOB}/photography/dead-flowers.jpg`,       gallery: g('photography/dead-flowers', 3) },
  { slug: 'vase-on-stool',             title: 'Vase on Stool',             category: 'photography', year: '2021', description: 'A single vase on a stool — the classic still life arrangement, seen straight on. Nothing rearranged. The interest is in the exactness of the ordinary: this vase, this stool, this light. Archival inkjet print.',            image: `${BLOB}/photography/vase-on-stool.jpg`,      gallery: g('photography/vase-on-stool', 4) },
  { slug: 'purple-flower',             title: 'Purple Flower',             category: 'photography', year: '2021', description: 'One purple flower, photographed until the colour was right. Stine has been photographing single flowers since 2019 — each a study in how colour behaves when it has nothing to compete with. Archival inkjet print.',           image: `${BLOB}/photography/purple-flower.jpg`,             gallery: g('photography/purple-flower', 2) },
  { slug: 'linen-and-yellow-flower',   title: 'Linen and Yellow Flower',   category: 'photography', year: '2021', description: 'A yellow flower laid on linen — two specific textures, one temperature contrast. The linen ground holds the colour differently than any other background would. Five photographs of the same still life, each finding something different.',                                                                    image: `${BLOB}/photography/linen-and-yellow-flower.jpg`, gallery: g('photography/linen-and-yellow-flower', 5) },
  { slug: 'a-very-small-frog',         title: 'A Very Small Frog',         category: 'photography', year: '2021', description: 'Exactly what the title says — a very small frog, photographed close enough that the scale becomes strange. The eye is the sharpest thing in the frame. Stine finds animals worth as much attention as any other subject.',                                                                                image: `${BLOB}/photography/a-very-small-frog.jpg`,       gallery: g('photography/a-very-small-frog', 3) },
  { slug: 'colourful-shadows',         title: 'Colourful Shadows',         category: 'photography', year: '2021', description: 'Shadows that are not grey — light through coloured objects, each shadow a different temperature. The image is about what happens between the object and the surface it casts onto. Archival inkjet print.',                                                                                             image: `${BLOB}/photography/colourful-shadows.jpg`,       gallery: g('photography/colourful-shadows', 3) },
  { slug: 'minnie-mouse-neko-cat',     title: 'Minnie Mouse, Neko Cat',    category: 'photography', year: '2021', description: 'A Minnie Mouse plush figure next to a NEKO cat artwork. Two cultural objects in the same frame — neither ironised, neither privileged. They just happened to be in the same room at the same time. The photograph noticed them.',                                                                    image: `${BLOB}/photography/minnie-mouse-neko-cat.jpg`,   gallery: g('photography/minnie-mouse-neko-cat', 1) },
  // Gallery updated 2026-08-02 — every existing image was an extreme fabric-texture crop
  // with no garden visible at all, despite the title/description. Added the correct garden
  // scene (converted from the original RAW capture) from Dropbox as gallery[0] (image audit).
  { slug: 'purple-fabric-in-garden', title: 'Purple Fabric in Garden',  category: 'photography', year: '2019', description: 'A length of purple fabric arranged in a Copenhagen garden — textile in outdoor light, the colours doing something they cannot do indoors. Shot in early spring before the garden woke up. The purple is the warmest thing in the frame.', image: `${BLOB}/photography/purple-fabric-in-garden.jpg`, gallery: [4, 1, 2, 3].map(i => `${BLOB}/photography/purple-fabric-in-garden/gallery/${i}.jpg`) },
  { slug: 'smorrebrod',             title: 'Smørrebrød',               category: 'photography', year: '2021', description: 'The Danish open sandwich as still life. Photographed as seriously as anything else in the studio — the composition held to the same standard as a painting. Food made from attention, photographed with the same attention. Archival inkjet print.', image: `${BLOB}/photography/smorrebrod.jpg`,              gallery: g('photography/smorrebrod', 1) },
  { slug: 'yarn',                   title: 'Yarn',                     category: 'photography', year: '2021', description: 'A ball of yarn photographed close enough that the individual threads become visible. The raw material of tufting and weaving; the substance of the studio. A portrait of the material before it becomes something else. Archival inkjet print.', image: `${BLOB}/photography/yarn.jpg`,                   gallery: g('photography/yarn', 1) },
  { slug: 'office-shot',            title: 'Office Shot',              category: 'photography', year: '2021', description: 'The working desk — papers, tools, the evidence of practice. Photographed without clearing anything away. A studio interior as document and as composition. The disorder is how it actually looks. Archival inkjet print.',                          image: `${BLOB}/photography/office-shot.jpg`,            gallery: g('photography/office-shot', 1) },
  // Mixed media — added 2026-07-18, confirmed by the full Dropbox sweep. New category.
  { slug: 'cat-doll',           title: 'Cat Doll',           category: 'mixed', year: '2020', description: 'A hand-sewn plush cat, embroidered face and markings. Soft sculpture rather than textile-on-a-wall — the same hand, a different kind of object.', materials: 'Hand-sewn fabric, stuffing, embroidery', image: `${BLOB}/mixed/cat-doll.jpg`, gallery: g('mixed/cat-doll', 1) },
  { slug: 'pink-bag',           title: 'Pink Bag',           category: 'mixed', year: '2019', description: 'A burlap tote, hand-painted in washes of pink and white, with a small tufted patch appliquéd onto one face. A wearable object treated with the same attention as a wall piece.', materials: 'Hand-painted burlap, tufted wool appliqué', image: `${BLOB}/mixed/pink-bag.jpg`, gallery: g('mixed/pink-bag', 1) },
  { slug: 'polaroids-on-fabrics', title: 'Polaroids on Fabrics', category: 'mixed', year: '2020', description: 'Instant photographs — a beach, a tide pool, a sunset — laid directly on a hand-dyed fabric backdrop. The photograph and the dye bleed into the same soft, faded register.', materials: 'Instant photographs on hand-dyed fabric', image: `${BLOB}/mixed/polaroids-on-fabrics.jpg`, gallery: g('mixed/polaroids-on-fabrics', 1) },
  { slug: 'tufting-on-embroidered-background', title: 'Tufting on Embroidered Background', category: 'mixed', year: '2020', description: 'A high-pile tufted face sits beside a scatter of loose embroidered marks on kraft paper, framed together as one piece. Two techniques that don\'t usually share a frame, here sharing one.', materials: 'Wool tufting and hand embroidery, framed', image: `${BLOB}/mixed/tufting-on-embroidered-background.jpg`, gallery: g('mixed/tufting-on-embroidered-background', 1) },
  { slug: 'laundry-bags',       title: 'Laundry Bags',       category: 'mixed', year: '2020', description: 'Hand-woven textile bags in geometric and striped patterns — functional objects made on a loom rather than bought. Domestic use as a formal constraint, not a compromise.', materials: 'Hand-woven textile', image: `${BLOB}/mixed/laundry-bags.jpg`, gallery: g('mixed/laundry-bags', 1) },
];

const BLOB_WORKS = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'
const BLOB_BLOG = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/blog'

export const blogPosts: BlogPost[] = [
  {
    slug: "photography-in-the-practice",
    title: "Photography in the practice",
    date: "2026-06-20",
    excerpt: "Why a textile artist photographs everything. On looking closely, the phone camera as sketchbook, and what an image does that a stitch can't.",
    image: `${BLOB_BLOG}/artyear-2021-08.jpg`,
    body: [
      "I started photographing seriously around the same time I started tufting — 2019, 2020. The two practices are not unrelated. Tufting demands that you look at something long enough to translate it into pile and colour. Photography is the note you take so you can look at it again later. They grew up together.",
      "What I photograph is almost never something I plan to reproduce directly in textile. It's more like a training of attention. Moss on a stone. A yellow flower on linen. A ball of yarn before it becomes something else. The subjects are ordinary in a specific way: they reward close looking, but only if you bring the looking.",
      "The photographic work I include in the fine art section is a small fraction of what I shoot. These are the images that became something more than reference — where the light did something unexpected, or where the composition landed on its own terms. I print these on archival inkjet at A3 or A2 and treat them exactly like any other work.",
      "The phone camera changed things. I used to carry a camera body. Now I carry a phone, and the discipline changed with it. The phone is faster, lighter, less intentional. You catch things rather than wait for them. Some of the best photographs in the photography archive — including the moss work and the frog — were shot on a phone precisely because I could reach the camera before the moment disappeared.",
      "There's no hierarchy between the mediums for me. A photograph I spent an afternoon making and a tufted piece that took fifteen hours both ended up in the archive on the same terms: did it say something worth saying? If yes, it's work. If no, it's deleted or unpicked.",
    ],
  },
  {
    slug: "2021-a-year-of-making",
    title: "2021 — a year of making",
    date: "2022-01-10",
    excerpt: "Looking back at 2021: the busiest year in the studio. Tufting took over. The embroidery series expanded. Photography became its own practice.",
    image: `${BLOB_BLOG}/artyear-2021-02.jpg`,
    body: [
      "2021 was the year the studio stopped being a space I visited and became a space I lived in. I was there most days. The tufting gun was always threaded. The embroidery frames were always up. I made more work than in any previous year, and almost all of it surprised me.",
      "The tufted work expanded from small pieces to large-format wall works. Liebes Panopticon happened in 2021 — one of the pieces I'm most proud of, and the one that changed how I thought about scale. After that I stopped thinking of tufting as a small-format practice. The gun can go as large as the frame. The frame can go as large as the wall.",
      "The embroidery series became its own distinct voice in 2021. Before that I think of it as continuous with the textile work in general — they were made with the same materials, same slow attention. But in 2021 the text pieces started coming one after another: Fuck Alting, Ingenting, Mariann, the two versions of Gud Har Meldt Afbud. The text embroidery is now one of the things people respond to most strongly in the work.",
      "Photography started properly in 2021. I'm counting from around March of that year. I'd been shooting for years but not thinking of the images as work. In 2021 I started treating them the same way: selecting, editing, deciding which ones were finished. The taped objects, the flowers on linen, the polaroids — all from that year.",
      "I can't fully explain why 2021 was different. Some of it was the pandemic, which cleared the schedule in a strange way. Some of it was that the tufting gun had arrived and I was still in the phase where the new tool makes everything feel possible. Some of it was just that certain years are for making, and this was one of them.",
    ],
  },
  {
    slug: "sommerby-june",
    title: "Sommerby in June",
    date: "2026-06-18",
    excerpt: "Notes from the summer house — new botanical sketches, long light, the garden in its peak moment.",
    image: `${BLOB_WORKS}/painting/blue-branch.jpg`,
    body: [
      "I've been at Sommerby for most of June. The garden is at the exact point where everything is slightly too much — too green, too full, the poppies already past their peak and the roses just starting. I've been drawing and painting from the garden every day. Not planned pieces. Studies. The kind of work where you're not sure what you're making until later.",
      "The botanical series that started in spring is becoming something else here. The earlier work was more formal — close-up, graphic, the plants as subjects. What I'm making now is more about atmosphere. The specific quality of Gørlev light at 8pm in June. The way shadows fall on old garden walls. Less illustration, more field notes.",
      "I keep thinking about the difference between working in the studio in Copenhagen and working here. In the studio I have material, space, equipment. Here I have a sketchbook and whatever paint I remembered to bring. The limitations do something useful. You can't be ambitious. You can only notice what's in front of you.",
      "The large NEKO piece from June is drying in the studio. I'll see it again when I get back and decide whether it's done. Distance always helps. The cat is still looking at something off-frame. I'm starting to think she's looking at the garden.",
    ],
  },
  {
    slug: "what-stays-what-goes",
    title: "What stays, what goes",
    date: "2026-03-14",
    excerpt: "Clearing the studio after winter. Notes on what to keep and what to let go.",
    image: `${BLOB_WORKS}/tufting/bedroom-rug.jpg?v=2`,
    body: [
      "Every spring I do a version of the same thing: I go through what's hanging on the walls of the studio and ask which pieces have earned their place. Not sentimental. Not whether I still like them. Whether they're still saying something worth saying.",
      "This year I moved three pieces out and two into the flat. One — a small embroidered panel I made in 2020 during the first lockdown — I've looked at almost every day for five years and it still surprises me. That's the test, I think. The work that keeps surprising you is the work that's alive.",
      "What goes is harder to explain. Sometimes a piece stops. It made something happen, it did its job, and now it's just an object. There's no grief in that. Objects become art and then sometimes become objects again. The process was real. It's enough.",
      "I'm starting the new season with three blank stretcher frames and no plan. That's deliberate. The pieces I'm most proud of came from starting with material and following it. I'm trying to trust that again.",
    ],
  },
  {
    slug: "the-neko-series",
    title: "On the NEKO series",
    date: "2025-10-02",
    excerpt: "Why cats, and why now. The thinking behind the longest-running series.",
    image: `${BLOB_WORKS}/embroidery/mariann.jpg`,
    body: [
      "NEKO started as a joke. I was making a tufted piece and needed a subject that was simple enough to work at a large scale quickly — something with a clear silhouette. I chose a cat sitting with its back to me. It worked. I made another. Then another with a different posture. Then I realised I'd been making the same cat for two years.",
      "The series grew out of that. What I've come to understand is that the cats aren't really about cats — they're about observation. The specific quality of watching something that isn't watching back. There's no performance in a cat sitting in a patch of sunlight. They're just doing what they're doing, indifferent to whether you find it beautiful.",
      "That indifference is something I've tried to build into the work. The pieces don't ask for anything from you. They don't explain themselves. If you spend time with them something might open up, or it might not. That's fine. The work exists whether or not you're looking.",
      "NEKO is the series I return to when I'm not sure what I'm doing. It has clear constraints — cats, symbols, graphic — and within those constraints I keep finding things I didn't expect. That's usually a sign that a body of work is still alive.",
    ],
  },
  {
    slug: "kaleidoscope-pattern-observation",
    title: "Kaleidoscope Pattern Observation",
    date: "2021-09-01",
    excerpt: "Observations on pattern, colour, and the infinite.",
    image: `${BLOB_WORKS}/tufting/rainbow-I.jpg`,
    body: [
      "There is something that happens when a pattern starts to repeat — a moment where your eye stops tracking the individual elements and begins to read the whole. It becomes something else. A texture. A field. A kind of hum.",
      "I've been thinking about this a lot lately, working on pieces where the pattern is the point. Not decoration. Not background. The pattern itself as the subject. The kaleidoscope as a model: the same fragment, rotated, reflected, multiplied — and suddenly it has presence.",
      "Colour behaves differently in pattern than it does in isolation. A yellow that would be cheerful on its own becomes electric in repetition. A red that reads as aggressive alone settles into something ceremonial. I find this endlessly interesting. The infinite in the small.",
    ],
  },
  {
    slug: "dont-shoot-we-are-humans",
    title: "Don't Shoot We Are Humans",
    date: "2021-08-15",
    excerpt: "On humanity and the political dimension of art.",
    image: `${BLOB_WORKS}/embroidery/fuck-alting.jpg`,
    body: [
      "I didn't set out to make political art. But at some point I realised that everything I make is political, because I am a person with a body in a world that has opinions about that body. There's no neutral.",
      "The embroidery work especially. There's something about the slowness of it — the hours and hours of hand stitching — that feels like a form of insistence. I am here. I am making something. I refuse to be invisible.",
      "The title of this note comes from a phrase I kept returning to during a difficult period. It sounds like a protest sign. It sounds like pleading. It's both. I think a lot of my work lives in that gap between the two.",
    ],
  },
  {
    slug: "working-title-modern-things",
    title: "Working Title Modern Things",
    date: "2021-07-20",
    excerpt: "Notes on working with modern materials and old techniques.",
    image: `${BLOB_WORKS}/painting/universe-1.jpg`,
    body: [
      "Tufting is a technique from the mid-20th century carpet industry, scaled down and repurposed for fine art. Every time I explain it to someone, they say: 'Oh, like a rug?' And yes. Exactly like a rug. That's part of what I find interesting about it.",
      "There's a hierarchy built into how we think about materials and techniques. Oil on canvas sits near the top. Textiles — woven, stitched, tufted — sit lower, associated with craft, with women's work, with the domestic and the utilitarian. I find that hierarchy worth interrogating.",
      "I'm not interested in elevating textile work by distancing it from its origins. I'm interested in the origins themselves. The fact that this started in factories, in households, in the everyday. The 'modern things' in the title are partially a joke. The technique is old. The insistence on using it is the modern thing.",
    ],
  },
  {
    slug: "most-leafy-plants-are-feminine",
    title: "Most Leafy Plants Are Feminine",
    date: "2021-07-01",
    excerpt: "A meditation on femininity, nature, and growth.",
    image: `${BLOB_WORKS}/painting/blue-branch.jpg`,
    body: [
      "Someone said this to me once, completely seriously, as botanical explanation. I don't know if it's scientifically true. But I've been thinking about it since — the way we gender things that have no gender, and what that reveals about us.",
      "Plants in art have a long history of meaning something other than themselves. Roses for love, willows for grief, oak for strength. The botanical vocabulary is ancient and loaded. When I draw leaves, I'm drawing into that weight whether I want to or not.",
      "What I'm trying to do is reclaim some of that. Not the assigned meanings but the shapes themselves. The specific way a leaf curls. The exact green of new growth before it hardens. Growth as a fact rather than a metaphor — though it can be both.",
    ],
  },
  {
    slug: "the-fall",
    title: "The Fall",
    date: "2021-06-10",
    excerpt: "On endings, transitions, and new beginnings.",
    image: `${BLOB_WORKS}/tufting/birds.jpg`,
    body: [
      "I've been thinking about falls. The season, the act, the mythology. There's a specific melancholy to the time when things are ending that I find very productive. I don't mean this in a morbid way. I mean that endings clarify.",
      "A piece I'm working on keeps returning to the image of birds in migration. They leave. They know to leave. They have a direction encoded in them that I find enviable and mysterious. Seasonal. Purposeful. The fall is part of their year the way it's part of ours — a signal.",
      "The tufting on this piece is deliberately irregular. The pile height varies. In some places the backing shows through. I wanted the impermanence visible in the work rather than smoothed over.",
    ],
  },
  {
    slug: "fylgja",
    title: "Fylgja",
    date: "2021-05-20",
    excerpt: "Norse mythology and the spirit that follows.",
    image: `${BLOB_WORKS}/tufting/purple-sun.jpg`,
    body: [
      "In Norse mythology, a fylgja is a spirit that accompanies a person through life — a kind of double, or attendant, that is part of your being but separate from it. You can't see your own fylgja. Others sometimes can.",
      "I've been drawn to this idea because it names something I've always felt but didn't have language for. The sense of something that travels with you. That is you, in some sense, but also witnesses you. The creative practice as fylgja — the thing that follows me through everything, that others encounter through the work.",
      "The piece I named after this concept is one of my earliest tufted works. The purple felt right. Saturated, a little ceremonial, slightly out of ordinary time. That's what I was going for.",
    ],
  },
  {
    slug: "colour-before-language",
    title: "Colour before language",
    date: "2025-09-12",
    excerpt: "On the primacy of colour in the studio — how a palette develops before the subject does.",
    image: `${BLOB_WORKS}/painting/colour-study-blue.jpg`,
    body: [
      "I almost always know the colours before I know what I'm making. Not in a conscious way — it's more like a pressure. A particular red that keeps appearing in my head. A yellow I can't shake. The subject comes later, summoned by the colour rather than the other way around.",
      "This year the colour is green. Not botanical green — something older. The green in old tapestries, slightly grey, with brown underneath it. I've been pulling yarns and mixing acrylics for two months, trying to land it. I don't have a piece yet. I have a colour.",
      "I think this is how it should work. The meaning isn't somewhere ahead of me, waiting to be illustrated. It's in the making. The colour leads and I follow, and at some point something arrives that wasn't there before.",
      "I used to try to have the work planned before I started. A sketch, a reference, an idea of what the thing would be. It was slower and the work was worse. The pieces that mean the most to me — the tufted ones especially — came from putting a colour on a frame and seeing what it wanted to become.",
    ],
  },
  {
    slug: "the-shop-of-words",
    title: "The Shop of Words",
    date: "2025-11-28",
    excerpt: "On text as subject in the work — when the word is the image.",
    image: `${BLOB_WORKS}/embroidery/fuck-alting.jpg`,
    body: [
      "Words have been in the work since the beginning. Not as title cards or explanations — as the visual subject itself. The embroidery piece that says 'Fuck Alting' (Fuck Everything) isn't captioned with those words. The words are the work. You're reading a textile.",
      "I'm fascinated by what happens to language when you make it by hand. When you stitch a word letter by letter, something about the time spent starts to attach to the meaning. 'ELSK' — love in Danish — took me three days to embroider. I thought about the word for three days while making it. That's not how you normally read.",
      "The Shop of Words is the informal name I've given to the text-based thread of my practice. Embroidery, tufted lettering, digital works where the word is the motif. It's the most directly political part of what I make — language picked up from what I read and hear, and then slowed down into something material.",
      "Right now I'm working on a large piece with a single sentence in it. I'm not going to write the sentence here — I don't know what it fully means yet. That's part of the work: making it visible in order to find out what it is.",
    ],
  },
  {
    slug: "on-the-shero-series",
    title: "On the SHERO series",
    date: "2025-12-15",
    excerpt: "Where SHERO came from and what it's become — feminist icons, embroidery, and the politics of naming.",
    image: `${BLOB_WORKS}/embroidery/fuck-alting.jpg`,
    body: [
      "SHERO started with a name. I was thinking about the word 'hero' — how it carries a body, how the default body in that word is male — and I wanted to make that visible. SHERO isn't a portmanteau I invented. It's been around. But putting it into the work, stitching it letter by letter, attaching it to images of women I was drawing — it became something else.",
      "The series grew sideways from there. First the text works: 'Fuck Alting', 'Ingenting', 'Mariann'. Then the embroidered figures — faces, postures, bodies. The NEKO series is a distant relative. The cats and the women in the SHERO pieces share something: indifference, presence, the refusal to perform for whoever is watching.",
      "I've been asked whether the work is angry. I don't think that's quite right. It's certain. There's a difference. Anger implies a reaction to something external. What I'm making is a statement that doesn't require anyone else to be wrong. It's enough to be here, to insist on being seen — not seen through, but seen.",
      "The pieces I'm proudest of in this series are the ones where the politics disappear into the form. Where you stop reading 'feminist artwork' and start reading the work itself. That's the goal: to make something so formally good that the content is just the content.",
    ],
  },
  {
    slug: "on-the-floor",
    title: "On the floor",
    date: "2025-07-10",
    excerpt: "On floor pieces, domestic space, and the question of what counts as fine art.",
    image: `${BLOB_WORKS}/tufting/bedroom-rug.jpg?v=2`,
    body: [
      "I made my first floor piece in 2020. A pink rug. I made it because I wanted to see what tufting felt like at larger scale, under foot. The result surprised me — not because of the technical execution but because of what happened when I put it in a room. It changed the room. Not decoratively. Structurally.",
      "There's a long argument in art about whether something that serves a function can be art. I don't find that argument interesting. The Bedroom Rug is on the floor. People stand on it. It's also a work I made with intention and care and a clear set of formal decisions about colour and pile height and edge treatment. Why would 'floor' disqualify it?",
      "The domestic is a subject I keep returning to, partly because it's where most of life happens and partly because it's been systematically undervalued as a subject — especially in work made by women. When I put an artwork on the floor, I'm not lowering it. I'm asking what the floor might be.",
      "Both floor pieces I've made have sold. I don't know if people bought them as rugs or as art. I hope the distinction blurred.",
    ],
  },
  {
    slug: "the-universe-series",
    title: "The Universe Series",
    date: "2026-04-20",
    excerpt: "Seven years into a body of work that started as a single canvas and became a series without a planned end.",
    image: `${BLOB_WORKS}/painting/universe-1.jpg`,
    body: [
      "The first Universe painting was made in 2019 and I didn't think of it as the start of a series. I thought it was a painting. I was working on the studio floor with acrylic and oil stick, and something happened in the making — a colour relationship I hadn't planned, a mark I didn't decide to make. I kept going.",
      "Seven years later I've made somewhere between twelve and fifteen versions. I've lost count of the ones I painted over. The series has no defined endpoint — each painting is a different attempt at the same question, which is roughly: what does it look like when you try to paint something that has no edges?",
      "The technique is always the same: large canvas on the floor, acrylic in thin layers, oil stick for marks that stay. Build up, scrape back. Let it dry. Come back. The drying is part of the work — you can't force it. Some canvases I've worked on for weeks across multiple sessions. Others happen in one long day.",
      "I'm sometimes asked what the Universe paintings mean. I find this question hard because the answer is: they mean whatever the colour and the mark mean together. There's no hidden subject. The surface is the subject. If you look long enough, something opens up — or it doesn't. Either is fine.",
    ],
  },
  {
    slug: "made-by-hand-in-june",
    title: "Made by hand in June",
    date: "2026-06-01",
    excerpt: "Studio notes from early summer — what's on the frame, what's next.",
    image: `${BLOB_WORKS}/tufting/floral-thing.jpg`,
    body: [
      "June in the studio is a particular kind of productive. The light lasts until 10pm and there's no reason to stop. I've been working longer sessions and sleeping later, which is a studio rhythm I like and a human rhythm that doesn't love me back.",
      "On the frame right now: a large NEKO piece, maybe 80×100 cm, that started as a quick study and became something more ambitious. I've been working into it for six weeks. The cat in it is sitting with her back to you, facing something off-frame. I don't know what she's looking at. That's the piece.",
      "The print shop has been going well. It's strange to see work I made in 2021 arriving in someone's flat in Ghent or Stockholm. The prints are faithful — Gelato's quality is genuinely good — but they're also something new. The original has pile and texture you can feel. The print has a flatness that makes the colour more direct. They're siblings, not copies.",
      "What's next: a new botanical series I've been sketching since April. Plants observed from the summer house garden — less formal than the earlier botanical work, looser, more interested in the specific quality of a leaf that's slightly past its peak. Also starting to think about a third tufted mask. The first two sold; I think there are more.",
    ],
  },
];

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug);
}

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const idx = blogPosts.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? blogPosts[idx - 1] : null,
    next: idx < blogPosts.length - 1 ? blogPosts[idx + 1] : null,
  };
}

export function getWorksByCategory(category: WorkCategory) {
  return works.filter((w) => w.category === category);
}
