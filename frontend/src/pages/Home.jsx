import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat, SUBJECTS, MODES, subjectColor } from '../hooks/useChat.js'

export default function Home() {
  const navigate = useNavigate()
  const { subject, mode, setSubject, setMode, startSession } = useChat()
  const [topic, setTopic] = useState('')
  const [busy,  setBusy]  = useState(false)

  const accent   = subjectColor(subject)
  const canStart = subject && mode && topic.trim().length > 0

  const handleStart = async () => {
    if (!canStart || busy) return
    setBusy(true)
    await startSession(topic.trim())
    setBusy(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleStart()
  }

  return (
    <div className="min-h-screen bg-night flex flex-col">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% -10%, ${accent}55 0%, transparent 60%)`,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Top bar */}
     <header className="flex items-center justify-between px-6 py-4 border-b border-ink">
  <div className="flex items-center gap-2">
    <span className="text-2xl select-none">🦉</span>
    <span className="font-extrabold text-white tracking-tight">StudyBuddy</span>
  </div>
  <div className="flex items-center gap-2">
    <button onClick={() => navigate('/notes')} className="btn-ghost text-sm">
      My Notes →
    </button>
    <button onClick={() => navigate('/chat')} className="btn-ghost text-sm">
      My Sessions →
    </button>
  </div>
</header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl animate-slide-up">

          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Learn anything,<br />
              <span style={{ color: accent }}>your way.</span>
            </h1>
            <p className="text-slate-400 text-base max-w-md mx-auto">
              Pick a subject, choose how you want to learn, and let your AI study partner do the rest.
            </p>
          </div>

          {/* Step 1 — Subject */}
          <Step number="1" label="What are you studying?">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SUBJECTS.map((s) => {
                const active = subject === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setSubject(s.id)}
                    className={`
                      subject-chip
                      ${active ? 'selected' : ''}
                    `}
                    style={active ? { borderColor: s.color, background: `${s.color}14` } : {}}
                  >
                    <span className="text-2xl leading-none">{s.icon}</span>
                    <span
                      className="text-xs font-semibold leading-tight"
                      style={{ color: active ? s.color : '#94A3B8' }}
                    >
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </Step>

          {/* Step 2 — Mode */}
          <Step number="2" label="How do you want to learn?">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MODES.map((m) => {
                const active = mode === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`
                      flex flex-col items-start gap-1 p-3.5 rounded-2xl text-left
                      border-2 transition-all duration-150
                      ${active
                        ? 'bg-night-600'
                        : 'bg-night-700 border-transparent hover:border-ink hover:bg-night-600'
                      }
                    `}
                    style={ active ? { borderColor: accent, background: `${accent}12` } : {} }
                  >
                    <span className="text-lg">{modeIcon(m.id)}</span>
                    <span
                      className="text-sm font-bold leading-tight"
                      style={{ color: active ? accent : '#CBD5E0' }}
                    >
                      {m.label}
                    </span>
                    <span className="text-[11px] text-slate-600 leading-tight">{m.desc}</span>
                  </button>
                )
              })}
            </div>
          </Step>

          {/* Step 3 — Topic */}
          <Step number="3" label="What's the topic?">
            <div className="flex gap-3">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKey}
                placeholder='e.g. "Photosynthesis", "Recursion", "French Revolution"'
                className="input-base flex-1 text-base py-3.5"
                autoFocus
              />
              <button
                onClick={handleStart}
                disabled={!canStart || busy}
                className="
                  flex-shrink-0 px-6 py-3.5 rounded-xl font-bold text-white text-sm
                  transition-all duration-150
                  disabled:opacity-30 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
                style={{
                  background:  canStart ? accent : '#2D2D44',
                  boxShadow:   canStart ? `0 4px 16px ${accent}55` : 'none',
                }}
              >
                {busy ? 'Starting…' : <>Start <ArrowIcon /></>}
              </button>
            </div>
          </Step>

        </div>
      </main>
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────── */
function Step({ number, label, children }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-6 h-6 rounded-full bg-violet text-white text-xs font-black flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      {children}
    </div>
  )
}

function modeIcon(id) {
  return { tutor: '📖', quiz: '❓', summarize: '⚡', flashcard: '🃏' }[id] ?? '📖'
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
