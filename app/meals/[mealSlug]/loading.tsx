export default function Loading() {
  return (
    <div className="container-page pt-14" aria-busy="true" aria-label="Loading recipe">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-[2rem] bg-surface-2" />
        <div className="space-y-4 self-center">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-surface-2" />
          <div className="h-5 w-full animate-pulse rounded bg-surface-2" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
