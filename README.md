# 🦉 StudyBuddyAgent

An AI-powered study assistant that combines **FastAPI**, **LangGraph**, **Retrieval-Augmented Generation (RAG)**, and a modern **React** UI to help students learn more effectively.

Users can chat with an AI tutor, upload notes and PDFs, get answers grounded in their own study material, generate quizzes automatically, create flashcards from notes, and manage learning sessions with authentication.

## 🔗 Live Demo

- **Frontend:** [study-buddyagent-5hmd.vercel.app](https://study-buddyagent-5hmd.vercel.app)
- **Backend API:** [studybuddyagent-production.up.railway.app](https://studybuddyagent-production.up.railway.app)
- **API Docs (Swagger):** [studybuddyagent-production.up.railway.app/docs](https://studybuddyagent-production.up.railway.app/docs)

## ✨ Features

- 🤖 **AI Tutor Chat** — LangGraph-powered agent with context-aware conversations and session memory stored in MongoDB
- 📄 **Retrieval-Augmented Generation (RAG)** — upload notes and PDFs, get answers grounded in your own material via semantic search
- 📝 **Quiz Generator** — auto-generate multiple-choice questions from specific notes or your whole study set
- 🎴 **Flashcard Generation** — turn notes into quick-revision flashcards
- 🔐 **Authentication** — JWT access + refresh tokens, password hashing with bcrypt
- 💬 **Multi-session chat** with conversation history tracking

## 🛠 Tech Stack

### Backend

| Component | Technology |
|---|---|
| API Framework | FastAPI |
| Agent Framework | LangGraph + LangChain |
| LLM | Groq (Llama 3.3 70B Versatile) |
| Embeddings | HuggingFace Sentence Transformers |
| Vector Database | ChromaDB |
| Database | MongoDB |
| Authentication | JWT + bcrypt |
| Deployment | Railway |

### Frontend

| Component | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Markdown Rendering | react-markdown |
| HTTP Client | Axios |
| Deployment | Vercel |

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   ├── agent/
│   ├── tools/
│   ├── database/
│   ├── services/
│   ├── core/
│   ├── utils/
│   └── main.py
├── uploads/
├── chroma_db/
├── tests/
└── requirements.txt

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## ⚙️ Backend Setup (Local Development)

**1. Create a virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Configure environment variables**

Create a `.env` file in `backend/`:
```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET_KEY=your_secret_key
MONGODB_URI=mongodb://localhost:27017
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

**4. Run the backend**
```bash
uvicorn app.main:app --reload
```

- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`

## 🎨 Frontend Setup (Local Development)

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment**

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:8000/api
```

**3. Run the frontend**
```bash
npm run dev
```

Frontend: `http://localhost:5173`

> **Note:** All backend routes are served under the `/api` prefix (e.g. `/api/auth/login`, `/api/chat`). Make sure `VITE_API_URL` includes `/api` at the end, both locally and in your deployment platform's environment variables.

## 🔌 API Endpoints

**Authentication**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

**Chat**
```
POST /api/chat
```

**Notes**
```
POST   /api/notes
POST   /api/notes/upload
GET    /api/notes/{id}
PUT    /api/notes/{id}
DELETE /api/notes/{id}
```

**Quiz**
```
POST /api/quiz/generate
```

Protected routes require:
```
Authorization: Bearer <access_token>
```

## 🧠 Core Workflow

1. User uploads notes or PDFs
2. Documents are chunked and embedded using HuggingFace models
3. Embeddings are stored in ChromaDB
4. User sends a query through the chat interface
5. Relevant document chunks are retrieved via semantic search
6. The LangGraph agent reasons over the retrieved context
7. Tools are invoked when needed (calculator, web search, PDF reader, etc.)
8. The final response is returned and the conversation is stored in MongoDB

## 🧪 Testing

```bash
pytest -v
```

## 📈 Scaling Notes

- Upgrade embedding models for better retrieval quality
- Move embedding generation to GPU workers
- Replace local ChromaDB with a hosted vector store (Qdrant, Pinecone, Chroma Cloud)
- Use MongoDB Atlas for production deployments
- Add Redis caching for improved response times

## 🎯 Future Enhancements

- 🎙️ Voice tutor
- 📱 Mobile application
- 🖼️ OCR for images
- 📊 Learning analytics dashboard
- 👨‍🏫 Personalized study plans
- 🌍 Multi-language support
- 🤖 Multi-agent collaboration
- 📚 Automatic course generation

## 👨‍💻 Author

**Ankit Saini**
B.Tech Student | Full Stack Developer | AI Enthusiast
GitHub: [github.com/ankitsaini1403](https://github.com/ankitsaini1403)

## ⭐ Support

If you find this project useful, consider giving it a star on GitHub. Happy learning! 🚀📚

