import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getNews } from "@/server-fns/news";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { NewsCard } from "@/components/news-card";
import { StatusCard } from "@/components/status-card";
import { NewsGridSkeleton } from "@/components/loading";
import type { SourceId } from "@/data/sources";

const title = "ମେରିଡିଆନ୍ ଖବର — ଏକ ସ୍ଥାନରେ ସବୁ ଓଡ଼ିଆ ଖବର";
const description = "OTV, ସମ୍ବାଦ, ଧରିତ୍ରୀ, ସମାଜ, ପ୍ରମେୟ ଓ କଳିଙ୍ଗ ଟିଭିଙ୍କ ଲାଇଭ୍ ଖବର ଏକାଠି।";

const searchSchema = z.object({
  source: z.string().optional().default("all"),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ source: search.source }),
  loader: async ({ deps }) => {
    const result = await getNews({ data: deps.source as SourceId | "all" });
    return result;
  },
  // Skeleton cards only show up on a client-side tab switch that's taking a
  // moment (e.g. a source with a slow feed) — pendingMs delays it slightly
  // so a fast, already-warm switch doesn't flash a skeleton for one frame.
  pendingMs: 200,
  pendingMinMs: 300,
  pendingComponent: () => (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <NewsGridSkeleton />
      </main>
      <SiteFooter />
    </div>
  ),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { articles, failedSources, comingSoon } = Route.useLoaderData();
  const { source } = Route.useSearch();

  const [lead, ...rest] = articles;
  const secondary = rest.slice(0, 2);
  const remaining = rest.slice(2);

  return (
    <div className="relative min-h-screen">
      <SiteHeader activeSource={source} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="sr-only">ମେରିଡିଆନ୍ ଖବର — ଆଜିର ମୁଖ୍ୟ ଶିରୋନାମା</h1>

        {comingSoon ? (
          <div className="py-16">
            <StatusCard
              badge="ଶୀଘ୍ର ଆସୁଛି"
              title="DailyHunt ର ଲାଇଭ୍ ଖବର ଏଠାରେ ଶୀଘ୍ର ଯୋଡ଼ାଯିବ।"
              detail="DailyHuntର ଆଧିକାରିକ Content Syndication API ପାର୍ଟନର୍‌ଶିପ୍ ମାଧ୍ୟମରେ ଉପଲବ୍ଧ — ଅନୁମୋଦନ ପରେ ଏହି ଉତ୍ସର ଖବର ଏଠାରେ ଦେଖାଯିବ।"
              accent="#2BA84A"
            />
          </div>
        ) : (
          <>
            {failedSources.length > 0 && (
              <p className="mb-6 rounded-md bg-muted px-4 py-2 text-xs text-muted-foreground">
                {failedSources.join(", ")} ର ଖବର ବର୍ତ୍ତମାନ ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ। ଅନ୍ୟ ଉତ୍ସର ଖବର
                ଦେଖାଯାଉଛି।
              </p>
            )}

            {articles.length === 0 && source === "dailyhunt" && (
              <div className="py-16">
                <StatusCard
                  badge="ଅନଧିକୃତ ଉତ୍ସ ବର୍ତ୍ତମାନ ଉପଲବ୍ଧ ନାହିଁ"
                  title="DailyHuntର ଅଫିସିଆଲ୍ ଫିଡ୍ ପାର୍ଟନର୍-ଓନଲି, ତେଣୁ ଏଠାରେ ଏକ ଅନଧିକୃତ (community jugad) JSON ଉତ୍ସରୁ ଚେଷ୍ଟା କରାଯାଉଛି — ଆଜି ଏହା ଉତ୍ତର ଦେଉନାହିଁ।"
                  detail="ଏହା ଏକ ଅନାଧିକୃତ, ରକ୍ଷଣାବେକ୍ଷଣ-ବିହୀନ ପ୍ରକଳ୍ପ ଉପରେ ନିର୍ଭରଶୀଳ ବୋଲି ଯେକୌଣସି ସମୟରେ ଏହା ବନ୍ଦ ହୋଇପାରେ। ସ୍ଥାୟୀ ସମାଧାନ ପାଇଁ DailyHuntର Content Syndication API ପାର୍ଟନର୍‌ଶିପ୍ ପାଇଁ ଆବେଦନ କରାଯାଇପାରେ।"
                  accent="#2BA84A"
                />
              </div>
            )}

            {articles.length === 0 && source !== "dailyhunt" && (
              <div className="py-16">
                <StatusCard
                  badge="ଅନୁପଲବ୍ଧ"
                  title="ବର୍ତ୍ତମାନ କୌଣସି ଖବର ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ।"
                  detail="ଦୟାକରି ପରେ ଚେଷ୍ଟା କରନ୍ତୁ, କିମ୍ବା ଅନ୍ୟ ଏକ ଉତ୍ସ ବାଛନ୍ତୁ।"
                  accent="#6B7280"
                />
              </div>
            )}

            {lead && (
              <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.4fr_1fr]">
                <NewsCard article={lead} size="lead" />
                <div className="flex flex-col divide-y divide-border border-t border-border lg:border-t-0 lg:border-l lg:pl-8">
                  {secondary.map((a) => (
                    <div key={a.id} className="py-5 first:pt-0 lg:first:pt-0">
                      <NewsCard article={a} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {remaining.length > 0 && (
              <section className="pt-10">
                <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  ଅନ୍ୟ ଖବର
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {remaining.map((a) => (
                    <NewsCard key={a.id} article={a} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
