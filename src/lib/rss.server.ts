import { XMLParser } from "fast-xml-parser";
import { SOURCES, type NewsSource, type SourceId } from "@/data/sources";

export interface FeedArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  image: string | null;
  imageDirect: string | null;
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
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

// Picks the longest usable plain-text excerpt across the fields a feed might
// populate, then trims to a whole-word boundary near maxLen so cards get a
// real summary instead of just a headline + photo.
function bestSummary(
  fields: Array<string | undefined>,
  title: string,
  maxLen = 260,
): string {
  const candidates = fields
    .map((f) => stripHtml(f))
    .filter((t) => t.length > 0 && t.toLowerCase() !== title.toLowerCase())
    .sort((a, b) => b.length - a.length);

  const text = candidates[0] ?? "";
  if (text.length <= maxLen) return text;

  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen)}…`;
}

function absolutizeImageUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("http://")) return `https://${trimmed.slice(7)}`;
  if (trimmed.startsWith("https://")) return trimmed;
  return null; // relative paths aren't usable without knowing the site root
}

// Jugad: route every image through wsrv.nl (formerly images.weserv.nl), a
// free image cache/proxy widely used by RSS-aggregator projects for exactly
// this problem. Most Indian news CDNs (and many WordPress sites) reject
// direct hotlinking based on the Referer header, and some still serve over
// plain http which browsers block as mixed content on an https deploy.
// Routing through wsrv.nl sidesteps both: it fetches server-side with its
// own referrer, always re-serves over https, and caches on Cloudflare so
// repeat views are fast. &n=-1 disables their "not found" placeholder so a
// failed fetch surfaces as a normal <img> error we can catch client-side.
function proxyImage(url: string): string {
  const stripped = url.replace(/^https?:\/\//, "");
  return `https://wsrv.nl/?url=${encodeURIComponent(stripped)}&w=800&q=80&output=webp&n=-1`;
}

// Handles the handful of shapes publishers actually use: MRSS media:content
// (possibly an array or nested in media:group), media:thumbnail, RSS
// <enclosure>, the classic NewsAPI-style <image><url>, and — the most common
// case for WordPress-based Odia sites — an <img> tag buried inside
// content:encoded or description with no dedicated image field at all.
function findImage(item: Record<string, unknown>): string | null {
  const asFirst = (v: unknown): Record<string, unknown> | undefined =>
    Array.isArray(v) ? (v[0] as Record<string, unknown>) : (v as Record<string, unknown> | undefined);

  const media = asFirst(item["media:content"]);
  if (media?.["@_url"]) {
    const url = absolutizeImageUrl(String(media["@_url"]));
    if (url) return url;
  }

  const mediaGroup = asFirst(item["media:group"]);
  const groupedMedia = mediaGroup ? asFirst(mediaGroup["media:content"]) : undefined;
  if (groupedMedia?.["@_url"]) {
    const url = absolutizeImageUrl(String(groupedMedia["@_url"]));
    if (url) return url;
  }

  const thumb = asFirst(item["media:thumbnail"]);
  if (thumb?.["@_url"]) {
    const url = absolutizeImageUrl(String(thumb["@_url"]));
    if (url) return url;
  }

  const enclosure = asFirst(item["enclosure"]);
  if (enclosure?.["@_url"]) {
    const type = String(enclosure["@_type"] ?? "");
    if (!type || type.startsWith("image/") || type === "") {
      const url = absolutizeImageUrl(String(enclosure["@_url"]));
      if (url) return url;
    }
  }

  const imageTag = item["image"] as Record<string, unknown> | string | undefined;
  if (imageTag && typeof imageTag === "object" && imageTag["url"]) {
    const url = absolutizeImageUrl(String(imageTag["url"]));
    if (url) return url;
  } else if (typeof imageTag === "string") {
    const url = absolutizeImageUrl(imageTag);
    if (url) return url;
  }

  const desc = String(item["content:encoded"] ?? item["description"] ?? "");
  const match = /<img[^>]+src=["']([^"'>]+)["']/i.exec(desc);
  if (match) {
    const url = absolutizeImageUrl(match[1]!);
    if (url) return url;
  }

  return null;
}

function parseDate(raw: unknown): string {
  if (!raw) return new Date(0).toISOString();
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

// Jugad #2: several Odia publishers (Sambad, Dharitri, Samaja, Kalinga TV —
// several on custom CMSes, not just WordPress) can come back imageless from
// their RSS feed — no media:content, no enclosure, no <img> in the
// description. But the article page itself almost always sets an og:image
// meta tag for WhatsApp/Facebook link previews, since that's how their own
// shared links get a thumbnail. So for any article that came back imageless
// from the feed, we do a lightweight fetch of the article page and scrape
// that meta tag instead.
async function fetchOgImage(articleUrl: string): Promise<string | null> {
  try {
    const res = await fetch(articleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    // og:image is almost always in <head>, which is early in the document —
    // read a capped amount of text so this stays cheap even on heavy pages.
    const reader = res.body?.getReader();
    let html = "";
    if (reader) {
      const decoder = new TextDecoder();
      while (html.length < 60_000) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
      }
      reader.cancel().catch(() => {});
    } else {
      html = await res.text();
    }

    const metaMatch =
      /<meta[^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i.exec(
        html,
      ) ??
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image(?::secure_url)?["']/i.exec(
        html,
      ) ??
      /<meta[^>]+(?:property|name)=["']twitter:image["'][^>]+content=["']([^"']+)["']/i.exec(html);

    if (!metaMatch) return null;
    return absolutizeImageUrl(metaMatch[1]!.replace(/&amp;/g, "&"));
  } catch {
    return null;
  }
}

// Jugad #3: for sites confirmed to run WordPress, the wp-json REST API is a
// more reliable way to get a featured image than scraping the HTML page —
// it's a plain JSON endpoint, so it's less likely to sit behind whatever
// anti-bot challenge protects the actual article page, and it's a single
// small request instead of parsing a full page. Looked up by slug, the last
// path segment of the article URL, which is how default WP permalinks work.
async function fetchWpFeaturedImage(articleUrl: string): Promise<string | null> {
  try {
    const url = new URL(articleUrl);
    const slug = url.pathname.replace(/\/+$/, "").split("/").pop();
    if (!slug) return null;
    const apiUrl = `${url.origin}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`;
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    const post = Array.isArray(data) ? (data[0] as Record<string, unknown> | undefined) : undefined;
    const embedded = post?.["_embedded"] as Record<string, unknown> | undefined;
    const media = embedded?.["wp:featuredmedia"] as Array<Record<string, unknown>> | undefined;
    const sourceUrl = media?.[0]?.["source_url"] as string | undefined;
    return sourceUrl ? absolutizeImageUrl(sourceUrl) : null;
  } catch {
    return null;
  }
}

// Runs the image backfill for imageless articles a few at a time, so a
// slow/dead publisher page can't stall the whole request. Capped to the
// most recent items only — backfilling all 15 would add too much latency
// for items further down the list that matter less anyway. Sources flagged
// noImages (Google News) are skipped entirely: their feed structurally has
// no thumbnails and their links are JS-only redirects, so any attempt here
// is a guaranteed-wasted request.
async function backfillMissingImages(articles: FeedArticle[], source: NewsSource): Promise<void> {
  if (source.noImages) return;
  const needsImage = articles.filter((a) => !a.image).slice(0, 8);
  const concurrency = 4;
  for (let i = 0; i < needsImage.length; i += concurrency) {
    const batch = needsImage.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (article) => {
        const found = source.wordpress
          ? (await fetchWpFeaturedImage(article.link)) ?? (await fetchOgImage(article.link))
          : await fetchOgImage(article.link);
        if (found) {
          article.imageDirect = found;
          article.image = proxyImage(found);
        }
      }),
    );
  }
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

      const articles = items.slice(0, 15).map((item, idx): FeedArticle => {
        const link =
          typeof item["link"] === "string"
            ? (item["link"] as string)
            : ((item["link"] as Record<string, unknown>)?.["@_href"] as string) ||
              String(item["link"] ?? source.homepage);
        const title = stripHtml(String(item["title"] ?? ""));
        const rawImage = source.noImages ? null : findImage(item);
        return {
          id: `${source.id}-${idx}-${link}`,
          title,
          summary: bestSummary(
            [
              item["description"] as string | undefined,
              item["content:encoded"] as string | undefined,
              item["summary"] as string | undefined,
            ],
            title,
          ),
          link,
          image: rawImage ? proxyImage(rawImage) : null,
          imageDirect: rawImage,
          pubDate: parseDate(item["pubDate"] ?? item["published"] ?? item["updated"]),
          sourceId: source.id,
          sourceName: source.name,
          sourceShort: source.shortName,
          accent: source.accent,
        };
      });

      // Only worth doing this for sources whose feed genuinely omits images
      // — if the feed already gives every item a photo, skip the extra
      // network round-trips entirely.
      if (articles.some((a) => !a.image)) {
        await backfillMissingImages(articles, source);
      }

      return articles;
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
  const failedSources = SOURCES.filter((_, i) => (results[i]?.length ?? 0) === 0).map(
    (s) => s.shortName,
  );
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
