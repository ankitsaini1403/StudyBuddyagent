import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/authApi'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await registerUser({ email, password, fullName })
        await loginUser({ email, password })
      } else {
        await loginUser({ email, password })
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-night flex flex-col items-center justify-center px-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% -10%, #6C63FF55 0%, transparent 60%)',
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-night-700 border border-ink rounded-2xl p-7 animate-slide-up"
      >
        <div className="flex items-center gap-2 mb-1 justify-center">
          <span className="text-2xl select-none">🦉</span>
          <span className="font-extrabold text-white tracking-tight text-lg">StudyBuddy</span>
        </div>
        <h1 className="text-center text-slate-400 text-sm mb-6">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>

        <div className="flex flex-col gap-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-base"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="input-base"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 mt-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-150 disabled:opacity-40"
          style={{ background: '#6C63FF', boxShadow: '0 4px 16px #6C63FF55' }}
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>

        <button
          type="button"
          onClick={() => {
            setError('')
            setMode(mode === 'login' ? 'register' : 'login')
          }}
          className="w-full mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  )
}
