import { useState } from 'react'
import { X } from 'lucide-react'

const initialForm = {
  glucose: '',
  meal: '',
  medication: '',
  activity_minutes: '',
  symptoms: '',
  sleep_hours: '',
  weight: '',
}

export default function AddHealthRecordModal({ open, onClose, onSave, saving }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  if (!open) return null

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = {
      glucose: Number(form.glucose),
      meal: form.meal.trim(),
      medication: form.medication.trim(),
      activity_minutes: Number(form.activity_minutes),
      symptoms: form.symptoms.trim(),
      sleep_hours: Number(form.sleep_hours),
      weight: Number(form.weight),
    }

    if ([payload.glucose, payload.activity_minutes, payload.sleep_hours, payload.weight].some((value) => Number.isNaN(value))) {
      setError('Please complete all numeric fields with valid values.')
      return
    }

    if (!payload.meal || !payload.medication) {
      setError('Meal and medication details help create a complete record.')
      return
    }

    if (payload.glucose <= 0 || payload.sleep_hours <= 0 || payload.weight <= 0) {
      setError('Values must be greater than zero.')
      return
    }

    await onSave(payload)
  }

  const closeModal = () => {
    setForm(initialForm)
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-500">Add record</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Log a daily health update</h3>
          </div>

          <button type="button" onClick={closeModal} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Glucose (mg/dL)
              <input
                name="glucose"
                type="number"
                step="0.1"
                value={form.glucose}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Meal
              <input
                name="meal"
                type="text"
                value={form.meal}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Medication
              <input
                name="medication"
                type="text"
                value={form.medication}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Activity minutes
              <input
                name="activity_minutes"
                type="number"
                value={form.activity_minutes}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              Symptoms
              <input
                name="symptoms"
                type="text"
                value={form.symptoms}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Sleep hours
              <input
                name="sleep_hours"
                type="number"
                step="0.1"
                value={form.sleep_hours}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Weight (kg)
              <input
                name="weight"
                type="number"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="dp-button rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
