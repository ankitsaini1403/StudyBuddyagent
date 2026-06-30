import api from './axios'

// POST /api/notes  -> { title, content, tags }
export const createNote = async ({ title, content, tags = [] }) => {
  const res = await api.post('/notes', { title, content, tags })
  return res.data
}

// POST /api/notes/upload  -> multipart/form-data, field name "file"
export const uploadNoteFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// GET /api/notes
export const listNotes = async () => {
  const res = await api.get('/notes')
  return res.data
}

// GET /api/notes/:id
export const getNote = async (noteId) => {
  const res = await api.get(`/notes/${noteId}`)
  return res.data
}

// PUT /api/notes/:id  -> any of { title, content, tags }
export const updateNote = async (noteId, updates) => {
  const res = await api.put(`/notes/${noteId}`, updates)
  return res.data
}

// DELETE /api/notes/:id
export const deleteNote = async (noteId) => {
  await api.delete(`/notes/${noteId}`)
}
