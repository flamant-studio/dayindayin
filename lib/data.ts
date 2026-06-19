export type WorkCategory = "tufting" | "embroidery" | "painting" | "photography";

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  year: string;
  description: string;
  image: string;
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

export const works: Work[] = [
  // Tufting
  { slug: 'purple-sun',        title: 'Purple Sun',        category: 'tufting',     year: '2019', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/purple-sun.jpg` },
  { slug: 'candy-I',           title: 'Candy I',           category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/candy-I.jpg` },
  { slug: 'orange-sun',        title: 'Orange Sun',        category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/orange-sun.jpg` },
  { slug: 'rainbow-I',         title: 'Rainbow I',         category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/rainbow-I.jpg` },
  { slug: 'birds',             title: 'Birds',             category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/birds.jpg` },
  { slug: 'du-und',            title: 'Du und',            category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/du-und.jpg` },
  { slug: 'hej',               title: 'Hej',               category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/hej.jpg` },
  { slug: 'liebes-panopticon', title: 'Liebes Panopticon', category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.',  image: `${BLOB}/tufting/liebes-panopticon.jpg` },
  { slug: 'floral-thing',    title: 'Floral Thing',          category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/floral-thing.jpg` },
  { slug: 'round-earth',     title: 'Round Earth',           category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/round-earth.jpg` },
  { slug: 'fleur-de-lys',    title: 'Fleur de Lys',          category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/fleur-de-lys.jpg` },
  { slug: 'jellyfish',       title: 'Jellyfish',             category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/jellyfish.jpg` },
  { slug: 'rainbow-II',      title: 'Rainbow II',            category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/rainbow-II.jpg` },
  { slug: 'tufted-mask',     title: 'Tufted Mask',           category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/tufted-mask.jpg` },
  { slug: 'sitspot-large',   title: 'Sitspot Large',         category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/sitspot-large.jpg` },
  { slug: 'universe-hole',   title: 'Universe with a Hole',  category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/universe-hole.jpg` },
  { slug: 'green-flower',    title: 'Green Flower',          category: 'tufting', year: '2021', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/green-flower.jpg` },
  { slug: 'pink-rug',        title: 'Pink Rug',              category: 'tufting', year: '2020', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/pink-rug.jpg` },
  { slug: 'bedroom-rug',     title: 'Bedroom Rug',           category: 'tufting', year: '2020', description: 'Hand-tufted wool on canvas.', image: `${BLOB}/tufting/bedroom-rug.jpg` },
  // Embroidery
  { slug: 'fuck-alting',         title: 'Fuck Alting',         category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/fuck-alting.jpg` },
  { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud', category: 'embroidery', year: '2019', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/gud-har-meldt-afbud.jpg` },
  { slug: 'elsk',                title: 'Elsk',                category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/elsk.jpg` },
  { slug: 'be-a-dragon',         title: 'Be a Dragon',         category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/be-a-dragon.jpg` },
  { slug: 'theres-nothing-here', title: "There's Nothing Here", category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/theres-nothing-here.jpg` },
  { slug: 'mariann',             title: 'Mariann',             category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/mariann.jpg` },
  { slug: 'doodles',         title: 'Doodles',                  category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/doodles.jpg` },
  { slug: 'collage-bw',      title: 'Collage (Black & White)',  category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/collage-bw.jpg` },
  { slug: 'apple-scraps',    title: 'Apple Scraps',             category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/apple-scraps.jpg` },
  { slug: 'perfidt-perfekt', title: 'Perfidt Perfekt',          category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/perfidt-perfekt.jpg` },
  { slug: 'ingenting',       title: 'Ingenting',                category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/ingenting.jpg` },
  // Paintings
  { slug: 'universe-1',    title: 'Universe I',   category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-1.jpg` },
  { slug: 'universe-2',    title: 'Universe II',  category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-2.jpg` },
  { slug: 'universe-3',    title: 'Universe III', category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-3.jpg` },
  { slug: 'blue-branch',   title: 'Blue Branch',  category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/blue-branch.jpg` },
  { slug: 'person-walking', title: 'Person Walking', category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/person-walking.jpg` },
  { slug: 'green-on-blue',       title: 'Green on Blue',       category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/green-on-blue.jpg` },
  { slug: 'colour-study',        title: 'Colour Study',        category: 'painting', year: '2020', description: 'Mixed media on canvas.', image: `${BLOB}/painting/colour-study.jpg` },
  { slug: 'universe-collection', title: 'Universe Collection', category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-collection.jpg` },
  { slug: 'colour-study-blue',   title: 'Colour Study Blue',   category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/colour-study-blue.jpg` },
  { slug: 'sri-lanka-masks',     title: 'Sri Lanka Masks',     category: 'painting', year: '2020', description: 'Mixed media on canvas.', image: `${BLOB}/painting/sri-lanka-masks.jpg` },
  // Photography
  { slug: 'view-from-the-studio',      title: 'View from the Studio',     category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/view-from-the-studio.jpg` },
  { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood', category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/blue-flower-on-green-wood.jpg` },
  { slug: 'red-and-green-moss',        title: 'Red and Green Moss',       category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/red-and-green-moss.jpg` },
  { slug: 'no-ordinary-stone',         title: 'No Ordinary Stone',        category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/no-ordinary-stone.jpg` },
  { slug: 'taped-objects',             title: 'Taped Objects',            category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/taped-objects.jpg` },
  { slug: 'flowers-on-linen',          title: 'Flowers on Linen',         category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/flowers-on-linen.jpg` },
  { slug: 'polaroids',          title: 'Polaroids',          category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/polaroids.jpg` },
  { slug: 'on-the-light-table', title: 'On the Light Table', category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/on-the-light-table.jpg` },
  { slug: 'dead-flowers',       title: 'Dead Flowers',       category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/dead-flowers.jpg` },
  { slug: 'vase-on-stool',      title: 'Vase on Stool',      category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/vase-on-stool.jpg` },
  { slug: 'purple-flower',      title: 'Purple Flower',      category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/purple-flower.jpg` },
];

const BLOB_WORKS = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

export const blogPosts: BlogPost[] = [
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
];

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug);
}

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getWorksByCategory(category: WorkCategory) {
  return works.filter((w) => w.category === category);
}
