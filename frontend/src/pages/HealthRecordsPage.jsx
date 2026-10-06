import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import AddHealthRecordModal from '../components/health/AddHealthRecordModal'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StatePanels'
import { getHealthRecordsForUser, saveHealthRecord } from '../services/healthService'

export default function HealthRecordsPage({ session }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const loadRecords = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      setError('')
      const { records: nextRecords } = await getHealthRecordsForUser(session.user.id)
      setRecords(nextRecords)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load health records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [session])

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return records

    return records.filter((record) =>
      [record.meal, record.medication, record.symptoms, record.glucose, record.weight]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [records, search])

  const handleSave = async (payload) => {
    try {
      setSaving(true)
      setSuccessMessage('')
      await saveHealthRecord(payload, session.user.id)
      setSuccessMessage('Health record saved successfully.')
      setModalOpen(false)
      await loadRecords()
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this record.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingState title="Loading records" description="Reviewing your recent health log…" />
  }

  if (error) {
    return <ErrorState title="Unable to load records" message={error} />
  }

  return (
    <div className="dp-fade-up space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Health Records</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Daily tracking log</h2>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="dp-button inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20"
        >
          <Plus className="h-4 w-4" />
          Add health record
        </button>
      </div>

      <div className="dp-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meal, symptoms, or medication"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            Date range
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div>
      )}

      {filteredRecords.length === 0 ? (
        <EmptyState
          title="No records match your filters"
          description="Try another keyword or add a new health record for today."
          actionLabel="Add a record"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {['Date', 'Glucose', 'Meal', 'Medication', 'Activity', 'Sleep', 'Weight', 'Symptoms'].map((header) => (
                    <th key={header} className="px-4 py-3 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-t border-slate-200 text-slate-700">
                    <td className="px-4 py-3">{new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3 font-semibold">{record.glucose} mg/dL</td>
                    <td className="px-4 py-3">{record.meal}</td>
                    <td className="px-4 py-3">{record.medication}</td>
                    <td className="px-4 py-3">{record.activity_minutes} min</td>
                    <td className="px-4 py-3">{record.sleep_hours} h</td>
                    <td className="px-4 py-3">{record.weight} kg</td>
                    <td className="px-4 py-3">{record.symptoms || 'None reported'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 p-4 md:hidden">
            {filteredRecords.map((record) => (
              <div key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900">
                    {new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">{record.glucose} mg/dL</div>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div><span className="font-semibold text-slate-700">Meal:</span> {record.meal}</div>
                  <div><span className="font-semibold text-slate-700">Medication:</span> {record.medication}</div>
                  <div><span className="font-semibold text-slate-700">Activity:</span> {record.activity_minutes} min</div>
                  <div><span className="font-semibold text-slate-700">Sleep:</span> {record.sleep_hours} h</div>
                  <div><span className="font-semibold text-slate-700">Weight:</span> {record.weight} kg</div>
                  <div><span className="font-semibold text-slate-700">Symptoms:</span> {record.symptoms || 'None reported'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddHealthRecordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  )
}
