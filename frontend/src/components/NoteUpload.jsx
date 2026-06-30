import { useRef, useState } from 'react'
import { uploadNoteFile, createNote } from '../api/notesApi'

const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md', '.docx']

export default function NoteUpload({ onUploaded }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Manual "paste text" fallback, since not everyone uploads a file
  const [showTextForm, setShowTextForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const isAllowed = (filename) =>
    ALLOWED_EXTENSIONS.some((ext) => filename.toLowerCase().endsWith(ext))

  const handleFile = async (file) => {
    setError('')
    if (!isAllowed(file.name)) {
      setError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`)
      return
    }

    setUploading(true)
    try {
      const note = await uploadNoteFile(file)
      onUploaded?.(note)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = '' // allow re-uploading the same file name
  }

  const handleTextSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setUploading(true)
    setError('')
    try {
      const note = await createNote({ title: title.trim(), content: content.trim() })
      onUploaded?.(note)
      setTitle('')
      setContent('')
      setShowTextForm(false)
    } catch (err) {
      setError(err.message || 'Failed to save note')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2
          border-2 border-dashed rounded-2xl p-8 cursor-pointer
          transition-all duration-150 text-center
          ${dragActive ? 'border-violet bg-night-600' : 'border-ink bg-night-700 hover:border-slate-600'}
        `}
      >
        <span className="text-3xl">📄</span>
        <p className="text-sm font-semibold text-slate-300">
          {uploading ? 'Uploading…' : 'Drop a file here or click to browse'}
        </p>
        <p className="text-xs text-slate-500">PDF, TXT, MD, or DOCX</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-400 mt-3 text-center">{error}</p>}

      {/* Toggle: paste text instead */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setShowTextForm((v) => !v)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {showTextForm ? 'Cancel' : 'Or paste text directly →'}
        </button>
      </div>

      {showTextForm && (
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base"
            required
          />
          <textarea
            placeholder="Paste your notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="input-base resize-none"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: '#6C63FF', boxShadow: '0 4px 16px #6C63FF55' }}
          >
            {uploading ? 'Saving…' : 'Save note'}
          </button>
        </form>
      )}
    </div>
  )
}
