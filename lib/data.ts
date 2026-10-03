export type WorkCategory = "tufting" | "embroidery" | "painting" | "photography" | "mixed" | "handhooking" | "digital";

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
  hidden?: boolean;     // kept in the data but excluded from the site (unfinished / not yet photographed)
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

const allWorks: Work[] = [
  // Tufting
  { slug: 'purple-sun', title: 'Purple Sun', category: 'handhooking', year: '2019', description: 'Handhooking in mixed fibres. About a week of near-daily work. Made as a cushion for Stine\'s office chair; it now belongs to Ulrikke.', materials: 'Mixed fibres — wool, cotton, silk, acrylic, recycled cotton', image: `${BLOB}/tufting/purple-sun.jpg`,        gallery: g('tufting/purple-sun', 5), sold: true, availabilityNote: 'Not for sale — currently with Ulrikke' },
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
  { slug: 'birds', title: 'Birds', category: 'mixed', year: '2021', description: 'A mixture of tufting, embroidery and painting. Two birds.', materials: 'Wool and cotton tufting, embroidery, and acrylic painting on canvas', image: `${BLOB}/tufting/birds.jpg`,             gallery: [`${BLOB}/tufting/birds.jpg`, ...g('tufting/birds', 5)] },
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
  { slug: 'fuck-alting', title: 'Fuck Alting', category: 'embroidery', year: '2020', description: '"Fuck alting" — Danish for "fuck everything" — embroidered by hand. The small embroidered pieces shown below it are part of the work.', image: `${BLOB}/embroidery/fuck-alting.jpg`,         gallery: g('embroidery/fuck-alting', 5) },
  // Gallery reordered 2026-08-02 — gallery[0] was an angled close-up; gallery/2.jpg (a
  // clean full shot) promoted to position 0 (image audit).
  { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud', category: 'embroidery', year: '2019', series: 'gud-har-meldt-afbud', description: '"Gud har meldt afbud" — God has cancelled. Hand embroidery. There are more of them. More graphic than Gud Har Meldt Afbud II. Shown together with Gud Har Meldt Afbud II and Long Hair Don\'t Care as three standalone works.', image: `${BLOB}/embroidery/gud-har-meldt-afbud.jpg`, gallery: [2, 1, 3, 4].map(i => `${BLOB}/embroidery/gud-har-meldt-afbud/gallery/${i}.jpg`) },
  // Gallery reordered 2026-08-02 — gallery[0] was an extreme macro of the stitched heart;
  // gallery/2.jpg (a full shot of the whole piece) promoted to position 0 (image audit).
  { slug: 'elsk', title: 'Elsk', category: 'embroidery', year: '2021', description: 'The Danish word "elsk" — "love" — embroidered by hand.', image: `${BLOB}/embroidery/elsk.jpg`,                gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/embroidery/elsk/gallery/${i}.jpg`) },
  { slug: 'be-a-dragon', title: 'Be a Dragon', category: 'embroidery', year: '2021', description: 'A quote from Game of Thrones, embroidered by hand.', materials: 'Hand embroidery on fabric', image: `${BLOB}/embroidery/be-a-dragon.jpg`,         gallery: g('embroidery/be-a-dragon', 3) },
  { slug: 'theres-nothing-here', title: "There's Nothing Here", category: 'embroidery', year: '2020', hidden: true, description: 'Hand embroidery on watercolour-painted fabric. Not finished yet — the photograph is a process shot. Hidden from the site until it is finished and photographed.', materials: 'Hand embroidery on watercolour-painted fabric', image: `${BLOB}/embroidery/theres-nothing-here.jpg`, gallery: g('embroidery/theres-nothing-here', 1) },
  // Gallery reordered 2026-08-02 — gallery[0] was a badly blurred close-up with a bicycle
  // in the foreground; gallery/2.jpg (a clean full shot) promoted to position 0 (image audit).
  { slug: 'mariann', title: 'Mariann', category: 'embroidery', year: '2020', availabilityNote: 'Not for sale — hangs at Stine\'s parents\'', sold: true, description: 'One of a pair of embroideries made as 70th-birthday gifts — one for Stine\'s mother, one for her father. They hang at her parents\' home.', materials: 'Hand embroidery on fabric', image: `${BLOB}/embroidery/mariann.jpg`,             gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/embroidery/mariann/gallery/${i}.jpg`) },
  { slug: '38-homes', title: '38 Homes', category: 'embroidery', year: '2021', description: 'One work in about 15 parts. Stine counted every home she has lived in and made one piece per home. The parts belong together as one unit, and the work is open-ended. All 15 parts are shown here.', materials: 'Hand embroidery on fabric', image: `${BLOB}/embroidery/38-homes/part-01.jpg`, gallery: Array.from({ length: 15 }, (_, i) => `${BLOB}/embroidery/38-homes/part-${String(i + 1).padStart(2, '0')}.jpg`) },
  { slug: 'collage-bw', title: 'Collage', category: 'embroidery', year: '2021', description: 'Made at night, after waking up. A thread collage in monochrome and dark blue.', dimensions: '100×70 cm', materials: 'Hand embroidery on fabric', image: `${BLOB}/embroidery/collage-bw.jpg`,          gallery: g('embroidery/collage-bw', 5) },
  { slug: 'perfidt-perfekt', title: 'Perfidt Perfekt', category: 'embroidery', year: '2021', description: '"Perfidt perfekt" — hand embroidery on fabric. The last word is deliberately left unfinished: "perfekt" is not completed, so the work itself is imperfect.', materials: 'Hand embroidery on fabric', image: `${BLOB}/embroidery/perfidt-perfekt.jpg`,     gallery: g('embroidery/perfidt-perfekt', 1) },
  // Main image + all gallery slots point at gallery/1.jpg (2026-07-17, per Sebastian) — the
  // old main image was mirrored/reversed (text illegible), gallery/1.jpg reads correctly.
  { slug: 'ingenting', title: 'Ingenting', category: 'embroidery', year: '2020', description: 'The whole cloth of an embroidery reading "Her er ingenting" — "There is nothing here" in Danish. Two close-ups follow.', materials: 'Hand embroidery on fabric', image: `${BLOB}/embroidery/ingenting/whole.jpg`, gallery: [`${BLOB}/embroidery/ingenting/whole.jpg`, `${BLOB}/embroidery/ingenting/detail-1.jpg`, `${BLOB}/embroidery/ingenting/detail-2.jpg`] },
  { slug: 'gud-har-meldt-afbud-ii', title: 'Gud Har Meldt Afbud II', category: 'embroidery', year: '2020', series: 'gud-har-meldt-afbud', description: 'Hand embroidery on cotton fabric painted with colour. The text is being overtaken by flowers: God can\'t be bothered any more, now it is up to us. The message is hidden, grown over organically. More floral than the first, which is more graphic. Shown together with Gud Har Meldt Afbud and Long Hair Don\'t Care as three standalone works.', materials: 'Hand embroidery on cotton fabric painted with colour', image: `${BLOB}/embroidery/gud-har-meldt-afbud-II.jpg`, gallery: g('embroidery/gud-har-meldt-afbud-II', 5) },
  { slug: 'long-hair-dont-care', title: "Long Hair Don't Care", category: 'embroidery', year: '2020', series: 'gud-har-meldt-afbud', description: 'Embroidered on top of a hand-embroidered tablecloth found at a flea market. The point is swearing on top of someone\'s careful handwork. Shown together with the two Gud Har Meldt Afbud pieces as three standalone works.', materials: 'Hand embroidery on a hand-embroidered tablecloth found at a flea market', image: `${BLOB}/embroidery/long-hair-dont-care.jpg`, gallery: g('embroidery/long-hair-dont-care', 2) },
  // Added 2026-07-18 — confirmed missing from the site; also a medium correction: this
  // piece sat in the Dropbox Tufting folder but is satin-stitch embroidery, not tufted wool.
  { slug: 'fireworks', title: 'Fireworks', category: 'embroidery', year: '2020', description: 'A sampler (prøvestykke) for trying out embroidery techniques. Five starbursts in gold, crimson and lavender thread, scattered across deep teal fabric, worked in satin stitch.', materials: 'Hand embroidery on fabric — sampler', image: `${BLOB}/embroidery/fireworks.jpg`, gallery: g('embroidery/fireworks', 1) },
  // Added 2026-07-17 — confirmed missing from the site entirely (full Dropbox sweep)
  { slug: 'det-er-bare-tanker', title: 'Det Er Bare Tanker', category: 'embroidery', year: '2018', availabilityNote: 'Not for sale — with Ulrikke', sold: true, description: 'Hand embroidery on vintage floral fabric, framed. "Det er bare tanker" — "it\'s just thoughts" — is a phrase from a psychologist, used against intrusive thoughts. Stitched in a fading rainbow gradient, yellow into red. Made for Ulrikke when she went to efterskole; Ulrikke has it.', materials: 'Hand embroidery on vintage floral fabric, framed', image: `${BLOB}/embroidery/det-er-bare-tanker.jpg`, gallery: g('embroidery/det-er-bare-tanker', 1) },
  { slug: 'red-to-blue-broderi', title: 'Red to Blue', category: 'embroidery', year: '2021', description: 'Made on Strynø, inspired by the sea and the sunset. Embroidery on cotton fabric dyed with watercolour and ink. A wave in beads, sequins and thread breaks across one corner; loose French knots are scattered across the dyed field.', materials: 'Hand embroidery on cotton fabric dyed with watercolour and ink', image: `${BLOB}/embroidery/red-to-blue-broderi.jpg`, gallery: g('embroidery/red-to-blue-broderi', 3) },
  // Paintings
  { slug: 'universe-1', title: 'Universe I', category: 'painting', year: '2021', description: 'One of the three paintings in the Universe series.', image: `${BLOB}/painting/universe-1/finished.jpg`,   gallery: [`${BLOB}/painting/universe-1/finished.jpg`, ...g('painting/universe-1', 5)] },
  // Cache-busted with ?v=2 — old main image was an extreme detail crop with a harsh shadow
  // cast across it, no context of the whole canvas. New set uses the clean full-canvas shot
  // + confirmed-matching detail crops (see LOG.md 2026-07-17).
  { slug: 'universe-2', title: 'Universe II', category: 'painting', year: '2021', description: 'One of the three paintings in the Universe series.', image: `${BLOB}/painting/universe-2/finished.jpg`,   gallery: [`${BLOB}/painting/universe-2/finished.jpg`, ...g('painting/universe-2', 4).map(u => `${u}?v=2`)] },
  { slug: 'universe-3', title: 'Universe III', category: 'painting', year: '2021', description: 'One of the three paintings in the Universe series.', image: `${BLOB}/painting/universe-3/finished.jpg`,   gallery: [`${BLOB}/painting/universe-3/finished.jpg`, ...g('painting/universe-3', 5)] },
  // Gallery reordered 2026-08-02 — gallery[0] was an unrelated shot of an unpainted branch,
  // not even the finished piece; gallery/2.jpg (= the hero, a genuine full shot) promoted
  // to position 0 (image audit).
  { slug: 'blue-branch', title: 'Blue Branch', category: 'painting', year: '2021', availabilityNote: 'Temporary work — no longer exists', sold: true, description: 'A painted branch, hung in the garden as a temporary artwork. It eventually broke — the work no longer exists.', materials: 'Painted branch', image: `${BLOB}/painting/blue-branch.jpg`,         gallery: [2, 1, 3, 4, 5].map(i => `${BLOB}/painting/blue-branch/gallery/${i}.jpg`) },
  // Gallery updated 2026-08-02 — the whole gallery array was unrelated compositions (a
  // still life, a sketchbook spread), never this painting itself. Added the correct
  // full-piece photo from Dropbox as gallery[0] (image audit).
  { slug: 'untitled-watercolour', title: 'Untitled', category: 'painting', year: '2021', description: 'Watercolour on paper. Untitled. Several companion watercolours exist.', materials: 'Watercolour on paper', image: `${BLOB}/painting/person-walking.jpg`,      gallery: [6, 1, 2, 3, 4, 5].map(i => `${BLOB}/painting/person-walking/gallery/${i}.jpg`) },
  { slug: 'green-on-blue', title: 'Green on Blue', category: 'painting', year: '2021', description: 'Acrylic on canvas on wood. Kept in the basement; the photograph shows it as it is.', materials: 'Acrylic on canvas on wood', image: `${BLOB}/painting/green-on-blue.jpg`, gallery: g('painting/green-on-blue', 5) },
  // Gallery reordered 2026-08-02 — gallery[0] showed only 2 of 3 canvases, one cropped off;
  // gallery/2.jpg (all 3 canvases fully in frame) promoted to position 0 (image audit).
  { slug: 'universe-collection', title: 'Universe Collection', category: 'painting', year: '2021', description: 'The three Universe paintings together. One of them hangs on the wall at home.', image: `${BLOB}/painting/universe-collection/finished.jpg`,   gallery: [`${BLOB}/painting/universe-collection/finished.jpg`, ...[2, 1, 3, 4, 5].map(i => `${BLOB}/painting/universe-collection/gallery/${i}.jpg`)] },
  { slug: 'colour-study-blue', title: 'Colour Study Blue', category: 'painting', year: '2021', description: 'Ink on paper.', materials: 'Ink on paper', image: `${BLOB}/painting/colour-study-blue.jpg`,   gallery: g('painting/colour-study-blue', 1) },
  { slug: 'sri-lanka-masks', title: 'Sri Lanka Masks', category: 'painting', year: '2020', description: 'Watercolours on paper — masks from Sri Lanka. They are stored in the basement. Stine loves them for their colours.', materials: 'Watercolour on paper', image: `${BLOB}/painting/sri-lanka-masks.jpg`,     gallery: g('painting/sri-lanka-masks', 5) },
  { slug: 'bird-man', title: 'Bird Man', category: 'digital', year: '2021', availabilityNote: 'Not for sale as an original — available as a print', sold: true, description: 'A digital drawing, made in Procreate. Not for sale as an original; it works as an A4 print (perhaps A3).', materials: 'Digital drawing (Procreate)', image: `${BLOB}/painting/bird-man.jpg`,           gallery: g('painting/bird-man', 4) },
  { slug: 'vaginals', title: 'Vaginals', category: 'painting', year: '2020', description: 'Watercolour on paper. Only one exists. Flower-like; made in a period when Stine was working on the idea of "Lady Gardens".', materials: 'Watercolour on paper', image: `${BLOB}/painting/vaginals/finished.jpg`, gallery: [`${BLOB}/painting/vaginals/finished.jpg`, ...g('painting/vaginals', 3)] },
  { slug: 'buddha', title: 'Buddha', category: 'painting', year: '2021', availabilityNote: 'Not for sale', sold: true, description: 'Wrapped in plastic, leaning on the studio wall.', image: `${BLOB}/painting/buddha/finished.jpg`, gallery: [`${BLOB}/painting/buddha/finished.jpg`, ...g('painting/seb-livingroom', 5)] },
  { slug: 'the-bather', title: 'The Bather', category: 'painting', year: '2022', description: 'A woman in a red swimsuit by the sea, hair blowing, one arm out over the waves under a yellow sky. Painted on a stretched canvas.', materials: 'Painting on stretched canvas', image: `${BLOB}/painting/the-bather.jpg`, gallery: g('painting/the-bather', 3) },
  // Added 2026-07-17 — confirmed missing from the site entirely (Sebastian caught the gap)
  { slug: 'sri-lanka-study', title: 'Sri Lanka Study', category: 'painting', year: '2020', description: 'Watercolour on paper, from Sri Lanka. A small robed figure in a flame-coloured crown, planted among loose washes of grass and flowers.', materials: 'Watercolour on paper', image: `${BLOB}/painting/hc-andersen.jpg`, gallery: g('painting/hc-andersen', 3) },
  { slug: 'her-er-en-sandhed', title: 'Her Er En Sandhed', category: 'painting', year: '2019', description: 'A small collage from a sketchbook. The text reads "det er nok at stå ud af sengen" — it is enough to get out of bed.', materials: 'Collage on a sketchbook page', image: `${BLOB}/painting/her-er-en-sandhed.jpg`, gallery: [`${BLOB}/painting/her-er-en-sandhed.jpg`] },
  { slug: 'fantasy', title: 'Fantasy', category: 'painting', year: '2020', description: 'A very small watercolour sketch from a sketchbook. It looks like something between a fairy and a bomb. Not a standalone piece — a sketchbook page.', materials: 'Watercolour on paper (sketchbook)', image: `${BLOB}/painting/fantasy.jpg`, gallery: g('painting/fantasy', 1) },
  { slug: 'blue-background-dayin', title: 'Blue Background (Day In Day In)', category: 'mixed', year: '2020', description: 'A digital collage over a photograph; the background is painted. It exists as a digital file.', materials: 'Digital collage over a photograph with a painted background', image: `${BLOB}/painting/blue-background-dayin.jpg`, gallery: g('painting/blue-background-dayin', 1) },
  // Photography
  { slug: 'view-from-the-studio', title: 'View from the Studio', category: 'photography', year: '2021', description: 'Graphic, almost a collage — layers on layers. The studio no longer looks like this.', image: `${BLOB}/photography/view-from-the-studio.jpg`,      gallery: g('photography/view-from-the-studio', 1) },
  { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood', category: 'photography', year: '2021', description: 'An art photograph of a blue flower on green wood.', image: `${BLOB}/photography/blue-flower-on-green-wood.jpg`, gallery: g('photography/blue-flower-on-green-wood', 1) },
  { slug: 'red-and-green-moss', title: 'Red and Green Moss', category: 'photography', year: '2021', description: 'Several photographs of red and green moss, including the tray. Part of Stine\'s interest in temporary artworks and transience.', image: `${BLOB}/photography/red-and-green-moss.jpg`, gallery: [...g('photography/red-and-green-moss', 3), `${BLOB}/photography/red-and-green-moss/more-1.jpg`, `${BLOB}/photography/red-and-green-moss/more-2.jpg`] },
  { slug: 'no-ordinary-stone', title: 'No Ordinary Stone', category: 'photography', year: '2021', description: 'A photograph of a stone.', image: `${BLOB}/photography/no-ordinary-stone.jpg`, gallery: g('photography/no-ordinary-stone', 1) },
  // Gallery updated 2026-08-02 — every existing image was a crop of one section of the
  // arrangement, never the whole board. Added a wide establishing shot (converted from
  // the original RAW capture) from Dropbox as gallery[0] (image audit).
  { slug: 'taped-objects', title: 'Taped Objects', category: 'photography', year: '2021', description: 'Objects fixed with tape, photographed in a graphic way. Several views.', image: `${BLOB}/photography/taped-objects.jpg`,      gallery: [7, 1, 2, 3, 4, 5, 6].map(i => `${BLOB}/photography/taped-objects/gallery/${i}.jpg`) },
  { slug: 'flowers-on-linen', title: 'Flowers on Linen', category: 'photography', year: '2021', description: 'Flowers on linen. Stine singles this one out for its colours.', image: `${BLOB}/photography/flowers-on-linen.jpg`,   gallery: g('photography/flowers-on-linen', 6) },
  { slug: 'on-the-light-table', title: 'On the Light Table', category: 'photography', year: '2021', description: 'Flowers pressed in a laminator. The work was a hanging; this photograph is a deliberate excerpt that tells a story — the photograph is the work. Slightly eerie.', image: `${BLOB}/photography/on-the-light-table.jpg`, gallery: g('photography/on-the-light-table', 1) },
  { slug: 'dead-flowers', title: 'Dead Flowers', category: 'photography', year: '2021', description: 'A series over time: every bouquet Stine picked was allowed to wither and was photographed. Stine wants these as large prints.', image: `${BLOB}/photography/dead-flowers.jpg`,       gallery: [...g('photography/dead-flowers', 3), `${BLOB}/photography/dead-flowers/more-1.jpg`, `${BLOB}/photography/dead-flowers/more-2.jpg`, `${BLOB}/photography/dead-flowers/more-3.jpg`, `${BLOB}/photography/dead-flowers/more-4.jpg`] },
  { slug: 'purple-flower', title: 'Purple Flower', category: 'photography', year: '2021', description: 'A white flower, until Stine stood it in coloured water — now you can see all the colours. More shots exist.', image: `${BLOB}/photography/purple-flower.jpg`,             gallery: g('photography/purple-flower', 2) },
  { slug: 'linen-and-yellow-flower', title: 'Linen and Yellow Flower', category: 'photography', year: '2021', description: 'A yellow flower on linen. Almost a portrait of a day.', image: `${BLOB}/photography/linen-and-yellow-flower.jpg`, gallery: g('photography/linen-and-yellow-flower', 5) },
  { slug: 'a-very-small-frog', title: 'A Very Small Frog', category: 'photography', year: '2021', description: 'A very small frog.', image: `${BLOB}/photography/a-very-small-frog.jpg`,       gallery: g('photography/a-very-small-frog', 3) },
  { slug: 'colourful-shadows', title: 'Colourful Shadows', category: 'photography', year: '2021', description: 'Colourful shadows.', image: `${BLOB}/photography/colourful-shadows.jpg`,       gallery: g('photography/colourful-shadows', 3) },
  { slug: 'neko-cat-and-another-character', title: 'Neko Cat and Another Character', category: 'photography', year: '2021', description: 'A Neko cat artwork photographed next to another character.', image: `${BLOB}/photography/minnie-mouse-neko-cat.jpg`,   gallery: g('photography/minnie-mouse-neko-cat', 1) },
  // Gallery updated 2026-08-02 — every existing image was an extreme fabric-texture crop
  // with no garden visible at all, despite the title/description. Added the correct garden
  // scene (converted from the original RAW capture) from Dropbox as gallery[0] (image audit).
  { slug: 'purple-fabric-in-garden', title: 'Purple Fabric in Garden', category: 'photography', year: '2019', description: 'Laundry on the line — about colour and shadow.', image: `${BLOB}/photography/purple-fabric-in-garden.jpg`, gallery: [4, 1, 2, 3].map(i => `${BLOB}/photography/purple-fabric-in-garden/gallery/${i}.jpg`) },
  { slug: 'smorrebrod', title: 'Smørrebrød', category: 'photography', year: '2021', description: 'Smørrebrød — the essence of Stine\'s everyday home art: food made like this.', image: `${BLOB}/photography/smorrebrod.jpg`,              gallery: g('photography/smorrebrod', 1) },
  { slug: 'yarn', title: 'Yarn', category: 'photography', year: '2021', description: 'Yarn bought at a weaving mill / fabric place on a trip with Stine\'s mother. Set up where they stayed, with wood placed in front. More set-ups exist.', image: `${BLOB}/photography/yarn.jpg`,                   gallery: g('photography/yarn', 1) },
  { slug: 'office-shot', title: 'Office Shot', category: 'photography', year: '2021', description: 'Taken in the former office: "our colourful chaos". A work in itself.', image: `${BLOB}/photography/office-shot.jpg`,            gallery: g('photography/office-shot', 1) },
  // Mixed media — added 2026-07-18, confirmed by the full Dropbox sweep. New category.
  { slug: 'cat-doll', title: 'Cat Doll', category: 'mixed', year: '2020', description: 'Sewn entirely by hand. Stine hand-painted the fabric and embroidered it. Made on Strynø. It has an anchor tattoo. A little rebel cat that just appeared — not planned.', materials: 'Hand-sewn, hand-painted and embroidered fabric', image: `${BLOB}/mixed/cat-doll/finished-1.jpg`, gallery: [`${BLOB}/mixed/cat-doll/finished-1.jpg`, `${BLOB}/mixed/cat-doll/finished-2.jpg`] },
  { slug: 'pussy-bag', title: 'Pussy Bag', category: 'mixed', year: '2019', description: 'Hand-painted on a canvas shopping bag and hand-tufted, with the pussy on the outside. Usable, but meant to hang — it hangs in Stine\'s office. It had a small label that is now lost.', materials: 'Hand-painted canvas shopping bag, hand-tufted', image: `${BLOB}/mixed/pink-bag.jpg`, gallery: g('mixed/pink-bag', 1) },
  { slug: 'polaroids', title: 'Polaroids', category: 'mixed', year: '2020', description: 'A set-up of polaroids on a fabric background. The work is the whole set-up. The fabric background no longer exists; the polaroids do. Stine would sell a reproduction as a print.', materials: 'Polaroids on a fabric background', image: `${BLOB}/mixed/polaroids-on-fabrics.jpg`, gallery: [`${BLOB}/mixed/polaroids-on-fabrics.jpg`, `${BLOB}/photography/polaroids.jpg`, `${BLOB}/photography/polaroids/gallery/1.jpg`] },
  { slug: 'cut-out-face', title: 'Cut-Out Face', category: 'mixed', year: '2020', description: 'The face is cut out of a tufted work and pressed behind glass. The hair is cut.', materials: 'Cut-out part of a tufted work, behind glass', image: `${BLOB}/mixed/tufting-on-embroidered-background.jpg`, gallery: g('mixed/tufting-on-embroidered-background', 1) },
  { slug: 'laundry-bags', title: 'Laundry Bags', category: 'mixed', year: '2020', description: 'Laundry bags made from fabric that came from Stine\'s mother / a weaving mill. The fabric is gone, so they cannot be remade exactly.', materials: 'Textile bags', image: `${BLOB}/mixed/laundry-bags/finished-1.jpg`, gallery: [`${BLOB}/mixed/laundry-bags/finished-1.jpg`, `${BLOB}/mixed/laundry-bags/finished-2.jpg`, `${BLOB}/mixed/laundry-bags/finished-3.jpg`, `${BLOB}/mixed/laundry-bags/finished-4.jpg`] },
];

// Hidden works stay in allWorks (data kept) but are not exported — so they drop out of the grid,
// sitemap, search and static params in one place. Their old URL redirects in next.config.ts.
export const works: Work[] = allWorks.filter((w) => !w.hidden)

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
