import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import HealthOverviewPage from './pages/HealthOverviewPage'
import HealthRecordsPage from './pages/HealthRecordsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import InsightsPage from './pages/InsightsPage'
import RemindersPage from './pages/RemindersPage'
import ExercisePage from './pages/ExercisePage'
import AssistantPage from './pages/AssistantPage'
import CaregiverPage from './pages/CaregiverPage'
import ClinicianPage from './pages/ClinicianPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SecurityPage from './pages/SecurityPage'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const userName = useMemo(() => {
    if (!session) return 'User'
    return session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
  }, [session])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f7fb]">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-600 shadow-sm">
          Loading DiaPulse AI…
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/" element={<Navigate to={session ? '/dashboard' : '/login'} replace />} />

        <Route path="/dashboard" element={session ? <AppShell userName={userName}><DashboardPage session={session} /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/health" element={session ? <AppShell userName={userName}><HealthOverviewPage /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/records" element={session ? <AppShell userName={userName}><HealthRecordsPage session={session} /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/analytics" element={session ? <AppShell userName={userName}><AnalyticsPage session={session} /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/insights" element={session ? <AppShell userName={userName}><InsightsPage session={session} /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/reminders" element={session ? <AppShell userName={userName}><RemindersPage session={session} /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/exercise" element={session ? <AppShell userName={userName}><ExercisePage /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/assistant" element={session ? <AppShell userName={userName}><AssistantPage session={session} /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/caregiver" element={session ? <AppShell userName={userName}><CaregiverPage /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/clinician" element={session ? <AppShell userName={userName}><ClinicianPage /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={session ? <AppShell userName={userName}><ProfilePage /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={session ? <AppShell userName={userName}><SettingsPage /></AppShell> : <Navigate to="/login" replace />} />
        <Route path="/privacy" element={session ? <AppShell userName={userName}><SecurityPage /></AppShell> : <Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to={session ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App