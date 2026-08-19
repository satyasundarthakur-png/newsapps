export type SourceId = "otv" | "sambad" | "dharitri" | "samaja" | "prameya" | "kalinga";

export interface NewsSource {
  id: SourceId;
  name: string; // Odia display name
  shortName: string;
  homepage: string;
  // Candidate RSS paths tried in order at fetch time; first one that returns
  // a valid feed wins and gets cached. Publishers don't document a stable
  // RSS URL, so we probe rather than hardcode a guess that can silently rot.
  candidates: string[];
  accent: string; // tailwind-safe hex used for the source pill
}

export const SOURCES: NewsSource[] = [
  {
    id: "otv",
    name: "ଓଟିଭି",
    shortName: "OTV",
    homepage: "https://odishatv.in",
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
    candidates: [
      "https://sambad.in/feed/",
      "https://sambadnewspaper.com/feed/",
      "https://sambad.in/rss.xml",
    ],
    accent: "#9f1239",
  },
  {
    id: "dharitri",
    name: "ଧରିତ୍ରୀ",
    shortName: "Dharitri",
    homepage: "https://www.dharitri.com",
    candidates: [
      "https://www.dharitri.com/feed/",
      "https://www.dharitri.com/rss.xml",
      "https://dharitri.com/feed/",
    ],
    accent: "#166534",
  },
  {
    id: "samaja",
    name: "ସମାଜ",
    shortName: "Samaja",
    homepage: "https://samajalive.in",
    candidates: [
      "https://samajalive.in/feed/",
      "https://www.samajalive.in/feed/",
      "https://samajalive.in/rss.xml",
    ],
    accent: "#7c3aed",
  },
  {
    id: "prameya",
    name: "ପ୍ରମେୟ",
    shortName: "Prameya",
    homepage: "https://prameyanews.com",
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
    candidates: [
      "https://kalingatv.com/feed/",
      "https://www.kalingatv.com/feed/",
      "https://kalingatv.com/rss.xml",
    ],
    accent: "#0891b2",
  },
];

export const CATEGORIES = ["ସବୁ", "ଓଡ଼ିଶା", "ଜାତୀୟ", "କ୍ରୀଡ଼ା", "ମନୋରଞ୍ଜନ", "ବ୍ୟବସାୟ"] as const;
