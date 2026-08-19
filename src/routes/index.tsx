import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, formatDate } from "@/data/articles";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const title = "The Meridian — Independent daily news";
const description =
  "Clear, unhurried reporting on world affairs, business, technology, science and culture.";

export const Route = createFileRoute("/")({
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
  const [lead, ...rest] = articles;
  const secondary = rest.slice(0, 2);
  const remaining = rest.slice(2);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="sr-only">The Meridian — today's headlines</h1>

        {lead && (
          <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.4fr_1fr]">
            <Link to="/article/$slug" params={{ slug: lead.slug }} className="group block">
              <img
                src={lead.image}
                alt={lead.title}
                loading="eager"
                className="aspect-[16/9] w-full rounded-sm object-cover"
              />
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-destructive">
                {lead.category}
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight font-bold tracking-tight group-hover:underline sm:text-4xl">
                {lead.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">{lead.dek}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {lead.author} · {formatDate(lead.date)} · {lead.readMinutes} min read
              </p>
            </Link>

            <div className="flex flex-col divide-y divide-border border-t border-border lg:border-t-0 lg:border-l lg:pl-8">
              {secondary.map((a) => (
                <Link
                  key={a.slug}
                  to="/article/$slug"
                  params={{ slug: a.slug }}
                  className="group block py-5 first:pt-0 lg:first:pt-0"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {a.category}
                  </p>
                  <h3 className="mt-2 font-serif text-xl leading-snug font-semibold group-hover:underline">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{a.dek}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="pt-10">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            More stories
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {remaining.map((a) => (
              <Link
                key={a.slug}
                to="/article/$slug"
                params={{ slug: a.slug }}
                className="group block"
              >
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-sm object-cover"
                />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {a.category}
                </p>
                <h3 className="mt-1 font-serif text-lg leading-snug font-semibold group-hover:underline">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.dek}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
