import { Link } from "@tanstack/react-router";
import { categories } from "@/data/articles";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            The Meridian
          </Link>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Independent daily
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
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
        © {new Date().getFullYear()} The Meridian. Reporting from wherever the story is.
      </div>
    </footer>
  );
}
