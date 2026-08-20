// Shared by both the server (rss.server.ts, for a sane default) and the
// client (news-card.tsx, to request the exact size each slot needs).
// Centralizing this avoids the "some images are huge, some are tiny"
// inconsistency that comes from different call sites picking their own w/h.
export function wsrvUrl(directUrl: string, width: number, height: number): string {
  const stripped = directUrl.replace(/^https?:\/\//, "");
  const params = new URLSearchParams({
    url: stripped,
    w: String(width),
    h: String(height),
    fit: "cover",
    a: "attention", // smart-crop toward the visually interesting region
    output: "webp",
    q: "78",
    n: "-1", // disable wsrv's own "not found" placeholder image
  });
  return `https://wsrv.nl/?${params.toString()}`;
}

// Fixed slot sizes so every card of a given kind requests (and therefore
// downloads) the same dimensions — no more lead images inheriting whatever
// oversized original the source happened to publish.
export const IMAGE_SLOTS = {
  lead: { w: 900, h: 506 }, // 16:9
  normal: { w: 480, h: 360 }, // 4:3
} as const;
