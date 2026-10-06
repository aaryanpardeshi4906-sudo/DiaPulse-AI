export function LoadingState({ title = 'Loading your health data', description = 'Refreshing your wellness summary…' }) {
  return (
    <div className="dp-card p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-7 w-56 rounded bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>
      </div>
      <div className="mt-5 text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-1 text-sm text-slate-400">{description}</div>
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message = 'Please try again in a moment.' }) {
  return (
    <div className="dp-card border border-rose-200 bg-rose-50/60 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-500">Attention needed</p>
      <h3 className="mt-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
    </div>
  )
}

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="dp-card flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <div className="text-2xl font-semibold">•</div>
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="dp-button mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
