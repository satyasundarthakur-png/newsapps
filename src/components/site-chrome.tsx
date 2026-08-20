import { Link } from "@tanstack/react-router";
import { SOURCES, GROUP_LABELS, type SourceGroup } from "@/data/sources";
import { GlobeDoodle } from "@/components/globe-doodle";

const GROUP_ORDER: SourceGroup[] = ["odia", "national", "international"];

export function SiteHeader({ activeSource }: { activeSource?: string }) {
  return (
    <header className="relative overflow-hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Thin rainbow accent stripe echoing the site's chart palette */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, #9F1D35 0%, #D9432A 20%, #E8A93B 40%, #2E8B57 60%, #0E7C86 80%, #7C3AED 100%)",
        }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-rainbow font-serif text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            ମେରିଡିଆନ୍ ଖବର
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="max-w-[14rem] text-right text-xs leading-snug tracking-wide text-muted-foreground">
              ଓଡ଼ିଶା, ଜାତୀୟ ଓ ଆନ୍ତର୍ଜାତୀୟ ଖବର ଏକାଠି
            </span>
            <GlobeDoodle className="h-14 w-14 shrink-0 text-muted-foreground/70" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <Link
            to="/"
            search={{ source: "all" }}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              !activeSource || activeSource === "all"
                ? "bg-primary text-primary-foreground"
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
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  activeSource === s.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={activeSource === s.id ? { backgroundColor: s.accent } : undefined}
              >
                {s.name}
                {s.jugadJson && (
                  <span
                    title="ଅନଧିକୃତ (unofficial) API — ଯେକୌଣସି ସମୟରେ ବନ୍ଦ ହୋଇପାରେ"
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: activeSource === s.id ? "rgba(255,255,255,0.25)" : s.accent,
                      color: "white",
                    }}
                  >
                    ଅନଧିକୃତ
                  </span>
                )}
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
    <footer className="relative mt-16 overflow-hidden border-t border-border">
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, #0E7C86 0%, #2E8B57 20%, #E8A93B 40%, #D9432A 60%, #9F1D35 80%, #7C3AED 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ମେରିଡିଆନ୍ ଖବର। ପ୍ରତ୍ୟେକ ଖବରର ସାରାଂଶ ମାତ୍ର ଏଠାରେ ଦେଖାଯାଏ — ଏହା
        OTV, ସମ୍ବାଦ, ଧରିତ୍ରୀ, ସମାଜ, ପ୍ରମେୟ, କଳିଙ୍ଗ ଟିଭି, Times of India, Hindustan Times, Indian
        Express, BBC, Al Jazeera ଓ MSN/Bing News ଠାରୁ ସଂଗୃହିତ। ପୂର୍ଣ୍ଣ ଖବର ପାଇଁ ମୂଳ ଉତ୍ସକୁ ଯାଆନ୍ତୁ।
      </div>
    </footer>
  );
}
