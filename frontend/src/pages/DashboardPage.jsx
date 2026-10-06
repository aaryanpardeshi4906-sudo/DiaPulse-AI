import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Dumbbell,
  Heart,
  MoonStar,
  Scale,
  Sparkles,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { demoRecords } from '../lib/demoData'
import { getAiInsightsForUser, getHealthRecordsForUser, getRemindersForUser } from '../services/healthService'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StatePanels'

const SHARED_COLORS = {
  blue: '#2563eb',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  amber: '#f59e0b',
  slate: '#64748b',
}

function buildRangeData(records, days) {
  const slice = records.slice(0, Math.min(records.length, days)).reverse()

  return slice.map((record) => ({
    label: new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    glucose: Number(record.glucose),
    weight: Number(record.weight),
    sleep: Number(record.sleep_hours),
    activity: Number(record.activity_minutes),
  }))
}

function toMetricCard(title, value, unit, delta, status, Icon, accent, seriesData) {
  return {
    title,
    value,
    unit,
    delta,
    status,
    Icon,
    accent,
    seriesData,
  }
}

export default function DashboardPage({ session }) {
  const [records, setRecords] = useState([])
  const [insights, setInsights] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [recordResult, insightResult, reminderResult] = await Promise.all([
          getHealthRecordsForUser(session.user.id),
          getAiInsightsForUser(session.user.id),
          getRemindersForUser(session.user.id),
        ])

        setRecords(recordResult.records)
        setInsights(insightResult)
        setReminders(reminderResult)
      } catch (loadError) {
        setError(loadError.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [session])

  const todayRecords = useMemo(() => records || demoRecords, [records])
  const latest = todayRecords[0] || demoRecords[0]

  const chartData = useMemo(() => buildRangeData(todayRecords, 7), [todayRecords])

  const metrics = useMemo(() => {
    const currentGlucose = Number(latest?.glucose ?? 104)
    const currentSleep = Number(latest?.sleep_hours ?? 7.5)
    const currentActivity = Number(latest?.activity_minutes ?? 35)
    const currentWeight = Number(latest?.weight ?? 72.3)

    return [
      toMetricCard('Blood Glucose', currentGlucose, 'mg/dL', '+2.1%', 'Stable', Heart, SHARED_COLORS.blue, chartData.map((item) => item.glucose)),
      toMetricCard('Sleep', currentSleep, 'hours', '+0.6h', 'Rested', MoonStar, SHARED_COLORS.teal, chartData.map((item) => item.sleep)),
      toMetricCard('Activity', currentActivity, 'minutes', '+8%', 'Active', Dumbbell, SHARED_COLORS.cyan, chartData.map((item) => item.activity)),
      toMetricCard('Weight', currentWeight, 'kg', '-0.4kg', 'Steady', Scale, SHARED_COLORS.amber, chartData.map((item) => item.weight)),
    ]
  }, [chartData, latest])

  const wellnessScore = useMemo(() => {
    const avgSleep = chartData.reduce((sum, item) => sum + item.sleep, 0) / Math.max(chartData.length, 1)
    const avgActivity = chartData.reduce((sum, item) => sum + item.activity, 0) / Math.max(chartData.length, 1)
    const avgGlucose = chartData.reduce((sum, item) => sum + item.glucose, 0) / Math.max(chartData.length, 1)
    const avgWeight = chartData.reduce((sum, item) => sum + item.weight, 0) / Math.max(chartData.length, 1)

    const sleepScore = Math.max(0, Math.min(100, (avgSleep / 8) * 100))
    const activityScore = Math.max(0, Math.min(100, (avgActivity / 45) * 100))
    const glucoseScore = Math.max(0, Math.min(100, 100 - Math.abs(avgGlucose - 100) * 1.7))
    const weightScore = Math.max(0, Math.min(100, 100 - Math.abs(avgWeight - 72.5) * 2.1))

    return Math.round((sleepScore + activityScore + glucoseScore + weightScore) / 4)
  }, [chartData])

  const displayName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'there'
  const selectedInsight = insights[0] || {
    insight_type: 'Potential pattern detected',
    title: 'Your glucose values are consistent with a healthy range.',
    explanation: 'Your daily behavior suggests steady wellness habits and meaningful activity patterns.',
    recommendation: 'Keep your routine consistent and continue monitoring trends after meals and before sleep.',
    risk_level: 'Low',
  }

  if (loading) {
    return <LoadingState title="Loading your dashboard" description="Refreshing insight, trends, and reminders…" />
  }

  if (error) {
    return <ErrorState title="Dashboard unavailable" message={error} />
  }

  return (
    <div className="dp-fade-up space-y-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Today&apos;s overview</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Good morning, {displayName}
          </h2>
          <p className="mt-2 text-sm text-slate-500">Here&apos;s your health overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ title, value, unit, delta, status, Icon, accent, seriesData }) => (
          <div key={title} className="dp-card dp-card-hover p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                {status}
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">{title}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-black text-slate-950">{value}</span>
              <span className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-slate-400">{unit}</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" /> {delta}
              </span>
              <span>vs prior</span>
            </div>

            <div className="mt-4 h-11 rounded-xl bg-slate-50 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seriesData.map((point, index) => ({ value: point, label: index }))}>
                  <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor={accent} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={accent} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill={`url(#gradient-${title})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="dp-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Health trends</h3>
              <p className="mt-1 text-xs text-slate-400">Recent measurements across your daily routine</p>
            </div>
            <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">Last 7 days</span>
          </div>

          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="glucose" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sleep" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="activity" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dp-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">AI health insight</h3>
              <p className="mt-1 text-xs text-slate-400">Personalized for you</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="mb-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
              {selectedInsight.risk_level || 'Low'}
            </div>
            <h4 className="text-xl font-bold text-slate-900">{selectedInsight.title}</h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">{selectedInsight.explanation}</p>
            <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-700">Why this may matter</p>
                <p className="mt-1 leading-6 text-slate-600">{selectedInsight.explanation}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Personalized guidance</p>
                <p className="mt-1 leading-6 text-slate-600">{selectedInsight.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="dp-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Daily wellness summary</h3>
              <p className="mt-1 text-xs text-slate-400">This is not a medical diagnosis.</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">{wellnessScore}/100</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Sleep', value: '82%', icon: MoonStar },
              { label: 'Activity', value: '74%', icon: Activity },
              { label: 'Glucose consistency', value: '86%', icon: Heart },
              { label: 'Weight trend', value: '78%', icon: Scale },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-500" />
                    {label}
                  </span>
                  <span>{value}</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dp-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Quick actions</h3>
              <p className="mt-1 text-xs text-slate-400">Reply intentionally to your daily health goals</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Add Health Record', to: '/records' },
              { label: 'View Analytics', to: '/analytics' },
              { label: 'Ask AI Assistant', to: '/assistant' },
              { label: 'View Insights', to: '/insights' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="dp-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Today&apos;s reminders</h3>
              <p className="mt-1 text-xs text-slate-400">Stay on pace with key habits</p>
            </div>
            <Bell className="h-5 w-5 text-slate-400" />
          </div>

          {reminders.length === 0 ? (
            <EmptyState title="No reminders yet" description="Add a reminder to keep your daily routine consistent." />
          ) : (
            <div className="space-y-3">
              {reminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{reminder.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{reminder.description}</p>
                  </div>
                  <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                    {reminder.reminder_time || 'Any time'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dp-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent health records</h3>
              <p className="mt-1 text-xs text-slate-400">Recent notes from your day-to-day routine</p>
            </div>
            <Link to="/records" className="text-sm font-semibold text-blue-600">View all</Link>
          </div>

          {todayRecords.length === 0 ? (
            <EmptyState title="No records yet" description="Add your first daily health record to unlock personalized insights." />
          ) : (
            <div className="space-y-3">
              {todayRecords.slice(0, 4).map((record) => (
                <div key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="mt-1 text-xs text-slate-500">{record.meal}</p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {record.glucose} mg/dL
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <div className="rounded-lg bg-white px-2 py-1.5">Sleep {record.sleep_hours}h</div>
                    <div className="rounded-lg bg-white px-2 py-1.5">Activity {record.activity_minutes}m</div>
                    <div className="rounded-lg bg-white px-2 py-1.5">Weight {record.weight}kg</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
