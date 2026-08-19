import type { FeedArticle } from "@/lib/rss.server";
import { timeAgoOdia } from "@/lib/time-ago";

export function NewsCard({ article, size = "normal" }: { article: FeedArticle; size?: "lead" | "normal" }) {
  const isLead = size === "lead";
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          loading={isLead ? "eager" : "lazy"}
          className={`w-full rounded-sm object-cover ${isLead ? "aspect-[16/9]" : "aspect-[4/3]"}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div
          className={`flex w-full items-center justify-center rounded-sm bg-muted ${isLead ? "aspect-[16/9]" : "aspect-[4/3]"}`}
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
        <p className={`mt-2 text-muted-foreground ${isLead ? "max-w-2xl text-base" : "line-clamp-2 text-sm"}`}>
          {article.summary}
        </p>
      )}
    </a>
  );
}
