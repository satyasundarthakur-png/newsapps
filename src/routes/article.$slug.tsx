import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArticle, formatDate } from "@/data/articles";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Story not found — The Meridian" }, { name: "robots", content: "noindex" }],
      };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — The Meridian` },
        { name: "description", content: article.dek },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.dek },
        { property: "og:type", content: "article" },
        { property: "og:image", content: article.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: article.image },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-destructive">{article.category}</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight font-bold tracking-tight">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.dek}</p>
        <p className="mt-4 border-y border-border py-3 text-xs text-muted-foreground">
          By {article.author} · {formatDate(article.date)} · {article.readMinutes} min read
        </p>
        <img
          src={article.image}
          alt={article.title}
          className="mt-6 aspect-[16/9] w-full rounded-sm object-cover"
        />
        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {article.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <Link to="/" className="mt-10 inline-block text-sm underline underline-offset-4">
          ← Back to front page
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
