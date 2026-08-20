// A NewsCard-shaped placeholder for sources that have no live articles to
// show right now — either because the integration isn't live yet
// (comingSoon) or because a feed attempt failed. Kept as its own component
// rather than injecting a fake FeedArticle into real results: mixing a
// synthetic item into the sorted "all sources" grid would be misleading
// (it has no real pubDate, link, or content to stand alongside actual
// headlines), so this is only ever rendered in place of a source's own
// section, never mixed into the aggregate feed.
export function StatusCard({
  badge,
  title,
  detail,
  accent,
}: {
  badge: string;
  title: string;
  detail?: string;
  accent: string;
}) {
  const cardBg = `color-mix(in oklch, ${accent} 6%, var(--color-background))`;
  const cardBorder = `color-mix(in oklch, ${accent} 25%, transparent)`;

  return (
    <div
      className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-md border p-8 text-center"
      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
    >
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
        style={{ backgroundColor: accent }}
      >
        {badge}
      </span>
      <p className="font-serif text-lg leading-odia font-semibold text-foreground">{title}</p>
      {detail && (
        <p className="max-w-md text-sm leading-relaxed font-light text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  );
}
