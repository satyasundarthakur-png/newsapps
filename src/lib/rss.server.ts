import { XMLParser } from "fast-xml-parser";
import { SOURCES, type NewsSource, type SourceId } from "@/data/sources";

export interface FeedArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  image: string | null;
  pubDate: string; // ISO string, best-effort
  sourceId: SourceId;
  sourceName: string;
  sourceShort: string;
  accent: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

// Per-server-instance cache of the working feed URL for each source, so we
// don't re-probe every candidate on every request.
const resolvedFeedUrl = new Map<SourceId, string>();

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function findImage(item: Record<string, unknown>): string | null {
  const media = item["media:content"] as Record<string, unknown> | undefined;
  if (media?.["@_url"]) return String(media["@_url"]);
  const thumb = item["media:thumbnail"] as Record<string, unknown> | undefined;
  if (thumb?.["@_url"]) return String(thumb["@_url"]);
  const enclosure = item.enclosure as Record<string, unknown> | undefined;
  if (enclosure?.["@_url"]) return String(enclosure["@_url"]);
  const desc = String(item["content:encoded"] ?? item.description ?? "");
  const match = /<img[^>]+src="([^">]+)"/.exec(desc);
  return match ? match[1] : null;
}

function parseDate(raw: unknown): string {
  if (!raw) return new Date(0).toISOString();
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

async function tryFetchFeed(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OdiaNewsApp/1.0; +https://lovable.app)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.includes("<item") && !text.includes("<entry")) return null;
    return text;
  } catch {
    return null;
  }
}

async function fetchSourceArticles(source: NewsSource): Promise<FeedArticle[]> {
  const cached = resolvedFeedUrl.get(source.id);
  const candidates = cached ? [cached, ...source.candidates] : source.candidates;

  for (const url of candidates) {
    const xml = await tryFetchFeed(url);
    if (!xml) continue;

    try {
      const data = parser.parse(xml);
      const rawItems: Record<string, unknown>[] =
        data?.rss?.channel?.item ?? data?.feed?.entry ?? [];
      const items = Array.isArray(rawItems) ? rawItems : [rawItems];
      if (items.length === 0) continue;

      resolvedFeedUrl.set(source.id, url);

      return items.slice(0, 15).map((item, idx): FeedArticle => {
        const link =
          typeof item.link === "string"
            ? item.link
            : ((item.link as Record<string, unknown>)?.["@_href"] as string) ||
              String(item.link ?? source.homepage);
        return {
          id: `${source.id}-${idx}-${link}`,
          title: stripHtml(String(item.title ?? "")),
          summary: stripHtml(
            String(item.description ?? item["content:encoded"] ?? item.summary ?? ""),
          ).slice(0, 200),
          link,
          image: findImage(item),
          pubDate: parseDate(item.pubDate ?? item.published ?? item.updated),
          sourceId: source.id,
          sourceName: source.name,
          sourceShort: source.shortName,
          accent: source.accent,
        };
      });
    } catch {
      continue;
    }
  }

  return [];
}

export async function fetchAllNews(): Promise<{
  articles: FeedArticle[];
  failedSources: string[];
}> {
  const results = await Promise.all(SOURCES.map((s) => fetchSourceArticles(s)));
  const failedSources = SOURCES.filter((_, i) => results[i].length === 0).map((s) => s.shortName);
  const articles = results
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return { articles, failedSources };
}

export async function fetchSourceNews(sourceId: SourceId): Promise<FeedArticle[]> {
  const source = SOURCES.find((s) => s.id === sourceId);
  if (!source) return [];
  return fetchSourceArticles(source);
}
