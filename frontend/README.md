# 🦉 StudyBuddy Frontend

AI-powered study agent built with React + Vite + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with auth interceptors
├── components/
│   ├── ChatBox.jsx        # Scrollable message list
│   ├── ChatInput.jsx      # Textarea + send/abort button
│   ├── Sidebar.jsx        # Session list, subject & mode pickers
│   ├── Navbar.jsx         # Top bar with session info
│   ├── Message.jsx        # Individual chat bubble (user / AI)
│   ├── Markdown.jsx       # Renders AI markdown responses
│   └── Loader.jsx         # TypingDots, Spinner, PageLoader
├── pages/
│   ├── Home.jsx           # Onboarding — pick subject/mode/topic
│   ├── Login.jsx          # Sign in / Sign up
│   └── Chat.jsx           # Main chat layout (Sidebar + messages)
├── hooks/
│   └── useChat.js         # All chat logic, API calls, session mgmt
├── context/
│   └── ChatContext.jsx    # Global state via useReducer
├── App.jsx                # Router + auth guard
├── main.jsx               # Entry point
└── index.css              # Tailwind + custom design tokens
```

## Environment

Create a `.env` file to point at your backend:

```env
VITE_API_URL=http://localhost:8000/api
```

Without a backend, the app falls back to calling the Anthropic API directly.

## Backend API contract

```
POST /api/auth/login    { email, password }       → { token, user }
POST /api/auth/signup   { name, email, password } → { token, user }
POST /api/chat          { session_id, subject, mode, messages } → { content }
```

## Tech Stack

- React 18 + React Router v6
- Vite 5
- Tailwind CSS 3
- react-markdown + remark-gfm
- Axios
