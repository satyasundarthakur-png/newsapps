import { Link } from "@tanstack/react-router";
import { SOURCES } from "@/data/sources";

export function SiteHeader({ activeSource }: { activeSource?: string }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            ମେରିଡିଆନ୍ ଖବର
          </Link>
          <span className="hidden text-xs tracking-wide text-muted-foreground sm:block">
            ଏକ ସ୍ଥାନରେ ସବୁ ଓଡ଼ିଆ ଖବର
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-2 gap-y-2 text-sm font-medium">
          <Link
            to="/"
            search={{ source: "all" }}
            className={`rounded-full px-3 py-1 transition-colors ${
              !activeSource || activeSource === "all"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ସବୁ
          </Link>
          {SOURCES.map((s) => (
            <Link
              key={s.id}
              to="/"
              search={{ source: s.id }}
              className={`rounded-full px-3 py-1 transition-colors ${
                activeSource === s.id ? "text-white" : "text-muted-foreground hover:text-foreground"
              }`}
              style={activeSource === s.id ? { backgroundColor: s.accent } : undefined}
            >
              {s.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ମେରିଡିଆନ୍ ଖବର। OTV, ସମ୍ବାଦ, ଧରିତ୍ରୀ, ସମାଜ, ପ୍ରମେୟ ଓ କଳିଙ୍ଗ ଟିଭିଙ୍କ
        ସହିତ ଲିଙ୍କ୍ ହୋଇଥିବା ସୂଚନା। ଖବରର ପୂର୍ଣ୍ଣ ପାଠ ପାଇଁ ମୂଳ ଉତ୍ସକୁ ଯାଆନ୍ତୁ।
      </div>
    </footer>
  );
}
