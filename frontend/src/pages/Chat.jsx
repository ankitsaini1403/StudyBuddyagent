import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChat } from '../hooks/useChat.js'
import Sidebar   from '../components/Sidebar.jsx'
import Navbar    from '../components/Navbar.jsx'
import ChatBox   from '../components/ChatBox.jsx'
import ChatInput from '../components/ChatInput.jsx'

export default function Chat() {
  const { sessionId }  = useParams()
  const navigate       = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    sessions, activeSessionId, messages,
    subject, mode, isLoading,
    setSubject, setMode,
    setActiveSession, deleteSession,
    sendMessage, abort,
  } = useChat()

  
  useEffect(() => {
    if (sessionId && sessionId !== activeSessionId) {
      const exists = sessions.find((s) => s.id === sessionId)
      if (exists) setActiveSession(sessionId)
      else navigate('/chat', { replace: true })
    }
  }, [sessionId, sessions])

  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const activeSubject = activeSession?.subject ?? subject
  const activeMode    = activeSession?.mode    ?? mode

  const handleNewChat = () => navigate('/')

  const handleSelectSession = (id) => {
    setActiveSession(id)
    navigate(`/chat/${id}`)
  }

  /* Empty state when no session is active */
  if (!activeSessionId || !activeSession) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          subject={subject}
          mode={mode}
          onSetSubject={setSubject}
          onSetMode={setMode}
          onSelectSession={handleSelectSession}
          onDeleteSession={deleteSession}
          onNewChat={handleNewChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-night">
          <span className="text-5xl select-none">🦉</span>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-200 mb-2">No session selected</h2>
            <p className="text-slate-500 text-sm mb-6">Start a new chat or pick one from the sidebar.</p>
            <button
              onClick={handleNewChat}
              className="btn-primary"
            >
              + New Chat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        subject={subject}
        mode={mode}
        onSetSubject={setSubject}
        onSetMode={setMode}
        onSelectSession={handleSelectSession}
        onDeleteSession={deleteSession}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 bg-night overflow-hidden">
        {/* Top nav */}
        <Navbar
          subject={activeSubject}
          mode={activeMode}
          sessionTitle={activeSession.title}
          onMenuToggle={() => setSidebarOpen(true)}
          isLoading={isLoading}
        />

        {/* Messages */}
        <ChatBox
          messages={messages}
          subject={activeSubject}
          mode={activeMode}
          isLoading={isLoading}
          topic={activeSession.title}
        />

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onAbort={abort}
          isLoading={isLoading}
          subject={activeSubject}
          disabled={false}
        />
      </div>
    </div>
  )
}
