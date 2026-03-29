export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
    {/* Image placeholder */}
    <div className="skeleton h-48 w-full" />

    <div className="p-5 flex flex-col gap-3">
      {/* Tags */}
      <div className="flex gap-2">
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-18 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-5/6 rounded" />
        <div className="skeleton h-3.5 w-2/3 rounded" />
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-ink-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="space-y-1">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-2.5 w-16 rounded" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-3 w-8 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export const BlogDetailSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-6">
    {/* Tags */}
    <div className="flex gap-2">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
    {/* Title */}
    <div className="space-y-3">
      <div className="skeleton h-9 w-full rounded" />
      <div className="skeleton h-9 w-4/5 rounded" />
    </div>
    {/* Meta */}
    <div className="flex items-center gap-4">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="space-y-1.5">
        <div className="skeleton h-4 w-28 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
    {/* Cover image */}
    <div className="skeleton w-full h-72 rounded-2xl" />
    {/* Content lines */}
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className={`skeleton h-4 rounded ${i % 5 === 4 ? 'w-3/4' : 'w-full'}`} />
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
    {/* Hero */}
    <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
      <div className="skeleton w-24 h-24 rounded-2xl" />
      <div className="flex-1 space-y-3">
        <div className="skeleton h-7 w-40 rounded" />
        <div className="skeleton h-4 w-64 rounded" />
        <div className="flex gap-4 mt-2">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
    </div>
    {/* Blog grid */}
    <div className="grid sm:grid-cols-2 gap-5">
      {Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)}
    </div>
  </div>
);
