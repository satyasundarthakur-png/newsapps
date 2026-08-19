export type Article = {
  slug: string;
  title: string;
  dek: string;
  body: string[];
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  image: string;
};

export const categories = ["World", "Business", "Technology", "Science", "Culture"] as const;

export const articles: Article[] = [
  {
    slug: "coastal-cities-rewrite-flood-playbook",
    title: "Coastal cities rewrite the flood playbook",
    dek: "Engineers are trading concrete seawalls for marshland, oyster reefs and streets designed to soak.",
    body: [
      "For decades the answer to rising water was to build higher. Now planners in a dozen port cities are betting on something softer: land that absorbs instead of deflects.",
      "The shift is partly economic. Restored wetlands cost a fraction of hardened barriers and keep working as sea levels climb, while concrete needs replacement within a generation.",
      "Early results are mixed but promising. In pilot districts, peak flood depth fell by nearly a third during last winter's storms, and residents reported far shorter road closures.",
    ],
    category: "Science",
    author: "Marta Ibarra",
    date: "2026-08-19",
    readMinutes: 6,
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=70",
  },
  {
    slug: "chip-makers-chase-smaller-factories",
    title: "Chip makers chase smaller, stranger factories",
    dek: "The next fabrication boom may be measured in modules, not megaplants.",
    body: [
      "After a half-decade of record capital spending, several manufacturers are quietly funding compact plants that can be assembled in under two years.",
      "The strategy trades scale for speed, letting suppliers place capacity near customers rather than in a handful of global hubs.",
      "Analysts caution that yields at smaller sites remain unproven, and the economics only work if demand for specialty chips holds.",
    ],
    category: "Business",
    author: "Devon Hale",
    date: "2026-08-18",
    readMinutes: 5,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "a-quiet-revolution-in-language-models",
    title: "A quiet revolution in small language models",
    dek: "Researchers are proving that tightly curated data can beat raw scale on narrow tasks.",
    body: [
      "The headline numbers still belong to the largest systems, but a growing body of work shows carefully filtered training sets closing the gap at a fraction of the cost.",
      "For teams running models on laptops and phones, that difference is decisive.",
      "The open question is generalization: models tuned for one domain still stumble the moment the task shifts.",
    ],
    category: "Technology",
    author: "Priya Raman",
    date: "2026-08-18",
    readMinutes: 4,
    image:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "the-long-road-back-to-the-night-train",
    title: "The long road back to the night train",
    dek: "Sleeper routes are returning across the continent, one carriage at a time.",
    body: [
      "Operators retired most overnight services two decades ago. Passenger demand, and a distaste for short-haul flights, has pulled them back.",
      "Rolling stock is the bottleneck: new sleeper cars take years to deliver, so most routes run refurbished fleets.",
      "Where services returned, occupancy has averaged above eighty percent on weekends.",
    ],
    category: "World",
    author: "Jonas Feld",
    date: "2026-08-17",
    readMinutes: 7,
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "museums-experiment-with-open-storage",
    title: "Museums experiment with open storage",
    dek: "Institutions are putting the other ninety percent of their collections on view.",
    body: [
      "Most museums display a sliver of what they hold. Glass-walled storage halls are changing that calculus.",
      "Curators describe the format as humbling: objects appear without narrative scaffolding, in dense rows.",
      "Visitor surveys suggest audiences stay longer, even without wall text to guide them.",
    ],
    category: "Culture",
    author: "Lena Osei",
    date: "2026-08-16",
    readMinutes: 5,
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "grid-operators-learn-to-love-batteries",
    title: "Grid operators learn to love batteries",
    dek: "Storage has moved from pilot project to the cheapest way to keep the lights on at dusk.",
    body: [
      "Battery installations passed a symbolic threshold this year, supplying more evening peak capacity than gas peakers in several regions.",
      "Operators say the change is as much software as hardware: forecasting tools now dispatch storage hours ahead.",
      "Supply chains remain the limiting factor, with cell deliveries booked well into next year.",
    ],
    category: "Business",
    author: "Ana Duarte",
    date: "2026-08-15",
    readMinutes: 4,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "mapping-the-deep-sea-in-high-resolution",
    title: "Mapping the deep sea in high resolution",
    dek: "A fleet of autonomous vessels has charted more seabed this year than the prior decade.",
    body: [
      "Uncrewed surface vessels can stay out for weeks, running survey lines that once required a full ship's crew.",
      "The resulting maps are already redrawing assumptions about undersea currents and cable routes.",
      "Scientists warn that coverage remains uneven, concentrated near shipping lanes and planned infrastructure.",
    ],
    category: "Science",
    author: "Tomas Reid",
    date: "2026-08-14",
    readMinutes: 6,
    image:
      "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1200&q=70",
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
