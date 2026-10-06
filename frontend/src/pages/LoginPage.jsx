import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('signin')

  const highlights = useMemo(
    () => [
      'Secure access to personalized health data',
      'AI-guided health trend monitoring',
      'Proactive reminders and clinical-ready insights',
    ],
    []
  )

  const handleAuth = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setMessage(error.message)
          return
        }
        window.location.href = '/dashboard'
        return
      }

      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
        return
      }

      setMessage('Account created. Please check your inbox to confirm your email.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Enter your email first so we can send a reset link.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    setLoading(false)
    setMessage(
      error ? error.message : 'Password reset instructions were sent to your email.'
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.15),_transparent_35%),linear-gradient(135deg,#eff6ff,#f8fafc_28%,#ecfeff_100%)] p-8 sm:p-10 lg:p-12">
          <div className="absolute -right-28 -top-16 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-slate-900">DiaPulse AI</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Healthcare intelligence</p>
              </div>
            </div>

            <div className="mt-10 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Built for better daily care</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Personalized health guidance, designed for everyday confidence.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Track patterns, surface meaningful insights, and make health decisions with a calmer, clearer view of daily wellness.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'AI insights', value: '24/7' },
                { label: 'Protected', value: 'RLS' },
                { label: 'Care support', value: 'KPI' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                  <div className="text-xl font-black text-slate-900">{item.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Create account
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-sm text-slate-500">Secure member access</p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="dp-button flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 disabled:opacity-60"
              >
                {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in to DiaPulse' : 'Create account'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </form>

            {message && (
              <div className={`mt-5 rounded-xl border p-3 text-sm ${message.includes('sent') || message.includes('Check') || message.includes('created') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Built with AI</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Secure, readable, and senior-friendly care guidance.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
