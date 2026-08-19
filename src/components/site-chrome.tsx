import { Link } from "@tanstack/react-router";
import { categories } from "@/data/articles";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            ମେରିଡିଆନ୍ ଖବର
          </Link>
          <span className="hidden text-xs tracking-wide text-muted-foreground sm:block">
            ସ୍ୱାଧୀନ ଓଡ଼ିଆ ଦୈନିକ
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            ମୁଖ୍ୟ ପୃଷ୍ଠା
          </Link>
          {categories.map((c) => (
            <span key={c} className="text-muted-foreground/70">
              {c}
            </span>
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
        © {new Date().getFullYear()} ମେରିଡିଆନ୍ ଖବର। ସତ୍ୟ ଓ ସ୍ପଷ୍ଟ ରିପୋର୍ଟିଂ।
      </div>
    </footer>
  );
}
