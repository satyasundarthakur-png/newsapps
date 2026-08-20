import { Link } from "@tanstack/react-router";
import { SOURCES, GROUP_LABELS, type SourceGroup } from "@/data/sources";

const GROUP_ORDER: SourceGroup[] = ["odia", "national", "international"];

export function SiteHeader({ activeSource }: { activeSource?: string }) {
  return (
    <header className="relative min-h-[220px] overflow-visible border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Thin rainbow accent stripe echoing the site's chart palette */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, #9F1D35 0%, #D9432A 20%, #E8A93B 40%, #2E8B57 60%, #0E7C86 80%, #7C3AED 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 pt-5">
        <div className="flex items-center justify-between gap-4 pb-4">
          <Link
            to="/"
            className="text-rainbow font-serif text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            ମେରିଡିଆନ୍ ଖବର
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="max-w-[14rem] text-right text-xs leading-odia tracking-wide text-muted-foreground">
              ଓଡ଼ିଶା, ଜାତୀୟ ଓ ଆନ୍ତର୍ଜାତୀୟ ଖବର ଏକାଠି
            </span>
            <div
              className="earth-doodle"
              style={{ ["--earth-size" as string]: "3.5rem" }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Sticky section navigation: stays pinned under the browser chrome
          while scrolling, so switching feeds never means scrolling back to
          the top. The big centered tabs are a real filter — ସବୁ shows every
          source, each group tab aggregates every source in that group
          (fetched and merged server-side, same as ସବୁ but scoped) — not
          just a label. The active tab also lights up when a specific
          publisher within that group is selected below, so picking "OTV"
          keeps you visually anchored under "ଓଡ଼ିଶା". */}
      <div className="sticky top-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3">
          <nav className="section-tabs">
            <Link
              to="/"
              search={{ source: "all" }}
              className={!activeSource || activeSource === "all" ? "active" : undefined}
            >
              ସବୁ
            </Link>
            {GROUP_ORDER.map((group) => {
              const sourceInGroup = SOURCES.find((s) => s.id === activeSource)?.group === group;
              return (
                <Link
                  key={group}
                  to="/"
                  search={{ source: group }}
                  className={activeSource === group || sourceInGroup ? "active" : undefined}
                >
                  {GROUP_LABELS[group]}
                </Link>
              );
            })}
          </nav>

          {/* Individual-publisher refinement rows, unchanged from before —
              still the way to pick one specific source rather than a whole
              group. Horizontally scrollable on mobile so this doesn't push
              the sticky bar's height past a comfortable size. */}
          {GROUP_ORDER.map((group) => (
            <div
              key={group}
              className="scrollbar-thin flex items-center gap-x-1.5 gap-y-1 overflow-x-auto pb-0.5 sm:flex-wrap sm:overflow-visible"
            >
              <span className="mr-1 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                {GROUP_LABELS[group]}
              </span>
              {SOURCES.filter((s) => s.group === group).map((s) => (
                <Link
                  key={s.id}
                  to="/"
                  search={{ source: s.id }}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    activeSource === s.id
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={activeSource === s.id ? { backgroundColor: s.accent } : undefined}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-visible border-t border-border">
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, #0E7C86 0%, #2E8B57 20%, #E8A93B 40%, #D9432A 60%, #9F1D35 80%, #7C3AED 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Palette: every source's own accent color as a clickable dot —
            a quick "jump straight to this publisher by color" shortcut
            that also doubles as a colorful little legend of everything
            the site pulls from. comingSoon sources (DailyHunt) still show
            their dot so the palette stays visually complete, but dimmed
            and non-clickable rather than linking to an empty page. */}
        <nav aria-label="ଉତ୍ସ ପାଇଁ ରଙ୍ଗ ପାଠା" className="mb-6 flex flex-wrap items-center">
          {SOURCES.map((s) =>
            s.comingSoon ? (
              <span
                key={s.id}
                className="palette is-coming-soon"
                style={{ backgroundColor: s.accent }}
                title={`${s.name} — ଶୀଘ୍ର ଆସୁଛି`}
                aria-hidden="true"
              />
            ) : (
              <Link
                key={s.id}
                to="/"
                search={{ source: s.id }}
                className="palette"
                style={{ backgroundColor: s.accent }}
                title={s.name}
                aria-label={s.name}
              />
            ),
          )}
        </nav>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ମେରିଡିଆନ୍ ଖବର। ପ୍ରତ୍ୟେକ ଖବରର ସାରାଂଶ ମାତ୍ର ଏଠାରେ ଦେଖାଯାଏ — ଏହା
          OTV, ସମ୍ବାଦ, ଧରିତ୍ରୀ, ସମାଜ, ପ୍ରମେୟ, କଳିଙ୍ଗ ଟିଭି, Times of India, Hindustan Times, Indian
          Express, BBC, Al Jazeera ଓ MSN/Bing News ଠାରୁ ସଂଗୃହିତ। ପୂର୍ଣ୍ଣ ଖବର ପାଇଁ ମୂଳ ଉତ୍ସକୁ
          ଯାଆନ୍ତୁ।
        </div>
      </div>
    </footer>
  );
}
