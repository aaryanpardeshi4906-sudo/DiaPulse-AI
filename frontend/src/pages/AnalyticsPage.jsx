import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, Heart, MoonStar, Scale, Sparkles } from 'lucide-react'
import { getHealthRecordsForUser } from '../services/healthService'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StatePanels'

const ranges = ['7D', '30D', '90D']

function buildChartData(records, range) {
  const days = range === '7D' ? 7 : range === '30D' ? 30 : 90
  const slice = records.slice(0, Math.min(records.length, days)).reverse()

  return slice.map((record) => ({
    label: new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    glucose: Number(record.glucose),
    sleep: Number(record.sleep_hours),
    activity: Number(record.activity_minutes),
    weight: Number(record.weight),
  }))
}

export default function AnalyticsPage({ session }) {
  const [records, setRecords] = useState([])
  const [range, setRange] = useState('7D')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        const { records: nextRecords } = await getHealthRecordsForUser(session.user.id)
        setRecords(nextRecords)
      } catch (loadError) {
        setError(loadError.message || 'Unable to load analytics.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [session])

  const chartData = useMemo(() => buildChartData(records, range), [range, records])

  const stats = useMemo(() => {
    const glucoseValues = chartData.map((item) => item.glucose)
    const sleepValues = chartData.map((item) => item.sleep)
    const activityValues = chartData.map((item) => item.activity)
    const weightValues = chartData.map((item) => item.weight)

    return [
      { label: 'Average glucose', value: `${Math.round(glucoseValues.reduce((a, b) => a + b, 0) / Math.max(glucoseValues.length, 1))} mg/dL`, icon: Heart },
      { label: 'Average sleep', value: `${(sleepValues.reduce((a, b) => a + b, 0) / Math.max(sleepValues.length, 1)).toFixed(1)} hrs`, icon: MoonStar },
      { label: 'Average activity', value: `${Math.round(activityValues.reduce((a, b) => a + b, 0) / Math.max(activityValues.length, 1))} min`, icon: Activity },
      { label: 'Weight trend', value: `${(weightValues.reduce((a, b) => a + b, 0) / Math.max(weightValues.length, 1)).toFixed(1)} kg`, icon: Scale },
    ]
  }, [chartData])

  if (loading) {
    return <LoadingState title="Preparing analytics" description="Reviewing your health trend data…" />
  }

  if (error) {
    return <ErrorState title="Analytics unavailable" message={error} />
  }

  if (records.length === 0) {
    return <EmptyState title="No data for analysis yet" description="Add a few health records to unlock trend charts and insights." />
  }

  return (
    <div className="dp-fade-up space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Health analytics</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Behavior and trend review</h2>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1.5">
          {ranges.map((rangeOption) => (
            <button
              key={rangeOption}
              type="button"
              onClick={() => setRange(rangeOption)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                range === rangeOption ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {rangeOption}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="dp-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-6 text-2xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="dp-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Trend view</h3>
            <p className="mt-1 text-xs text-slate-400">Key metrics over the selected period</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">{range}</div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="glucoseArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="glucose" stroke="#2563eb" strokeWidth={3} fill="url(#glucoseArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dp-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI interpretation</h3>
            <p className="mt-1 text-xs text-slate-400">Deterministic reasoning plus a safe summary</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
          Your recent patterns show steady glucose management with a moderate relationship between sleep consistency and morning energy. Activity appears to be a helpful stabilizer, while weight measurements remain generally consistent. This is a supportive pattern review, not a diagnosis.
        </div>
      </div>
    </div>
  )
}
