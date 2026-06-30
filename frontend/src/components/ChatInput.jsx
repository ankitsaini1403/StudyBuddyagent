import { useState, useRef, useEffect } from 'react'
import { subjectColor } from '../hooks/useChat.js'

/**
 * ChatInput — sticky input bar at the bottom of the chat.
 *
 * Props:
 *   onSend    — (text: string) => void
 *   onAbort   — () => void
 *   isLoading — boolean
 *   subject   — string (for accent colour)
 *   disabled  — boolean
 */
export default function ChatInput({ onSend, onAbort, isLoading, subject, disabled }) {
  const [text, setText]   = useState('')
  const textareaRef       = useRef(null)
  const accent            = subjectColor(subject)

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [text])

  /* Focus on mount */
  useEffect(() => { textareaRef.current?.focus() }, [])

  const handleSend = () => {
    if (!text.trim() || isLoading || disabled) return
    onSend(text.trim())
    setText('')
    textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = text.trim().length > 0 && !disabled

  return (
    <div
      className="border-t border-ink bg-night px-4 py-3"
      style={{ borderTopColor: `${accent}33` }}
    >
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            disabled={disabled}
            placeholder={isLoading ? 'StudyBuddy is thinking…' : 'Ask anything… (Enter to send)'}
            rows={1}
            className="
              w-full resize-none bg-night-700 border border-ink rounded-2xl
              px-4 py-3 pr-12 text-sm text-slate-200 placeholder-slate-600
              focus:border-violet focus:ring-1 focus:ring-violet
              outline-none transition-colors duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              leading-relaxed
            "
            style={{ minHeight: 48, maxHeight: 160 }}
          />

          {/* Char hint */}
          {text.length > 800 && (
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-600">
              {text.length}
            </span>
          )}
        </div>

        {/* Send / Abort button */}
        {isLoading ? (
          <button
            onClick={onAbort}
            title="Stop generating"
            className="
              flex-shrink-0 w-11 h-11 rounded-2xl border border-ink
              flex items-center justify-center text-slate-400
              hover:bg-ink hover:text-white transition-all duration-150
            "
          >
            <StopIcon />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            title="Send message"
            className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center
                       text-white transition-all duration-150
                       disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background:  canSend ? accent : '#2D2D44',
              boxShadow:   canSend ? `0 4px 14px ${accent}55` : 'none',
            }}
          >
            <SendIcon />
          </button>
        )}
      </div>

      <p className="text-center text-[10px] text-slate-700 mt-2 select-none">
        Shift+Enter for new line · AI can make mistakes, verify important info
      </p>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  )
}
