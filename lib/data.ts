export type WorkCategory = "tufting" | "embroidery" | "painting" | "photography";

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
  { slug: 'purple-sun',        title: 'Purple Sun',        category: 'tufting', year: '2019', description: 'Wool tufting on cotton canvas. One of the earliest pieces — a sun motif in saturated violet.',                                              image: `${BLOB}/tufting/purple-sun.jpg`,        gallery: g('tufting/purple-sun', 5), sold: true },
  { slug: 'candy-I',           title: 'Candy I',           category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas. Bold candy-stripe geometry, cut and loop pile.',                                                                image: `${BLOB}/tufting/candy-I.jpg`,           gallery: g('tufting/candy-I', 5) },
  { slug: 'orange-sun',        title: 'Orange Sun',        category: 'tufting', year: '2021', description: 'Wool tufting on canvas. The sun as repeated motif — this one in warm terracotta orange.',                                                   image: `${BLOB}/tufting/orange-sun.jpg`,        gallery: g('tufting/orange-sun', 4) },
  { slug: 'rainbow-I',         title: 'Rainbow I',         category: 'tufting', year: '2021', description: 'Hand-tufted wool, multi-colour arc. Loop pile on cotton canvas backing.',                                                                    image: `${BLOB}/tufting/rainbow-I.jpg`,         gallery: g('tufting/rainbow-I', 4) },
  { slug: 'birds',             title: 'Birds',             category: 'tufting', year: '2021', description: 'Wool tufting on canvas. Bird silhouettes in flight — stylised, graphic, mid-migration.',                                                     image: `${BLOB}/tufting/birds.jpg`,             gallery: g('tufting/birds', 5) },
  { slug: 'du-und',            title: 'Du und',            category: 'tufting', year: '2021', description: 'Hand-tufted wool, text-based work. "Du und" — you and — in German. The sentence left deliberately incomplete.',                              image: `${BLOB}/tufting/du-und.jpg`,            gallery: g('tufting/du-und', 5) },
  { slug: 'hej',               title: 'Hej',               category: 'tufting', year: '2021', description: 'Wool tufting on canvas. A single Danish greeting — Hej — held in pile.',                                                                    image: `${BLOB}/tufting/hej.jpg`,               gallery: g('tufting/hej', 5) },
  { slug: 'liebes-panopticon', title: 'Liebes Panopticon', category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas. Title references Foucault\'s structure of surveillance — rendered in warm domestic wool.',                       image: `${BLOB}/tufting/liebes-panopticon.jpg`, gallery: g('tufting/liebes-panopticon', 5) },
  { slug: 'floral-thing',      title: 'Floral Thing',      category: 'tufting', year: '2021', description: 'Wool tufting on canvas. An abstracted botanical form — organic and slightly strange.',                                     dimensions: '34×22 cm', image: `${BLOB}/tufting/floral-thing.jpg`,      gallery: g('tufting/floral-thing', 5) },
  { slug: 'round-earth',       title: 'Round Earth',       category: 'tufting', year: '2021', description: 'Hand-tufted wool, circular form on rectangular canvas. The earth as simple fact.',                                         dimensions: '41×41 cm', image: `${BLOB}/tufting/round-earth.jpg`,       gallery: g('tufting/round-earth', 4) },
  { slug: 'fleur-de-lys',      title: 'Fleur de Lys',      category: 'tufting', year: '2021', description: 'Wool tufting on canvas. The heraldic lily motif, translated into textile pile.',                                                             image: `${BLOB}/tufting/fleur-de-lys.jpg` },
  { slug: 'jellyfish',         title: 'Jellyfish',         category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas. Soft looping forms suggest a jellyfish mid-drift.',                                           dimensions: '56×24 cm', image: `${BLOB}/tufting/jellyfish.jpg`,         gallery: g('tufting/jellyfish', 5) },
  { slug: 'rainbow-II',        title: 'Rainbow II',        category: 'tufting', year: '2021', description: 'Wool tufting on canvas. Second in the rainbow series — denser palette, shifted arch.',                                                       image: `${BLOB}/tufting/rainbow-II.jpg`,        gallery: g('tufting/rainbow-II', 5) },
  { slug: 'tufted-mask',       title: 'Tufted Mask',       category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas. A mask form in textile — somewhere between ritual object and wall piece.',                    dimensions: '39×21 cm', image: `${BLOB}/tufting/tufted-mask.jpg`,       gallery: g('tufting/tufted-mask', 5), sold: true },
  { slug: 'sitspot-large',     title: 'Sitspot Large',     category: 'tufting', year: '2021', description: 'Wool tufting on canvas. Functional in origin, fine art in execution. The large version.',                                 dimensions: '74×44 cm', image: `${BLOB}/tufting/sitspot-large.jpg`,     gallery: g('tufting/sitspot-large', 6) },
  { slug: 'universe-hole',     title: 'Universe with a Hole', category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas. A circle with a void at its centre — absence as compositional element.',                                    image: `${BLOB}/tufting/universe-hole.jpg`,     gallery: g('tufting/universe-hole', 7) },
  { slug: 'green-flower',      title: 'Green Flower',      category: 'tufting', year: '2021', description: 'Wool tufting on canvas. A single botanical form in deep green — simple and precise.',                                                        image: `${BLOB}/tufting/green-flower.jpg`,      gallery: g('tufting/green-flower', 1) },
  { slug: 'pink-rug',          title: 'Pink Rug',          category: 'tufting', year: '2020', description: 'Hand-tufted wool, floor piece. Designed to be walked on — which makes it no less art.',                                                      image: `${BLOB}/tufting/pink-rug.jpg`,          gallery: g('tufting/pink-rug', 5), sold: true },
  { slug: 'bedroom-rug',       title: 'Bedroom Rug',       category: 'tufting', year: '2020', description: 'Wool tufting, floor piece. Made for a specific room — the domestic as subject and site.',                                                    image: `${BLOB}/tufting/bedroom-rug.jpg`,       gallery: g('tufting/bedroom-rug', 5) },
  // Embroidery
  { slug: 'fuck-alting',         title: 'Fuck Alting',            category: 'embroidery', year: '2020', description: 'Hand embroidery on canvas. "Fuck everything" in Danish — direct, undecorated, exactly right.',                                         image: `${BLOB}/embroidery/fuck-alting.jpg`,         gallery: g('embroidery/fuck-alting', 5) },
  { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud',    category: 'embroidery', year: '2019', description: 'Hand embroidery on fabric. "God has cancelled." One of the earliest text works.',                                                       image: `${BLOB}/embroidery/gud-har-meldt-afbud.jpg`, gallery: g('embroidery/gud-har-meldt-afbud', 4) },
  { slug: 'elsk',                title: 'Elsk',                   category: 'embroidery', year: '2021', description: 'Hand embroidery on fabric. The Danish word for love, stitched and nothing more.',                                                        image: `${BLOB}/embroidery/elsk.jpg`,                gallery: g('embroidery/elsk', 5) },
  { slug: 'be-a-dragon',         title: 'Be a Dragon',            category: 'embroidery', year: '2021', description: 'Hand embroidery on canvas. Instruction as image — the command that is also an invitation.',                                              image: `${BLOB}/embroidery/be-a-dragon.jpg`,         gallery: g('embroidery/be-a-dragon', 3) },
  { slug: 'theres-nothing-here', title: "There's Nothing Here",   category: 'embroidery', year: '2020', description: 'Hand embroidery on fabric. A refusal, or a description. The text questions whether anything is present.',                               image: `${BLOB}/embroidery/theres-nothing-here.jpg`, gallery: g('embroidery/theres-nothing-here', 1) },
  { slug: 'mariann',             title: 'Mariann',                category: 'embroidery', year: '2020', description: 'Hand embroidery on fabric. A name stitched as portrait — presence through naming.',                                                      image: `${BLOB}/embroidery/mariann.jpg`,             gallery: g('embroidery/mariann', 5) },
  { slug: 'doodles',             title: 'Doodles',                category: 'embroidery', year: '2021', description: 'Freehand embroidery on fabric. Lines and marks that follow their own logic.',                                                            image: `${BLOB}/embroidery/doodles.jpg`,             gallery: g('embroidery/doodles', 5) },
  { slug: 'collage-bw',          title: 'Collage (Black & White)', category: 'embroidery', year: '2021', description: 'Hand embroidery on fabric, monochrome. Collage thinking translated into thread.', dimensions: '100×70 cm',                              image: `${BLOB}/embroidery/collage-bw.jpg`,          gallery: g('embroidery/collage-bw', 5) },
  { slug: 'apple-scraps',        title: 'Apple Scraps',           category: 'embroidery', year: '2020', description: 'Hand embroidery on fabric. Domestic remnants — the leftover, the overlooked.',                                                          image: `${BLOB}/embroidery/apple-scraps.jpg`,        gallery: g('embroidery/apple-scraps', 2) },
  { slug: 'perfidt-perfekt',     title: 'Perfidt Perfekt',        category: 'embroidery', year: '2021', description: 'Hand embroidery on canvas. "Perfectly perfidious" in Danish — a contradiction held in thread.',                                         image: `${BLOB}/embroidery/perfidt-perfekt.jpg`,     gallery: g('embroidery/perfidt-perfekt', 1) },
  { slug: 'ingenting',           title: 'Ingenting',              category: 'embroidery', year: '2020', description: 'Hand embroidery on fabric. "Nothing" in Danish — the word for absence, made material.',                                                  image: `${BLOB}/embroidery/ingenting.jpg`,           gallery: g('embroidery/ingenting', 4) },
  // Paintings
  { slug: 'universe-1',          title: 'Universe I',          category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. The first in an ongoing series exploring scale and boundlessness.',                                        image: `${BLOB}/painting/universe-1.jpg`,          gallery: g('painting/universe-1', 5) },
  { slug: 'universe-2',          title: 'Universe II',         category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. Second in the Universe series — a different attempt at the same question.',                                image: `${BLOB}/painting/universe-2.jpg`,          gallery: g('painting/universe-2', 5) },
  { slug: 'universe-3',          title: 'Universe III',        category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. Third iteration — darker palette, more marks scraped back.',                                              image: `${BLOB}/painting/universe-3.jpg`,          gallery: g('painting/universe-3', 5) },
  { slug: 'blue-branch',         title: 'Blue Branch',         category: 'painting', year: '2021', description: 'Acrylic on canvas. A branch in cadmium blue — the organic form given an unexpected temperature.',                                          image: `${BLOB}/painting/blue-branch.jpg`,         gallery: g('painting/blue-branch', 5) },
  { slug: 'person-walking',      title: 'Person Walking',      category: 'painting', year: '2021', description: 'Acrylic on canvas. A figure mid-step — movement held in paint, caught between one moment and the next.',                                   image: `${BLOB}/painting/person-walking.jpg`,      gallery: g('painting/person-walking', 5) },
  { slug: 'green-on-blue',       title: 'Green on Blue',       category: 'painting', year: '2021', description: 'Acrylic on canvas. Colour field study — green laid over blue, each colour changing in contact with the other.',                            image: `${BLOB}/painting/green-on-blue.jpg` },
  { slug: 'colour-study',        title: 'Colour Study',        category: 'painting', year: '2020', description: 'Acrylic on canvas. A working study in colour relationships — not a sketch, a finished inquiry.',                                           image: `${BLOB}/painting/colour-study.jpg`,        gallery: g('painting/colour-study', 2) },
  { slug: 'universe-collection', title: 'Universe Collection', category: 'painting', year: '2021', description: 'Acrylic and oil stick on canvas. A group of Universe works presented as a single study.',                                                  image: `${BLOB}/painting/universe-collection.jpg`, gallery: g('painting/universe-collection', 5) },
  { slug: 'colour-study-blue',   title: 'Colour Study Blue',   category: 'painting', year: '2021', description: 'Acrylic on canvas. Blue as subject — the study focused entirely on a single hue\'s range.',                                               image: `${BLOB}/painting/colour-study-blue.jpg`,   gallery: g('painting/colour-study-blue', 1) },
  { slug: 'sri-lanka-masks',     title: 'Sri Lanka Masks',     category: 'painting', year: '2020', description: 'Acrylic and mixed media on canvas. Based on ceremonial masks from Sri Lanka — colour amplified from source.',                              image: `${BLOB}/painting/sri-lanka-masks.jpg`,     gallery: g('painting/sri-lanka-masks', 5) },
  // Photography
  { slug: 'view-from-the-studio',      title: 'View from the Studio',      category: 'photography', year: '2021', description: 'Archival inkjet print. The studio window — what is seen from inside the practice.',                      image: `${BLOB}/photography/view-from-the-studio.jpg`,      gallery: g('photography/view-from-the-studio', 1) },
  { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood', category: 'photography', year: '2021', description: 'Archival inkjet print. Still life: a single flower against weathered wood. Colour as the subject.',     image: `${BLOB}/photography/blue-flower-on-green-wood.jpg` },
  { slug: 'red-and-green-moss',        title: 'Red and Green Moss',        category: 'photography', year: '2021', description: 'Archival inkjet print. Close-up of moss — two colours meeting at a fine edge.',                         image: `${BLOB}/photography/red-and-green-moss.jpg` },
  { slug: 'no-ordinary-stone',         title: 'No Ordinary Stone',         category: 'photography', year: '2021', description: 'Archival inkjet print. A stone examined at close range — the extraordinary in an ordinary object.',      image: `${BLOB}/photography/no-ordinary-stone.jpg` },
  { slug: 'taped-objects',             title: 'Taped Objects',             category: 'photography', year: '2021', description: 'Archival inkjet print. Domestic objects held with tape — the makeshift as composition.',                 image: `${BLOB}/photography/taped-objects.jpg` },
  { slug: 'flowers-on-linen',          title: 'Flowers on Linen',          category: 'photography', year: '2021', description: 'Archival inkjet print. Flowers placed on linen cloth — the textile as ground.',                         image: `${BLOB}/photography/flowers-on-linen.jpg` },
  { slug: 'polaroids',                 title: 'Polaroids',                 category: 'photography', year: '2021', description: 'Archival inkjet print. A photograph of photographs — the medium looking at itself.',                     image: `${BLOB}/photography/polaroids.jpg` },
  { slug: 'on-the-light-table',        title: 'On the Light Table',        category: 'photography', year: '2021', description: 'Archival inkjet print. Objects on a light table — transparency, backlight, shadow.',                   image: `${BLOB}/photography/on-the-light-table.jpg` },
  { slug: 'dead-flowers',              title: 'Dead Flowers',              category: 'photography', year: '2021', description: 'Archival inkjet print. Dried flowers close up — beauty in the aftermath of bloom.',                     image: `${BLOB}/photography/dead-flowers.jpg` },
  { slug: 'vase-on-stool',             title: 'Vase on Stool',             category: 'photography', year: '2021', description: 'Archival inkjet print. Still life: a single vase on a stool. The classic arrangement, precisely seen.', image: `${BLOB}/photography/vase-on-stool.jpg` },
  { slug: 'purple-flower',             title: 'Purple Flower',             category: 'photography', year: '2021', description: 'Archival inkjet print. A single purple flower — colour and form, nothing else needed.',                 image: `${BLOB}/photography/purple-flower.jpg` },
];

const BLOB_WORKS = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

export const blogPosts: BlogPost[] = [
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
    image: `${BLOB_WORKS}/tufting/bedroom-rug.jpg`,
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
    image: `${BLOB_WORKS}/tufting/bedroom-rug.jpg`,
    body: [
      "I made my first floor piece in 2020. A pink rug. I made it because I wanted to see what tufting felt like at larger scale, under foot. The result surprised me — not because of the technical execution but because of what happened when I put it in a room. It changed the room. Not decoratively. Structurally.",
      "There's a long argument in art about whether something that serves a function can be art. I don't find that argument interesting. The Bedroom Rug is on the floor. People stand on it. It's also a work I made with intention and care and a clear set of formal decisions about colour and pile height and edge treatment. Why would 'floor' disqualify it?",
      "The domestic is a subject I keep returning to, partly because it's where most of life happens and partly because it's been systematically undervalued as a subject — especially in work made by women. When I put an artwork on the floor, I'm not lowering it. I'm asking what the floor might be.",
      "Both floor pieces I've made have sold. I don't know if people bought them as rugs or as art. I hope the distinction blurred.",
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
