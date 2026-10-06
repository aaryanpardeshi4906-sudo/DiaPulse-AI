export default function SecurityPage() {
  const items = [
    'Secure authentication using Supabase Auth and role-based access controls.',
    'Row Level Security protects each user profile and personal health record.',
    'Protected health data is separated from public-facing dashboards and application state.',
    'Access is restricted to authenticated sessions and session-backed user contexts.',
  ]

  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Privacy & Security</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Secure, private health access</h2>
      </div>

      <div className="dp-card p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
