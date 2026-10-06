import {
  Activity,
  Bell,
  ChevronDown,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AppShell({ children, userName = 'Aaryan' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: 'Health Analytics',
      icon: Activity,
    },
    {
      label: 'AI Insights',
      icon: Sparkles,
    },
    {
      label: 'Reminders',
      icon: Bell,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-[17px] font-bold tracking-tight text-slate-950">
                DiaPulse
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                AI Health
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Overview
          </p>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      item.active ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>

          <nav className="space-y-1.5">
            <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
              <UserRound className="h-[18px] w-[18px] text-slate-400" />
              My Profile
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
              <Settings className="h-[18px] w-[18px] text-slate-400" />
              Settings
            </button>
          </nav>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg shadow-blue-600/15">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <p className="text-sm font-bold">Your health, protected.</p>

            <p className="mt-1 text-xs leading-5 text-blue-50">
              Your personal health data is protected with secure access controls.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-[272px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-400">
                Personalized health companion
              </p>
              <h1 className="text-lg font-bold text-slate-900">
                Good to see you, {userName}
              </h1>
            </div>

            <div className="sm:hidden">
              <p className="text-base font-bold text-slate-900">
                DiaPulse AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <button className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>

              <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                {userName}
              </span>

              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}

export default AppShell