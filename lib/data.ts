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
  // Embroidery
  { slug: 'fuck-alting',         title: 'Fuck Alting',         category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/fuck-alting.jpg` },
  { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud', category: 'embroidery', year: '2019', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/gud-har-meldt-afbud.jpg` },
  { slug: 'elsk',                title: 'Elsk',                category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/elsk.jpg` },
  { slug: 'be-a-dragon',         title: 'Be a Dragon',         category: 'embroidery', year: '2021', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/be-a-dragon.jpg` },
  { slug: 'theres-nothing-here', title: "There's Nothing Here", category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/theres-nothing-here.jpg` },
  { slug: 'mariann',             title: 'Mariann',             category: 'embroidery', year: '2020', description: 'Embroidery on fabric.', image: `${BLOB}/embroidery/mariann.jpg` },
  // Paintings
  { slug: 'universe-1',    title: 'Universe I',   category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-1.jpg` },
  { slug: 'universe-2',    title: 'Universe II',  category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-2.jpg` },
  { slug: 'universe-3',    title: 'Universe III', category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/universe-3.jpg` },
  { slug: 'blue-branch',   title: 'Blue Branch',  category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/blue-branch.jpg` },
  { slug: 'person-walking', title: 'Person Walking', category: 'painting', year: '2021', description: 'Mixed media on canvas.', image: `${BLOB}/painting/person-walking.jpg` },
  // Photography
  { slug: 'view-from-the-studio',      title: 'View from the Studio',     category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/view-from-the-studio.jpg` },
  { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood', category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/blue-flower-on-green-wood.jpg` },
  { slug: 'red-and-green-moss',        title: 'Red and Green Moss',       category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/red-and-green-moss.jpg` },
  { slug: 'no-ordinary-stone',         title: 'No Ordinary Stone',        category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/no-ordinary-stone.jpg` },
  { slug: 'taped-objects',             title: 'Taped Objects',            category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/taped-objects.jpg` },
  { slug: 'flowers-on-linen',          title: 'Flowers on Linen',         category: 'photography', year: '2021', description: 'Fine art photograph.', image: `${BLOB}/photography/flowers-on-linen.jpg` },
];

export const blogPosts: BlogPost[] = [
  { slug: "kaleidoscope-pattern-observation", title: "Kaleidoscope Pattern Observation", date: "2021-09-01", excerpt: "Observations on pattern, colour, and the infinite.", image: "/images/placeholder-work.jpg" },
  { slug: "dont-shoot-we-are-humans", title: "Don't Shoot We Are Humans", date: "2021-08-15", excerpt: "On humanity and the political dimension of art.", image: "/images/placeholder-work.jpg" },
  { slug: "working-title-modern-things", title: "Working Title Modern Things", date: "2021-07-20", excerpt: "Notes on working with modern materials and old techniques.", image: "/images/placeholder-work.jpg" },
  { slug: "most-leafy-plants-are-feminine", title: "Most Leafy Plants Are Feminine", date: "2021-07-01", excerpt: "A meditation on femininity, nature, and growth.", image: "/images/placeholder-work.jpg" },
  { slug: "the-fall", title: "The Fall", date: "2021-06-10", excerpt: "On endings, transitions, and new beginnings.", image: "/images/placeholder-work.jpg" },
  { slug: "fylgja", title: "Fylgja", date: "2021-05-20", excerpt: "Norse mythology and the spirit that follows.", image: "/images/placeholder-work.jpg" },
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
