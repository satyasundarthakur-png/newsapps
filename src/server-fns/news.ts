import { createServerFn } from "@tanstack/react-start";
import { fetchAllNews, fetchSourceNews } from "@/lib/rss.server";
import { SOURCES, type SourceId } from "@/data/sources";

export const getNews = createServerFn({ method: "GET" })
  .validator((sourceId: SourceId | "all") => sourceId)
  .handler(async ({ data: sourceId }) => {
    if (sourceId === "all") {
      const result = await fetchAllNews();
      return { ...result, comingSoon: false };
    }
    const source = SOURCES.find((s) => s.id === sourceId);
    if (source?.comingSoon) {
      return { articles: [], failedSources: [], comingSoon: true };
    }
    const articles = await fetchSourceNews(sourceId);
    return { articles, failedSources: articles.length === 0 ? [sourceId] : [], comingSoon: false };
  });
