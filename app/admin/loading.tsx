export default function AdminLoading() {
  return (
    <div className="min-h-screen px-4 py-10 max-w-[70rem] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="h-9 w-52 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-10 w-28 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6 border-b border-black/10 dark:border-white/10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-28 bg-gray-200 dark:bg-slate-700 rounded-t-lg animate-pulse"
          />
        ))}
      </div>
      <div className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-6 sm:p-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
