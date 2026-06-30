import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getCurrentUser, isAuthenticated } from '../api/authApi'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([]) // [{id, title, subject, mode, createdAt}]
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messages, setMessages] = useState({}) // { [sessionId]: [{id, role, content, ts}] }
  const [subject, setSubject] = useState(null)
  const [mode, setMode] = useState('tutor')
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  // Load the logged-in user once on mount (if a token exists)
  useEffect(() => {
    if (!isAuthenticated()) return
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const createSession = useCallback((session) => {
    setSessions((prev) => [session, ...prev])
    setMessages((prev) => ({ ...prev, [session.id]: [] }))
    setActiveSessionId(session.id)
  }, [])

  const appendMessage = useCallback((sessionId, message) => {
    setMessages((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] ?? []), message],
    }))
  }, [])

  // Updates the content of the most recent message in a session (used to fill in the AI reply)
  const patchLastMessage = useCallback((sessionId, content) => {
    setMessages((prev) => {
      const sessionMessages = prev[sessionId] ?? []
      if (sessionMessages.length === 0) return prev
      const updated = [...sessionMessages]
      updated[updated.length - 1] = { ...updated[updated.length - 1], content }
      return { ...prev, [sessionId]: updated }
    })
  }, [])

  const setActiveSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId)
  }, [])

  const deleteSession = useCallback(
    (sessionId) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setMessages((prev) => {
        const next = { ...prev }
        delete next[sessionId]
        return next
      })
      if (activeSessionId === sessionId) setActiveSessionId(null)
    },
    [activeSessionId]
  )

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        messages,
        subject,
        mode,
        isLoading,
        error,
        user,
        setSubject,
        setMode,
        setLoading,
        setError,
        clearError,
        createSession,
        appendMessage,
        patchLastMessage,
        setActiveSession,
        deleteSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within a ChatProvider')
  return ctx
}
