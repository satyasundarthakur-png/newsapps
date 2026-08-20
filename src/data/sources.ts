export type SourceId =
  | "otv"
  | "sambad"
  | "dharitri"
  | "samaja"
  | "prameya"
  | "kalinga"
  | "toi"
  | "hindustantimes"
  | "indianexpress"
  | "bbc"
  | "aljazeera"
  | "msn"
  | "dailyhunt";

export type SourceGroup = "odia" | "national" | "international";

export interface NewsSource {
  id: SourceId;
  name: string; // display name (Odia for Odia sources, English for others)
  shortName: string;
  homepage: string;
  group: SourceGroup;
  // Candidate RSS paths tried in order at fetch time; first one that returns
  // a valid feed wins and gets cached. Publishers don't document a stable
  // RSS URL, so we probe rather than hardcode a guess that can silently rot.
  candidates: string[];
  accent: string; // tailwind-safe hex used for the source pill
  // Set for sites confirmed to run WordPress, so the image backfill can try
  // the structured wp-json REST API (more reliable than scraping HTML,
  // since it's less often behind anti-bot page challenges).
  wordpress?: boolean;
  // Set for sources with no live feed wired up yet. The tab renders with a
  // "soon" badge, is excluded from fetchAllNews entirely (no wasted
  // request, no false "unavailable" flag), and clicking it shows a plain
  // placeholder message instead of the generic empty/error state.
  comingSoon?: boolean;
}

export const GROUP_LABELS: Record<SourceGroup, string> = {
  odia: "ଓଡ଼ିଶା",
  national: "ଜାତୀୟ",
  international: "ଆନ୍ତର୍ଜାତୀୟ",
};

export const SOURCES: NewsSource[] = [
  {
    id: "otv",
    name: "ଓଟିଭି",
    shortName: "OTV",
    homepage: "https://odishatv.in",
    group: "odia",
    candidates: [
      "https://odishatv.in/rss.xml",
      "https://odishatv.in/feed",
      "https://odishatv.in/rss",
      "https://odishatv.in/odisha/feed",
    ],
    accent: "#ea580c",
  },
  {
    id: "sambad",
    name: "ସମ୍ବାଦ",
    shortName: "Sambad",
    homepage: "https://sambad.in",
    group: "odia",
    candidates: [
      "https://sambad.in/rss",
      "https://sambad.in/feed/",
      "https://sambadnewspaper.com/feed/",
    ],
    accent: "#9f1239",
  },
  {
    id: "dharitri",
    name: "ଧରିତ୍ରୀ",
    shortName: "Dharitri",
    homepage: "https://www.dharitri.com",
    group: "odia",
    candidates: [
      "https://www.dharitri.com/feed/",
      "https://www.dharitri.com/rss.xml",
      "https://dharitri.com/feed/",
    ],
    accent: "#166534",
    wordpress: true,
  },
  {
    id: "samaja",
    name: "ସମାଜ",
    shortName: "Samaja",
    homepage: "https://samajalive.in",
    group: "odia",
    candidates: [
      "https://samajalive.in/feed/",
      "https://www.samajalive.in/feed/",
      "https://samajalive.in/rss.xml",
    ],
    accent: "#7c3aed",
    wordpress: true,
  },
  {
    id: "prameya",
    name: "ପ୍ରମେୟ",
    shortName: "Prameya",
    homepage: "https://prameyanews.com",
    group: "odia",
    candidates: [
      "https://prameyanews.com/feed/",
      "https://www.prameyanews.com/feed/",
      "https://prameyanews.com/rss.xml",
    ],
    accent: "#1d4ed8",
  },
  {
    id: "kalinga",
    name: "କଳିଙ୍ଗ ଟିଭି",
    shortName: "Kalinga TV",
    homepage: "https://kalingatv.com",
    group: "odia",
    candidates: [
      "https://kalingatv.com/feed/",
      "https://www.kalingatv.com/feed/",
      "https://kalingatv.com/rss.xml",
    ],
    accent: "#0891b2",
    wordpress: true,
  },
  // National
  {
    id: "toi",
    name: "Times of India",
    shortName: "TOI",
    homepage: "https://timesofindia.indiatimes.com",
    group: "national",
    candidates: [
      "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms",
      "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    ],
    accent: "#b91c1c",
  },
  {
    id: "hindustantimes",
    name: "Hindustan Times",
    shortName: "HT",
    homepage: "https://www.hindustantimes.com",
    group: "national",
    candidates: [
      "https://www.hindustantimes.com/rss/latest-news/rssfeed.xml",
      "https://www.hindustantimes.com/rss/india-news/rssfeed.xml",
      "https://www.hindustantimes.com/feeds/rss/latest/rssfeed.xml",
      "http://feeds.hindustantimes.com/HT-India",
    ],
    accent: "#0f766e",
  },
  {
    id: "indianexpress",
    name: "Indian Express",
    shortName: "Indian Express",
    homepage: "https://indianexpress.com",
    group: "national",
    candidates: [
      "https://indianexpress.com/section/india/feed/",
      "https://indianexpress.com/feed/",
    ],
    accent: "#b45309",
  },
  // International
  {
    id: "bbc",
    name: "BBC",
    shortName: "BBC",
    homepage: "https://www.bbc.com/news",
    group: "international",
    candidates: [
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://feeds.bbci.co.uk/news/rss.xml",
    ],
    accent: "#b71c1c",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    shortName: "Al Jazeera",
    homepage: "https://www.aljazeera.com",
    group: "international",
    candidates: ["https://www.aljazeera.com/xml/rss/all.xml"],
    accent: "#92400e",
  },
  {
    id: "msn",
    name: "MSN / Bing News",
    shortName: "MSN",
    homepage: "https://www.msn.com",
    group: "international",
    // MSN itself has no public reader-facing RSS feed (it's a publisher
    // ingestion platform — sites submit feeds *to* MSN, not the other way
    // round). Bing News, also Microsoft, exposes a public search-RSS
    // endpoint that — unlike Google News — links directly to the real
    // publisher article and includes thumbnail images.
    candidates: [
      "https://www.bing.com/news/search?q=India&format=rss&setmkt=en-IN",
      "https://www.bing.com/news/search?q=India&format=RSS",
      "https://www.bing.com/news/search?q=top+news&format=rss",
    ],
    accent: "#008373",
  },
  {
    id: "dailyhunt",
    name: "DailyHunt",
    shortName: "DailyHunt",
    homepage: "https://dailyhunt.in",
    group: "international",
    // DailyHunt's Content Syndication API is partner-only (API key, secret
    // key, and partner code issued after onboarding — no public/self-serve
    // feed), so there's nothing to fetch yet. Left as an empty candidate
    // list on purpose; fetchAllNews skips comingSoon sources entirely
    // rather than probing URLs that don't exist.
    candidates: [],
    accent: "#2BA84A",
    comingSoon: true,
  },
];
