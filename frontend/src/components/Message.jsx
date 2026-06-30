import Markdown    from './Markdown.jsx'
import { TypingDots } from './Loader.jsx'
import { subjectColor } from '../hooks/useChat.js'

/* Formats a unix timestamp → "2:34 PM" */
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Message — renders a single chat bubble.
 *
 * Props:
 *   msg      — { id, role, content, ts }
 *   subject  — active subject id (for accent colour)
 *   isLast   — whether this is the last AI message (show typing dots if empty)
 *   loading  — global loading state
 */
export default function Message({ msg, subject, isLast, loading }) {
  const isUser  = msg.role === 'user'
  const accent  = subjectColor(subject)
  const isEmpty = !msg.content && !isUser

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-slide-up">
        <div className="flex flex-col items-end gap-1 max-w-[72%]">
          <div
            className="bubble-user"
            style={{ background: accent, boxShadow: `0 4px 12px ${accent}44` }}
          >
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
          </div>
          {msg.ts && (
            <span className="text-[10px] text-slate-600 pr-1">{fmtTime(msg.ts)}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 mb-4 animate-slide-up">
      {/* Owl avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base mt-0.5"
        style={{
          background: `${accent}22`,
          boxShadow:  `0 0 0 2px ${accent}44`,
        }}
      >
        🦉
      </div>

      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="bubble-ai">
          {isEmpty && loading && isLast ? (
            <TypingDots />
          ) : (
            <Markdown content={msg.content || '…'} />
          )}
        </div>
        {msg.ts && (
          <span className="text-[10px] text-slate-600 pl-1">{fmtTime(msg.ts)}</span>
        )}
      </div>
    </div>
  )
}
