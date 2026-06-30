import ReactMarkdown from 'react-markdown'
import remarkGfm    from 'remark-gfm'

/**
 * Markdown — renders AI responses with GitHub-flavoured markdown.
 * Syntax highlighting is provided by highlight.js loaded via CDN in index.html.
 */
export default function Markdown({ content }) {
  return (
    <div className="prose-study">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* Code blocks */
          code({ inline, className, children, ...props }) {
            const language = /language-(\w+)/.exec(className || '')?.[1] ?? ''
            if (inline) {
              return (
                <code className="bg-ink text-violet font-mono text-xs px-1.5 py-0.5 rounded" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <div className="relative group my-3">
                {language && (
                  <span className="absolute top-2 right-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest select-none">
                    {language}
                  </span>
                )}
                <pre className="bg-[#0d1117] border border-ink rounded-xl overflow-x-auto text-xs">
                  <code
                    className={`block p-4 font-mono ${className ?? ''}`}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              </div>
            )
          },

          /* Tables */
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3">
                <table className="w-full border-collapse text-xs">{children}</table>
              </div>
            )
          },
          th({ children }) {
            return <th className="bg-ink text-slate-300 font-semibold px-3 py-2 text-left border border-ink-light">{children}</th>
          },
          td({ children }) {
            return <td className="px-3 py-2 border border-ink text-slate-300">{children}</td>
          },

          /* Blockquote — used for "💡 Remember" etc. */
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-violet/50 pl-4 text-slate-400 italic my-3 bg-violet/5 py-2 pr-3 rounded-r-lg">
                {children}
              </blockquote>
            )
          },

          /* Anchor */
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet underline underline-offset-2 hover:text-violet-light"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
