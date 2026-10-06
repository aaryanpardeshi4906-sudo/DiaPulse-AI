const settingsGroups = [
  { title: 'Notifications', items: ['Medication reminders', 'Weekly summary email', 'Daily check-in prompts'] },
  { title: 'Privacy', items: ['Profile visibility', 'Data sharing preferences', 'Secondary contact access'] },
  { title: 'Security', items: ['Two-step verification', 'Session review', 'Password manager support'] },
  { title: 'Display preferences', items: ['High contrast mode', 'Large text mode', 'Color theme'] },
]

export default function SettingsPage() {
  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Settings</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Your preferences</h2>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {settingsGroups.map((group) => (
          <div key={group.title} className="dp-card p-6">
            <h3 className="text-xl font-bold text-slate-900">{group.title}</h3>
            <div className="mt-5 space-y-3">
              {group.items.map((item) => (
                <div key={item} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span>{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
