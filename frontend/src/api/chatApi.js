import api from './axios'

// POST /api/chat  -> { message, session_id, use_rag }
// returns { session_id, reply, history: [{role, content}] }
export const sendChatMessage = async ({ message, sessionId = null, useRag = true }) => {
  const res = await api.post('/chat', {
    message,
    session_id: sessionId,
    use_rag: useRag,
  })
  return res.data
}
