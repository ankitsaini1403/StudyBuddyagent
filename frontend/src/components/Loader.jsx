/* Loader.jsx — reusable loading indicators */

/** Three bouncing dots used inside the chat while AI is thinking */
export function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="w-2 h-2 rounded-full bg-violet dot-1 inline-block" />
      <span className="w-2 h-2 rounded-full bg-violet dot-2 inline-block" />
      <span className="w-2 h-2 rounded-full bg-violet dot-3 inline-block" />
    </div>
  )
}

/** Full-screen or container-filling spinner for page loads */
export function Spinner({ size = 'md', className = '' }) {
  const dim = size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-10 h-10 border-4' : 'w-6 h-6 border-2'
  return (
    <span
      className={`inline-block rounded-full border-violet/30 border-t-violet animate-spin ${dim} ${className}`}
    />
  )
}

/** Centred overlay for page-level loading */
export default function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-4xl animate-bounce select-none">🦉</span>
        <TypingDots />
        <p className="text-slate-500 text-xs tracking-wide">Loading StudyBuddy…</p>
      </div>
    </div>
  )
}
