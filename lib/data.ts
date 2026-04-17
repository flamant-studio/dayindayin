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

export const works: Work[] = [
  { slug: "purple-sun", title: "Purple Sun", category: "tufting", year: "2022", description: "Hand-tufted wool on canvas.", image: "/images/placeholder-tufting.jpg" },
  { slug: "orange-sun", title: "Orange Sun", category: "tufting", year: "2022", description: "Hand-tufted wool on canvas.", image: "/images/placeholder-tufting.jpg" },
  { slug: "candy-series-1", title: "Candy Series I", category: "tufting", year: "2021", description: "Hand-tufted wool on canvas.", image: "/images/placeholder-tufting.jpg" },
  { slug: "powerful-flowers", title: "Powerful Flowers", category: "embroidery", year: "2021", description: "Embroidery on fabric.", image: "/images/placeholder-embroidery.jpg" },
  { slug: "wir-schaffen-das", title: "Wir Schaffen Das", category: "embroidery", year: "2020", description: "Embroidery on fabric.", image: "/images/placeholder-embroidery.jpg" },
  { slug: "kosmos", title: "Kosmos", category: "painting", year: "2021", description: "Oil on canvas.", image: "/images/placeholder-painting.jpg" },
  { slug: "colour-burst", title: "Colour Burst", category: "painting", year: "2020", description: "Acrylic on canvas.", image: "/images/placeholder-painting.jpg" },
  { slug: "light-fisher", title: "Light Fisher (Lysfisker)", category: "photography", year: "2021", description: "Digital photography.", image: "/images/placeholder-lifestyle.jpg" },
  { slug: "you-and-i", title: "You and I and Everything Else", category: "photography", year: "2021", description: "Digital photography.", image: "/images/placeholder-lifestyle.jpg" },
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
