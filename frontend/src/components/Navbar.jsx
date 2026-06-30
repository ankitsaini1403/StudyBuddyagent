import { SUBJECTS, MODES, subjectColor } from '../hooks/useChat.js'

/**
 * Navbar — top bar inside the Chat page.
 *
 * Props:
 *   subject       — string
 *   mode          — string
 *   sessionTitle  — string
 *   onMenuToggle  — () => void   (opens mobile sidebar)
 *   isLoading     — boolean
 */
export default function Navbar({ subject, mode, sessionTitle, onMenuToggle, isLoading }) {
  const accent       = subjectColor(subject)
  const subjectMeta  = SUBJECTS.find((s) => s.id === subject)
  const modeMeta     = MODES.find((m) => m.id === mode)

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 border-b border-ink bg-night-800 sticky top-0 z-10"
      style={{ borderBottomColor: `${accent}33` }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="md:hidden btn-ghost p-1.5 -ml-1 flex-shrink-0"
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </button>

      {/* Subject badge */}
      <div
        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
        style={{ background: `${accent}18`, color: accent }}
      >
        <span>{subjectMeta?.icon}</span>
        <span>{subjectMeta?.label}</span>
      </div>

      {/* Session title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-200 truncate">
          {sessionTitle || 'New Session'}
        </p>
        <p className="text-[10px] text-slate-500 leading-tight">
          {modeMeta?.label} · {modeMeta?.desc}
        </p>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isLoading ? (
          <span className="flex items-center gap-1.5 text-xs text-violet">
            <span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
            Thinking…
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            Ready
          </span>
        )}
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
