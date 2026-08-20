// Shown via the route's pendingComponent while a source switch is loading
// (the initial page load is already server-rendered with real data, so this
// only appears on client-side navigation between tabs — TanStack Router
// only mounts it if the loader takes longer than pendingMs, so a fast
// same-cache switch never flashes it).

function ShimmerBlock({ className = "" }: { className?: string }) {
  return <div className={`shimmer-block rounded-sm bg-muted ${className}`} aria-hidden="true" />;
}

function NewsCardSkeleton({ size = "normal" }: { size?: "lead" | "normal" }) {
  const isLead = size === "lead";
  return (
    <div className="rounded-md border border-border p-3">
      <ShimmerBlock
        className={
          isLead ? "aspect-[16/9] max-h-[420px] w-full" : "aspect-[4/3] max-h-[280px] w-full"
        }
      />
      <div className="mt-3 flex items-center gap-2">
        <ShimmerBlock className="h-4 w-16 rounded-full" />
        <ShimmerBlock className="h-3 w-12 rounded-full" />
      </div>
      <ShimmerBlock className={`mt-2 ${isLead ? "h-9 w-4/5" : "h-5 w-full"}`} />
      {isLead && <ShimmerBlock className="mt-2 h-9 w-3/5" />}
      <div className="mt-2 space-y-1.5">
        <ShimmerBlock className="h-3 w-full" />
        <ShimmerBlock className="h-3 w-11/12" />
        <ShimmerBlock className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function NewsGridSkeleton() {
  return (
    <div>
      <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.4fr_1fr]">
        <NewsCardSkeleton size="lead" />
        <div className="flex flex-col gap-5">
          <NewsCardSkeleton />
          <NewsCardSkeleton />
        </div>
      </section>
      <section className="pt-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
