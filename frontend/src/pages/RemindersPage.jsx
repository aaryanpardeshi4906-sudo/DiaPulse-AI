import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { addReminder, deleteReminder, getRemindersForUser, updateReminderStatus } from '../services/healthService'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StatePanels'

export default function RemindersPage({ session }) {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [time, setTime] = useState('08:00')

  const loadReminders = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      setError('')
      const nextReminders = await getRemindersForUser(session.user.id)
      setReminders(nextReminders)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load reminders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReminders()
  }, [session])

  const handleAddReminder = async (event) => {
    event.preventDefault()
    if (!title.trim()) {
      setError('Reminder title is required.')
      return
    }

    try {
      setError('')
      await addReminder({ title: title.trim(), description: description.trim(), reminder_time: time, is_completed: false }, session.user.id)
      setTitle('')
      setDescription('')
      setTime('08:00')
      await loadReminders()
    } catch (addError) {
      setError(addError.message || 'Unable to create reminder.')
    }
  }

  const handleToggle = async (id, completed) => {
    try {
      await updateReminderStatus(id, !completed)
      await loadReminders()
    } catch (toggleError) {
      setError(toggleError.message || 'Unable to update reminder state.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id)
      await loadReminders()
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete reminder.')
    }
  }

  if (loading) {
    return <LoadingState title="Loading reminders" description="Refreshing your care checklist…" />
  }

  if (error) {
    return <ErrorState title="Reminders unavailable" message={error} />
  }

  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Reminders</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Care schedule</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <form onSubmit={handleAddReminder} className="dp-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Add reminder</h3>
              <p className="mt-1 text-xs text-slate-400">Build your daily rhythm</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Medication, walk, glucose check"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Details to keep in mind"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <button type="submit" className="dp-button w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20">
              Save reminder
            </button>
          </div>
        </form>

        <div className="dp-card p-6">
          <h3 className="text-xl font-bold text-slate-900">Upcoming care actions</h3>
          {reminders.length === 0 ? (
            <div className="mt-6"><EmptyState title="No reminders yet" description="Add your first reminder to create a steady daily routine." /></div>
          ) : (
            <div className="mt-5 space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`rounded-2xl border p-4 ${reminder.is_completed ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-slate-900">{reminder.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{reminder.description}</p>
                    </div>
                    <div className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                      {reminder.reminder_time || 'Any time'}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(reminder.id, reminder.is_completed)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                        reminder.is_completed ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      {reminder.is_completed ? 'Completed' : 'Complete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(reminder.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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
