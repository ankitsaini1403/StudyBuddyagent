import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteUpload from '../components/NoteUpload'
import { listNotes, deleteNote } from '../api/notesApi'

export default function Notes() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotes = async () => {
    setLoading(true)
    try {
      const data = await listNotes()
      setNotes(data)
    } catch (err) {
      setError(err.message || 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleUploaded = (note) => {
    setNotes((prev) => [note, ...prev])
  }

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId)
      setNotes((prev) => prev.filter((n) => n.id !== noteId))
    } catch (err) {
      setError(err.message || 'Failed to delete note')
    }
  }

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-ink">
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">🦉</span>
          <span className="font-extrabold text-white tracking-tight">StudyBuddy</span>
        </div>
        <button onClick={() => navigate('/')} className="btn-ghost text-sm">
          ← Home
        </button>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-2xl font-extrabold text-white mb-1">My notes</h1>
          <p className="text-slate-400 text-sm mb-6">
            Upload files or paste text — your study agent will use these to answer questions.
          </p>

          <NoteUpload onUploaded={handleUploaded} />

          {error && <p className="text-sm text-red-400 mt-4 text-center">{error}</p>}

          <div className="mt-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {loading ? 'Loading…' : `${notes.length} note${notes.length === 1 ? '' : 's'}`}
            </h2>

            {!loading && notes.length === 0 && (
              <p className="text-sm text-slate-600">No notes yet — upload your first one above.</p>
            )}

            <ul className="flex flex-col gap-2">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-center justify-between bg-night-700 border border-ink rounded-xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{note.title}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {note.content.slice(0, 80)}
                      {note.content.length > 80 ? '…' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="flex-shrink-0 text-xs text-slate-500 hover:text-red-400 transition-colors ml-3"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
