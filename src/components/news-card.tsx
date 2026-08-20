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

  // Every image, from every newspaper, is forced through this same sized
  // proxy — no "try the publisher's own image first" shortcut. That
  // shortcut was the reason images looked inconsistently sized across
  // sources: feed-native images loaded at whatever resolution/aspect the
  // publisher's own CDN happened to serve, only falling back to a
  // standard size on error. Routing everything through wsrv.nl up front
  // means every card of a given slot (lead/normal) always downloads and
  // displays the exact same pixel dimensions, regardless of source.
  const sizedProxy = article.imageDirect
    ? wsrvUrl(article.imageDirect, slot.w, slot.h)
    : article.image;
  const [failed, setFailed] = useState(false);
  const src = !failed ? sizedProxy : null;
  const showImage = Boolean(src);

  const handleError = () => setFailed(true);

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
