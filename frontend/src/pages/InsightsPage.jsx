import { useEffect, useState } from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { getAiInsightsForUser } from '../services/healthService'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StatePanels'

export default function InsightsPage({ session }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return

    const loadInsights = async () => {
      try {
        setLoading(true)
        setError('')
        const nextInsights = await getAiInsightsForUser(session.user.id)
        setInsights(nextInsights)
      } catch (loadError) {
        setError(loadError.message || 'Unable to load AI insights.')
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [session])

  if (loading) {
    return <LoadingState title="Loading insights" description="Reviewing patterns and daily health signals…" />
  }

  if (error) {
    return <ErrorState title="Insights unavailable" message={error} />
  }

  if (insights.length === 0) {
    return <EmptyState title="No AI insights yet" description="Add more health records to generate trend-based recommendations." />
  }

  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">AI insights</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Personalized pattern review</h2>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {insights.map((insight) => (
          <article key={insight.id} className="dp-card dp-card-hover p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{insight.insight_type || 'Trend observed'}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{insight.title}</h3>
                </div>
              </div>

              <div className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                {insight.risk_level || 'Low'}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              {insight.explanation}
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">Why detected</p>
                <p className="mt-1 leading-6">{insight.explanation}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Recommendation</p>
                <p className="mt-1 leading-6">{insight.recommendation}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Safe wording only
              </span>
              <span>{insight.created_at ? new Date(insight.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
