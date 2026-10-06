export default function ProfilePage() {
  const profile = {
    name: 'Aaryan Patel',
    email: 'aaryan@example.com',
    role: 'Patient',
    accountType: 'Standard member',
    language: 'English',
    timezone: 'UTC-05:00',
  }

  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Profile</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Account information</h2>
      </div>

      <div className="dp-card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
