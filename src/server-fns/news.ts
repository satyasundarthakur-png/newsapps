import { createServerFn } from "@tanstack/react-start";
import { fetchAllNews, fetchSourceNews } from "@/lib/rss.server";
import { SOURCES, type SourceId, type SourceGroup } from "@/data/sources";

const GROUPS: SourceGroup[] = ["odia", "national", "international"];

export const getNews = createServerFn({ method: "GET" })
  .validator((sourceId: SourceId | SourceGroup | "all") => sourceId)
  .handler(async ({ data: sourceId }) => {
    if (sourceId === "all") {
      const result = await fetchAllNews();
      return { ...result, comingSoon: false };
    }
    if ((GROUPS as string[]).includes(sourceId)) {
      const result = await fetchAllNews(sourceId as SourceGroup);
      return { ...result, comingSoon: false };
    }
    const source = SOURCES.find((s) => s.id === sourceId);
    if (source?.comingSoon) {
      return { articles: [], failedSources: [], comingSoon: true };
    }
    const articles = await fetchSourceNews(sourceId as SourceId);
    return { articles, failedSources: articles.length === 0 ? [sourceId] : [], comingSoon: false };
  });
