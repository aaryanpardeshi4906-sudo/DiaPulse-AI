const exerciseLibrary = [
  {
    name: 'Walking',
    duration: '20 minutes',
    difficulty: 'Easy',
    instructions: 'Walk at a comfortable pace while focusing on steady breathing and posture.',
    safety: 'Stop if you feel dizzy, out of breath, or uncomfortable.',
  },
  {
    name: 'Mobility',
    duration: '10 minutes',
    difficulty: 'Easy',
    instructions: 'Move shoulders, ankles, and hips gently to improve flexibility and comfort.',
    safety: 'Move slowly and avoid any movement that causes strain.',
  },
  {
    name: 'Stretching',
    duration: '12 minutes',
    difficulty: 'Moderate',
    instructions: 'Hold stretches gently for 20-30 seconds and exhale slowly through each movement.',
    safety: 'Skip any stretch that creates sharp pain or pressure.',
  },
  {
    name: 'Balance',
    duration: '8 minutes',
    difficulty: 'Moderate',
    instructions: 'Stand near a stable surface and shift your weight gently from side to side.',
    safety: 'Use support if you feel unsteady or lightheaded.',
  },
]

export default function ExercisePage() {
  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Exercise</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Senior-friendly movement plan</h2>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {exerciseLibrary.map((exercise) => (
          <article key={exercise.name} className="dp-card dp-card-hover p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{exercise.difficulty}</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{exercise.name}</h3>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">{exercise.duration}</div>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">Instructions</p>
                <p className="mt-1">{exercise.instructions}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Safety guidance</p>
                <p className="mt-1">{exercise.safety}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
