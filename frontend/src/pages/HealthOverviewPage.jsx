import { useMemo } from 'react'
import { ArrowUpRight, HeartPulse, Waves } from 'lucide-react'

const cards = [
  { label: 'Glucose stability', value: '92%', delta: '+3.4%', tone: 'blue' },
  { label: 'Sleep quality', value: '81%', delta: '+1.1h', tone: 'cyan' },
  { label: 'Activity', value: '73%', delta: '+12%', tone: 'emerald' },
  { label: 'Weight trend', value: '88%', delta: '-0.3kg', tone: 'amber' },
]

export default function HealthOverviewPage() {
  const keyMetrics = useMemo(
    () => [
      { label: 'Current glucose', value: '98 mg/dL', subtitle: 'Stable range' },
      { label: 'Average sleep', value: '7.6 hrs', subtitle: 'Rested' },
      { label: 'Weekly movement', value: '184 min', subtitle: 'Above target' },
      { label: 'Weight', value: '72.4 kg', subtitle: 'Steady' },
    ],
    []
  )

  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Health overview</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Your daily care summary</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, delta, tone }) => (
          <div key={label} className="dp-card dp-card-hover p-5">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-black text-slate-900">{value}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                <ArrowUpRight className="h-3 w-3" /> {delta}
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${
                  tone === 'blue'
                    ? 'bg-blue-500'
                    : tone === 'cyan'
                      ? 'bg-cyan-500'
                      : tone === 'emerald'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                }`}
                style={{ width: value }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="dp-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Summary highlights</h3>
              <p className="mt-1 text-xs text-slate-400">Current snapshot</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {keyMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{metric.value}</p>
                <p className="mt-1 text-xs text-slate-500">{metric.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dp-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Care note</h3>
              <p className="mt-1 text-xs text-slate-400">Guidance only</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Your recent activity and sleep patterns suggest a supportive routine. Continue monitoring glucose changes after meals and maintain your current movement cadence for steady daily habits.
          </div>
        </div>
      </div>
    </div>
  )
}
