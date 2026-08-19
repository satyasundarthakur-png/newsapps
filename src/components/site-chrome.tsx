import { Link } from "@tanstack/react-router";
import { SOURCES, GROUP_LABELS, type SourceGroup } from "@/data/sources";

const GROUP_ORDER: SourceGroup[] = ["odia", "national", "international"];

export function SiteHeader({ activeSource }: { activeSource?: string }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            ମେରିଡିଆନ୍ ଖବର
          </Link>
          <span className="hidden text-xs tracking-wide text-muted-foreground sm:block">
            ଓଡ଼ିଶା, ଜାତୀୟ ଓ ଆନ୍ତର୍ଜାତୀୟ ଖବର ଏକାଠି
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <Link
            to="/"
            search={{ source: "all" }}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              !activeSource || activeSource === "all"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ସବୁ
          </Link>
        </div>

        {GROUP_ORDER.map((group) => (
          <div key={group} className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
              {GROUP_LABELS[group]}
            </span>
            {SOURCES.filter((s) => s.group === group).map((s) => (
              <Link
                key={s.id}
                to="/"
                search={{ source: s.id }}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  activeSource === s.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
                style={activeSource === s.id ? { backgroundColor: s.accent } : undefined}
              >
                {s.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ମେରିଡିଆନ୍ ଖବର। ପ୍ରତ୍ୟେକ ଖବରର ସାରାଂଶ ମାତ୍ର ଏଠାରେ ଦେଖାଯାଏ — ଏହା
        OTV, ସମ୍ବାଦ, ଧରିତ୍ରୀ, ସମାଜ, ପ୍ରମେୟ, କଳିଙ୍ଗ ଟିଭି, Times of India, Hindustan Times, Indian
        Express, BBC, Al Jazeera ଓ Google News ଠାରୁ ସଂଗୃହିତ। ପୂର୍ଣ୍ଣ ଖବର ପାଇଁ ମୂଳ ଉତ୍ସକୁ ଯାଆନ୍ତୁ।
      </div>
    </footer>
  );
}
