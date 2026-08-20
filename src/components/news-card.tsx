import { useState } from "react";
import type { FeedArticle } from "@/lib/rss.server";
import { timeAgoOdia } from "@/lib/time-ago";
import { wsrvUrl, IMAGE_SLOTS } from "@/lib/image-proxy";

export function NewsCard({
  article,
  size = "normal",
}: {
  article: FeedArticle;
  size?: "lead" | "normal";
}) {
  const isLead = size === "lead";
  const slot = isLead ? IMAGE_SLOTS.lead : IMAGE_SLOTS.normal;

  // Sized, right-slot proxy variant — built here (not stored server-side)
  // so a lead card and a grid card showing the same article each request
  // exactly the pixels they'll display, instead of sharing one arbitrary
  // size. This is the fix for images being "not standardized, some real
  // big": every card of a given kind now downloads the same dimensions.
  const sizedProxy = article.imageDirect
    ? wsrvUrl(article.imageDirect, slot.w, slot.h)
    : article.image;

  // Backfilled images (og:image scrapes, WP featured images, microlink)
  // have unpredictable origin and size — some publishers use a single
  // multi-MB banner as their fallback og:image for every article — so
  // those always go through the sized proxy and skip the direct URL
  // entirely. Feed-native images (media:content, enclosure) are normally
  // already sized sanely by the publisher's own CDN, so trying them
  // directly first is a safe, faster default, falling back to the proxy
  // only if that fails.
  const tryDirectFirst = article.imageOrigin === "feed";
  const [stage, setStage] = useState<"direct" | "proxy" | "failed">(
    tryDirectFirst ? "direct" : "proxy",
  );
  const src = stage === "direct" ? article.imageDirect : stage === "proxy" ? sizedProxy : null;
  const showImage = Boolean(src);

  const handleError = () => {
    if (stage === "direct" && sizedProxy) setStage("proxy");
    else setStage("failed");
  };

  // Per-source tinted background: mixes each newspaper's accent color into
  // the theme's own background variable (not a flat white/black), so the
  // tint stays subtle and correct in both light and dark mode automatically.
  const cardBg = `color-mix(in oklch, ${article.accent} 7%, var(--color-background))`;
  const cardBgHover = `color-mix(in oklch, ${article.accent} 13%, var(--color-background))`;
  const cardBorder = `color-mix(in oklch, ${article.accent} 30%, transparent)`;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-md border p-3 transition-colors"
      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = cardBgHover)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = cardBg)}
    >
      {showImage ? (
        <img
          src={src!}
          alt={article.title}
          loading={isLead ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          className={`w-full rounded-sm object-cover ${isLead ? "aspect-[16/9] max-h-[420px]" : "aspect-[4/3] max-h-[280px]"}`}
          onError={handleError}
        />
      ) : (
        <div
          className={`flex w-full items-center justify-center rounded-sm bg-muted ${isLead ? "aspect-[16/9] max-h-[420px]" : "aspect-[4/3] max-h-[280px]"}`}
        >
          <span className="text-xs text-muted-foreground">{article.sourceShort}</span>
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: article.accent }}
        >
          {article.sourceName}
        </span>
        {article.pubDate && (
          <span className="text-[11px] text-muted-foreground">{timeAgoOdia(article.pubDate)}</span>
        )}
      </div>
      <h3
        className={`mt-1.5 font-serif leading-snug font-semibold group-hover:underline ${isLead ? "text-3xl sm:text-4xl" : "text-lg"}`}
      >
        {article.title}
      </h3>
      {article.summary && (
        <p
          className={`mt-2 text-muted-foreground ${isLead ? "max-w-2xl text-base" : "line-clamp-3 text-sm"}`}
        >
          {article.summary}
        </p>
      )}
      <span className="mt-2 inline-block text-[11px] font-medium text-muted-foreground/70 underline-offset-2 group-hover:underline">
        ମୂଳ ଖବର ପଢ଼ନ୍ତୁ →
      </span>
    </a>
  );
}
