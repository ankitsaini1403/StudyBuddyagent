import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendChatMessage } from '../api/chatApi.js'
import { useChatContext } from '../context/ChatContext.jsx'

/* Subject → accent colour map (mirrors Tailwind custom colours) */
export const SUBJECTS = [
  { id: 'math',       label: 'Mathematics', icon: '∑',   color: '#6C63FF' },
  { id: 'science',    label: 'Science',     icon: '⚗',   color: '#00C9A7' },
  { id: 'history',    label: 'History',     icon: '📜',  color: '#F7B731' },
  { id: 'literature', label: 'Literature',  icon: '✍',   color: '#FC5C7D' },
  { id: 'coding',     label: 'Coding',      icon: '</>',  color: '#4ECDC4' },
  { id: 'general',    label: 'General',     icon: '🧠',  color: '#A29BFE' },
]

export const MODES = [
  { id: 'tutor',     label: 'Tutor Me',    desc: 'Step-by-step explanations' },
  { id: 'quiz',      label: 'Quiz Me',     desc: 'Test your knowledge'        },
  { id: 'summarize', label: 'Summarize',   desc: 'Key concepts at a glance'   },
  { id: 'flashcard', label: 'Flashcards',  desc: 'Active recall practice'     },
]

export function subjectColor(id) {
  return SUBJECTS.find((s) => s.id === id)?.color ?? '#6C63FF'
}

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

// Prefixes the user's message with subject/mode framing, since the backend's
// agent currently uses one fixed system prompt rather than per-mode prompts.
// This keeps the desired tutor/quiz/summarize/flashcard behavior without
// requiring a backend change yet.
function frameMessage(subject, mode, rawText) {
  const subLabel = SUBJECTS.find((s) => s.id === subject)?.label ?? 'General'
  const instructions = {
    tutor: `[Mode: Tutor for ${subLabel}. Explain step-by-step with examples, using markdown.]`,
    quiz: `[Mode: Quiz for ${subLabel}. Ask one multiple-choice question (A-D) about this, then wait for my answer before continuing.]`,
    summarize: `[Mode: Summary for ${subLabel}. Give the 5 most essential points as bullets, bold key terms.]`,
    flashcard: `[Mode: Flashcards for ${subLabel}. Give me one flashcard at a time: FRONT then, after I respond, BACK with explanation.]`,
  }
  const instruction = instructions[mode] ?? instructions.tutor
  return `${instruction}\n\n${rawText}`
}

export function useChat() {
  const ctx      = useChatContext()
  const navigate = useNavigate()
  const abortRef = useRef(null)

  /* ── Start a brand-new session ──────────────────────────── */
  const startSession = useCallback(
    async (topic) => {
      const session = {
        id:        makeId(),
        title:     topic || 'New session',
        subject:   ctx.subject,
        mode:      ctx.mode,
        createdAt: new Date().toISOString(),
      }
      ctx.createSession(session)
      navigate(`/chat/${session.id}`)

      const userMsg = { id: makeId(), role: 'user', content: `Let's study: ${topic}`, ts: Date.now() }
      ctx.appendMessage(session.id, userMsg)
      await _ask(session.id, session.subject, session.mode, userMsg.content)
    },
    [ctx, navigate]
  )

  /* ── Send a follow-up message ───────────────────────────── */
  const sendMessage = useCallback(
    async (text) => {
      if (!ctx.activeSessionId || ctx.isLoading) return
      const session = ctx.sessions.find((s) => s.id === ctx.activeSessionId)
      if (!session) return

      const userMsg = { id: makeId(), role: 'user', content: text.trim(), ts: Date.now() }
      ctx.appendMessage(ctx.activeSessionId, userMsg)

      await _ask(ctx.activeSessionId, session.subject, session.mode, userMsg.content)
    },
    [ctx]
  )

  /* ── Core API call ─────────────────────────────────────── */
  async function _ask(sessionId, subject, mode, latestUserText) {
    ctx.setLoading(true)
    ctx.clearError()

    // Placeholder AI message, filled in once the backend responds
    const aiMsg = { id: makeId(), role: 'assistant', content: '', ts: Date.now() }
    ctx.appendMessage(sessionId, aiMsg)

    try {
      const data = await sendChatMessage({
        message: frameMessage(subject, mode, latestUserText),
        sessionId,
        useRag: true,
      })
      ctx.patchLastMessage(sessionId, data.reply || 'No response.')
    } catch (err) {
      ctx.patchLastMessage(sessionId, `⚠️ ${err.message || 'Something went wrong. Try again.'}`)
      ctx.setError(err.message)
    } finally {
      ctx.setLoading(false)
    }
  }

  /* ── Abort in-flight request (no-op placeholder; backend call isn't cancellable yet) ── */
  const abort = useCallback(() => {
    abortRef.current?.abort()
    ctx.setLoading(false)
  }, [ctx])

  return {
    /* state */
    sessions:        ctx.sessions,
    activeSessionId: ctx.activeSessionId,
    messages:        ctx.messages[ctx.activeSessionId] ?? [],
    subject:         ctx.subject,
    mode:            ctx.mode,
    isLoading:       ctx.isLoading,
    error:           ctx.error,
    user:            ctx.user,
    /* actions */
    setSubject:      ctx.setSubject,
    setMode:         ctx.setMode,
    setActiveSession: ctx.setActiveSession,
    deleteSession:   ctx.deleteSession,
    startSession,
    sendMessage,
    abort,
  }
}
