const patientOverview = [
  { label: 'Patient overview', value: 'Stable' },
  { label: 'Historical trends', value: 'Consistent' },
  { label: 'AI summaries', value: '2 alerts' },
  { label: 'Risk indicators', value: 'Low to moderate' },
]

export default function ClinicianPage() {
  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Clinician</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Patient monitoring overview</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {patientOverview.map((item) => (
          <div key={item.label} className="dp-card p-5">
            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
            <p className="mt-4 text-xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="dp-card p-6">
          <h3 className="text-xl font-bold text-slate-900">Potential patterns</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Potential pattern: glucose values trend higher on lower-activity days.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Trend observed: sleep quality appears supportive of daily stability.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Requires review: consistency after meals is a helpful follow-up signal.</div>
          </div>
        </div>

        <div className="dp-card p-6">
          <h3 className="text-xl font-bold text-slate-900">Recent records</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Glucose 102 mg/dL | Meal: oatmeal and berries</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Sleep 7.4 hours | Activity 31 minutes</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Weight 72.4 kg | Symptoms: mild afternoon fatigue</div>
          </div>
        </div>
      </div>
    </div>
  )
}
