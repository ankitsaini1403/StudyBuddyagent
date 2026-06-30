import { useEffect, useRef } from 'react'
import Message from './Message.jsx'
import { SUBJECTS, MODES, subjectColor } from '../hooks/useChat.js'

/**
 * ChatBox — scrollable area that renders the message history.
 *
 * Props:
 *   messages  — array of { id, role, content, ts }
 *   subject   — string
 *   mode      — string
 *   isLoading — boolean
 *   topic     — string (first user message content, shown in empty state)
 */
export default function ChatBox({ messages, subject, mode, isLoading, topic }) {
  const bottomRef = useRef(null)
  const accent    = subjectColor(subject)

  /* Always scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label ?? 'General'
  const modeLabel    = MODES.find((m) => m.id === mode)?.label ?? 'Tutor Me'

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">

        {/* Session header pill */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-night-700 border border-ink text-xs text-slate-500">
            <span style={{ color: accent }}>
              {SUBJECTS.find((s) => s.id === subject)?.icon}
            </span>
            <span>{subjectLabel}</span>
            <span className="text-ink-light">·</span>
            <span>{modeLabel}</span>
          </div>
        </div>

        {/* Empty state — shown before any messages */}
        {messages.length === 0 && !isLoading && (
          <EmptyState subject={subject} mode={mode} accent={accent} />
        )}

        {/* Message list */}
        {messages.map((msg, idx) => (
          <Message
            key={msg.id}
            msg={msg}
            subject={subject}
            isLast={idx === messages.length - 1}
            loading={isLoading}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function EmptyState({ subject, mode, accent }) {
  const subjectMeta = SUBJECTS.find((s) => s.id === subject)
  const modeMeta    = MODES.find((m) => m.id === mode)

  const hints = {
    tutor:     ['Explain recursion with a real-world analogy', 'Walk me through how photosynthesis works', 'Break down the causes of World War I'],
    quiz:      ['Quiz me on the periodic table', 'Test me on quadratic equations', 'Give me a history quiz'],
    summarize: ['Summarize the French Revolution', 'Key points of Newton\'s laws', 'Summarize CRISPR gene editing'],
    flashcard: ['Flashcards for Spanish vocabulary', 'Key coding concepts flashcards', 'Biology cell structures'],
  }

  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center animate-fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background: `${accent}20`, boxShadow: `0 0 0 3px ${accent}30` }}
      >
        {subjectMeta?.icon ?? '🧠'}
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">
          Ready to {modeMeta?.label ?? 'study'}!
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Ask anything about <span style={{ color: accent }}>{subjectMeta?.label}</span>.
          Here are some ideas to get started:
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        {(hints[mode] ?? hints.tutor).map((h) => (
          <div
            key={h}
            className="px-4 py-2.5 rounded-xl bg-night-700 border border-ink text-sm text-slate-400
                       hover:border-violet/40 hover:text-slate-200 transition-all duration-150 cursor-default text-left"
          >
            "{h}"
          </div>
        ))}
      </div>
    </div>
  )
}
