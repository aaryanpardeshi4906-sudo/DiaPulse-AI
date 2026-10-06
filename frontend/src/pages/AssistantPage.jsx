import { useEffect, useState } from 'react'
import { ArrowUpRight, Bot, Send, Sparkles } from 'lucide-react'
import { assistantSuggestions } from '../lib/demoData'
import { getHealthRecordsForUser } from '../services/healthService'

const defaultMessages = [
  {
    sender: 'bot',
    text: 'I can help review your recent health patterns and suggest supportive next steps. Ask about glucose, sleep, activity, or your daily routine.',
  },
]

export default function AssistantPage({ session }) {
  const [messages, setMessages] = useState(defaultMessages)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [healthData, setHealthData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.id) return
      const { records } = await getHealthRecordsForUser(session.user.id)
      setHealthData(records.slice(0, 5))
    }

    loadData()
  }, [session])

  const handleSuggestion = (value) => {
    setPrompt(value)
    handleSend(value)
  }

  const handleSend = async (value = prompt) => {
    if (!value || !value.trim()) return

    const nextMessage = { sender: 'user', text: value.trim() }
    setMessages((current) => [...current, nextMessage])
    setPrompt('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: value.trim(),
          healthData,
        }),
      })

      const result = await response.json()
      const botReply = result?.answer || 'I was unable to generate a recommendation right now. Please try a different question.'
      setMessages((current) => [...current, { sender: 'bot', text: botReply }])
    } catch {
      setMessages((current) => [
        ...current,
        {
          sender: 'bot',
          text: 'I am unable to reach the safety-aware health assistant right now. Please try again in a moment or ask a simpler question.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dp-fade-up space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">AI assistant</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Your health conversation</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="dp-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Suggested prompts</h3>
              <p className="mt-1 text-xs text-slate-400">Safe coaching questions</p>
            </div>
          </div>

          <div className="space-y-3">
            {assistantSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span>{suggestion}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="dp-card flex min-h-[560px] flex-col p-4">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">DiaPulse AI</p>
              <p className="text-lg font-bold text-slate-900">Health assistant</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Thinking about your recent health patterns…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSend()
            }}
            className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4"
          >
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask about glucose, sleep, routine, or activity…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="dp-button inline-flex items-center justify-center rounded-xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
