export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`card p-5 animate-pulse ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-surface-hover" />
        <div className="flex-1">
          <div className="h-3.5 bg-surface-hover rounded w-24 mb-2" />
          <div className="h-2.5 bg-surface-hover rounded w-16" />
        </div>
      </div>
      <div className="h-2 bg-surface-hover rounded w-full mb-2" />
      <div className="h-1.5 bg-surface-hover rounded w-full" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between animate-pulse">
        <div>
          <div className="h-8 bg-surface-hover rounded w-40 mb-2" />
          <div className="h-3 bg-surface-hover rounded w-56" />
        </div>
        <div className="h-8 bg-surface-hover rounded w-16" />
      </div>
      <div className="card p-6 animate-pulse">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-surface-hover" />
          <div className="flex-1">
            <div className="h-6 bg-surface-hover rounded w-32 mb-2" />
            <div className="h-3 bg-surface-hover rounded w-48 mb-4" />
            <div className="h-1.5 bg-surface-hover rounded w-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonProgress() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-surface-hover rounded w-32 mb-2" />
        <div className="h-3 bg-surface-hover rounded w-64" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 text-center">
            <div className="w-4 h-4 bg-surface-hover rounded mx-auto mb-2" />
            <div className="h-6 bg-surface-hover rounded w-12 mx-auto mb-1" />
            <div className="h-2.5 bg-surface-hover rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
