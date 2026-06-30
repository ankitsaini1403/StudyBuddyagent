import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ChatProvider } from './context/ChatContext.jsx'
import Home  from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Chat  from './pages/Chat.jsx'
import Notes from './pages/Notes.jsx'


function RequireAuth({ children }) {
  const token = localStorage.getItem('sb_token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/chat/:sessionId?"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />
          <Route
            path="/notes"
            element={
              <RequireAuth>
                <Notes />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  )
}
