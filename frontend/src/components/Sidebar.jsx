import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBJECTS, MODES, subjectColor } from '../hooks/useChat.js'

/**
 * Sidebar — left panel showing:
 *   • New Chat button
 *   • Subject & Mode pickers
 *   • Session history list
 *
 * Props:
 *   sessions        — array
 *   activeSessionId — string | null
 *   subject         — string
 *   mode            — string
 *   onSetSubject    — (id) => void
 *   onSetMode       — (id) => void
 *   onSelectSession — (id) => void
 *   onDeleteSession — (id) => void
 *   onNewChat       — () => void
 *   isOpen          — boolean (mobile toggle)
 *   onClose         — () => void
 */
export default function Sidebar({
  sessions, activeSessionId,
  subject, mode,
  onSetSubject, onSetMode,
  onSelectSession, onDeleteSession,
  onNewChat,
  isOpen, onClose,
}) {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative z-30 md:z-auto
          top-0 left-0 h-full
          w-64 flex-shrink-0
          bg-night-800 border-r border-ink
          flex flex-col
          transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-ink">
          <span className="text-2xl select-none">🦉</span>
          <span className="font-extrabold text-white text-base tracking-tight">StudyBuddy</span>
          <button
            className="ml-auto md:hidden btn-ghost p-1"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-3">
          <button
            onClick={() => { onNewChat(); onClose() }}
            className="
              w-full flex items-center justify-center gap-2
              bg-violet hover:bg-violet-light active:bg-violet-dark
              text-white text-sm font-semibold rounded-xl py-2.5
              transition-all duration-150
              shadow-[0_4px_14px_rgba(108,99,255,0.35)]
            "
          >
            <PlusIcon /> New Chat
          </button>
        </div>

        {/* Subject Picker */}
        <Section label="Subject">
          <div className="grid grid-cols-3 gap-1.5 px-3">
            {SUBJECTS.map((s) => {
              const active = subject === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => onSetSubject(s.id)}
                  title={s.label}
                  className={`
                    flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium
                    border-2 transition-all duration-150
                    ${active
                      ? 'border-current bg-night-600 text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-ink'
                    }
                  `}
                  style={ active ? { borderColor: s.color, color: s.color } : {} }
                >
                  <span className="text-base leading-none">{s.icon}</span>
                  <span className="leading-none truncate w-full text-center" style={{ fontSize: 10 }}>
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Mode Picker */}
        <Section label="Mode">
          <div className="flex flex-col gap-1 px-3">
            {MODES.map((m) => {
              const active = mode === m.id
              const color  = subjectColor(subject)
              return (
                <button
                  key={m.id}
                  onClick={() => onSetMode(m.id)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-xl text-left
                    border transition-all duration-150
                    ${active
                      ? 'border-current bg-night-600'
                      : 'border-transparent hover:bg-ink text-slate-500 hover:text-slate-300'
                    }
                  `}
                  style={ active ? { borderColor: `${color}55`, color } : {} }
                >
                  <span className="text-sm">{modeIcon(m.id)}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${active ? '' : 'text-slate-400'}`}>
                      {m.label}
                    </p>
                    <p className="text-[10px] text-slate-600 leading-tight truncate">{m.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Session history */}
        <Section label="Recent Chats" className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6 px-3">
              No sessions yet. Start a new chat!
            </p>
          ) : (
            <div className="flex flex-col gap-0.5 px-3">
              {sessions.map((s) => {
                const active = s.id === activeSessionId
                const hovered = s.id === hoveredId
                const color = subjectColor(s.subject)
                return (
                  <div
                    key={s.id}
                    className={`
                      group flex items-center gap-2 px-3 py-2.5 rounded-xl
                      cursor-pointer transition-all duration-150
                      ${active ? 'bg-ink' : 'hover:bg-night-600'}
                    `}
                    onMouseEnter={() => setHoveredId(s.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => { onSelectSession(s.id); navigate(`/chat/${s.id}`); onClose() }}
                  >
                    <span className="text-sm flex-shrink-0" style={{ color }}>{SUBJECTS.find(sub => sub.id === s.subject)?.icon}</span>
                    <span className={`flex-1 text-xs truncate ${active ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                      {s.title}
                    </span>
                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id) }}
                      className={`
                        flex-shrink-0 p-0.5 rounded text-slate-600 hover:text-rose
                        transition-all duration-100
                        ${hovered || active ? 'opacity-100' : 'opacity-0'}
                      `}
                      title="Delete session"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-ink">
          <button
            onClick={() => { localStorage.removeItem('sb_token'); navigate('/login') }}
            className="btn-ghost w-full justify-start text-xs text-slate-600 hover:text-rose"
          >
            <LogOutIcon /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ label, children, className = '' }) {
  return (
    <div className={`py-3 border-b border-ink ${className}`}>
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}

/* ── Mode icons ──────────────────────────────────────────────── */
function modeIcon(id) {
  const map = { tutor: '📖', quiz: '❓', summarize: '⚡', flashcard: '🃏' }
  return map[id] ?? '📖'
}

/* ── SVG icons ───────────────────────────────────────────────── */
function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
function CloseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
function LogOutIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{marginRight:6}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
