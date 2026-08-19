import { createServerFn } from "@tanstack/react-start";
import { fetchAllNews, fetchSourceNews } from "@/lib/rss.server";
import type { SourceId } from "@/data/sources";

export const getNews = createServerFn({ method: "GET" })
  .validator((sourceId: SourceId | "all") => sourceId)
  .handler(async ({ data: sourceId }) => {
    if (sourceId === "all") return fetchAllNews();
    const articles = await fetchSourceNews(sourceId);
    return { articles, failedSources: articles.length === 0 ? [sourceId] : [] };
  });
