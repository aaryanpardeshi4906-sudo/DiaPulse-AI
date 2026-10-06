export const demoRecords = [
  {
    id: 'demo-1',
    recorded_at: '2026-10-05T08:15:00',
    glucose: 102,
    meal: 'Oatmeal and berries',
    medication: 'Metformin 500mg',
    activity_minutes: 31,
    symptoms: 'Mild afternoon fatigue',
    sleep_hours: 7.4,
    weight: 72.4,
  },
  {
    id: 'demo-2',
    recorded_at: '2026-10-04T07:50:00',
    glucose: 110,
    meal: 'Greek yogurt and fruit',
    medication: 'Metformin 500mg',
    activity_minutes: 42,
    symptoms: 'No major symptoms',
    sleep_hours: 7.9,
    weight: 72.5,
  },
  {
    id: 'demo-3',
    recorded_at: '2026-10-03T08:10:00',
    glucose: 98,
    meal: 'Vegetable omelet',
    medication: 'Vitamin D',
    activity_minutes: 25,
    symptoms: 'Restless evening',
    sleep_hours: 6.9,
    weight: 72.7,
  },
  {
    id: 'demo-4',
    recorded_at: '2026-10-02T07:45:00',
    glucose: 117,
    meal: 'Chicken salad wrap',
    medication: 'Metformin 500mg',
    activity_minutes: 36,
    symptoms: 'Slight thirst',
    sleep_hours: 7.2,
    weight: 72.9,
  },
  {
    id: 'demo-5',
    recorded_at: '2026-10-01T07:35:00',
    glucose: 105,
    meal: 'Avocado toast',
    medication: 'Metformin 500mg',
    activity_minutes: 44,
    symptoms: 'Energy stable',
    sleep_hours: 8.1,
    weight: 73.1,
  },
  {
    id: 'demo-6',
    recorded_at: '2026-09-30T08:05:00',
    glucose: 94,
    meal: 'Rice bowl with salmon',
    medication: 'Metformin 500mg',
    activity_minutes: 28,
    symptoms: 'No major symptoms',
    sleep_hours: 7.5,
    weight: 73.3,
  },
]

export const demoInsights = [
  {
    id: 'insight-1',
    insight_type: 'Potential pattern detected',
    title: 'Glucose trends shift with activity',
    explanation:
      'Your glucose readings have been slightly higher on days with lower activity.',
    recommendation:
      'Try a 20-30 minute walk after meals and review your routine over the next week.',
    risk_level: 'Moderate',
    created_at: '2026-10-05T09:00:00',
  },
  {
    id: 'insight-2',
    insight_type: 'Trend observed',
    title: 'Sleep quality supports daily stability',
    explanation:
      'Sleep duration has been trending upward, which can help support steadier daily patterns.',
    recommendation:
      'Keep a consistent bedtime and avoid screens 30 minutes before sleep.',
    risk_level: 'Low',
    created_at: '2026-10-04T07:30:00',
  },
]

export const demoReminders = [
  {
    id: 'remider-1',
    title: 'Medication',
    description: 'Take evening dose with food',
    reminder_time: '19:30',
    is_completed: false,
  },
  {
    id: 'remider-2',
    title: 'Morning walk',
    description: 'Light walk for 20 minutes',
    reminder_time: '08:00',
    is_completed: true,
  },
  {
    id: 'remider-3',
    title: 'Glucose check',
    description: 'Record post-lunch reading',
    reminder_time: '13:30',
    is_completed: false,
  },
]

export const exerciseLibrary = [
  {
    name: 'Walking',
    duration: '20 minutes',
    difficulty: 'Easy',
    instructions: 'Walk indoors or outside at a comfortable pace and focus on steady breathing.',
    safety: 'Stop if you feel dizzy, unusually short of breath, or chest discomfort.',
  },
  {
    name: 'Mobility',
    duration: '10 minutes',
    difficulty: 'Easy',
    instructions: 'Gently move joints in the shoulders, ankles, and hips with controlled repetitions.',
    safety: 'Move slowly and avoid any stretch that causes pain.',
  },
  {
    name: 'Stretching',
    duration: '12 minutes',
    difficulty: 'Moderate',
    instructions: 'Hold each stretch for 20-30 seconds and keep movements smooth and comfortable.',
    safety: 'Never push into sharp pain or strain.',
  },
  {
    name: 'Balance',
    duration: '8 minutes',
    difficulty: 'Moderate',
    instructions: 'Stand near a wall or sturdy chair and practice shifting weight slowly from side to side.',
    safety: 'If unsteady, hold support and stop immediately.',
  },
]

export const assistantSuggestions = [
  'How has my glucose changed this week?',
  'What can I do to improve my sleep?',
  'Show me my recent health patterns.',
  'Give me today\'s activity suggestion.',
]
