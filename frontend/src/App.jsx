import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email to confirm your account.')
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Login successful!')
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Enter your email address first.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173',
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset link sent to your email.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 text-center">
          DiaPulse AI
        </h1>

        <p className="text-slate-500 text-center mt-2">
          Personalized Health Companion
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold"
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>

          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="w-full text-blue-600 text-sm font-medium"
          >
            Forgot Password?
          </button>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full border border-blue-600 text-blue-600 rounded-lg py-3 font-semibold"
          >
            Create Account
          </button>

          {message && (
            <p className="text-center text-sm text-slate-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App