# 🦉 StudyBuddyAgent

An AI-powered study assistant that combines FastAPI, LangGraph, Retrieval-Augmented Generation (RAG), and modern React UI to help students learn more effectively.

Users can:

* Chat with an AI tutor
* Upload notes and PDFs
* Get answers grounded in their own study material
* Generate quizzes automatically
* Create flashcards from notes
* Manage learning sessions with authentication

---

# 🚀 Features

## AI Tutor Chat

* LangGraph-powered agent workflow
* Context-aware conversations
* Session memory stored in MongoDB
* Tool calling support

## Retrieval-Augmented Generation (RAG)

* Upload notes and PDFs
* Automatic text chunking and embedding
* Semantic search using ChromaDB
* Answers grounded in user content

## Quiz Generator

* Generate multiple-choice questions
* Create quizzes from specific notes
* Study-wide quiz generation

## Flashcard Generation

* AI-generated flashcards
* Quick revision workflow

## Authentication

* JWT Access Tokens
* Refresh Tokens
* Password hashing with bcrypt

---

# 🛠 Tech Stack

## Backend

| Component       | Technology                        |
| --------------- | --------------------------------- |
| API Framework   | FastAPI                           |
| Agent Framework | LangGraph + LangChain             |
| LLM             | Groq (Llama 3.3 70B Versatile)    |
| Embeddings      | HuggingFace Sentence Transformers |
| Vector Database | ChromaDB                          |
| Database        | MongoDB                           |
| Authentication  | JWT + bcrypt                      |

## Frontend

| Component          | Technology      |
| ------------------ | --------------- |
| Framework          | React 18        |
| Build Tool         | Vite            |
| Styling            | Tailwind CSS    |
| Routing            | React Router v6 |
| Markdown Rendering | react-markdown  |
| HTTP Client        | Axios           |

---

# 📁 Project Structure

```text
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
```

---

# ⚙️ Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Configure Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET_KEY=your_secret_key
MONGODB_URI=mongodb://localhost:27017
```

## Start Backend

```bash
uvicorn app.main:app --reload
```

API Documentation:

```text
http://localhost:8000/docs
```

---

# 🎨 Frontend Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Run development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

## Chat

```http
POST /api/chat
```

## Notes

```http
POST   /api/notes
POST   /api/notes/upload
GET    /api/notes/{id}
PUT    /api/notes/{id}
DELETE /api/notes/{id}
```

## Quiz

```http
POST /api/quiz/generate
```

---

# 🧠 Core Workflow

1. User uploads notes or PDFs.
2. Documents are embedded using HuggingFace models.
3. Embeddings are stored in ChromaDB.
4. User sends a query.
5. Relevant document chunks are retrieved.
6. LangGraph agent reasons over retrieved context.
7. Tools may be invoked when needed.
8. Final response is returned and conversation is stored.

---

# 📈 Scaling Notes

* Upgrade embedding models for better retrieval quality.
* Move embedding generation to GPU workers.
* Replace local ChromaDB with hosted solutions such as Qdrant, Pinecone, or Chroma Cloud.
* Use MongoDB Atlas for production deployments.
* Add Redis caching for improved response times.

---

# 🧪 Testing

```bash
pytest -v
```

---

# 👨‍💻 Author

Ankit Saini

Built using FastAPI, LangGraph, React, RAG, and modern AI engineering practices.

