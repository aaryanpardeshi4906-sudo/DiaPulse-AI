const summaryItems = [
  { label: 'Senior overview', value: 'Stable routine', tone: 'blue' },
  { label: 'Recent health data', value: '6 records', tone: 'cyan' },
  { label: 'Potential patterns', value: '2 flagged', tone: 'amber' },
  { label: 'Attention items', value: '1 review', tone: 'rose' },
]

export default function CaregiverPage() {
  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Caregiver</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Senior overview dashboard</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="dp-card p-5">
            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
            <p className="mt-4 text-2xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="dp-card p-6">
          <h3 className="text-xl font-bold text-slate-900">Recent activity</h3>
          <div className="mt-5 space-y-3">
            {['Medication taken on time', 'Sleep target met for 5 of 7 nights', 'Light activity logged after meals'].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        <div className="dp-card p-6">
          <h3 className="text-xl font-bold text-slate-900">Attention items</h3>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
            Review the late-evening glucose pattern and encourage a short walk routine after dinner when possible.
          </div>
        </div>
      </div>
    </div>
  )
}
