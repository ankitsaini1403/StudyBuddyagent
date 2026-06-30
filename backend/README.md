# AI Study Agent — Backend

An AI-powered study assistant backend built with **FastAPI**, **LangGraph**, and **RAG**.
It lets users chat with a tutor agent, upload notes/PDFs, get answers grounded in their own
material, and auto-generate quizzes and flashcards.

## Stack

| Concern         | Technology                                      |
|------------------|--------------------------------------------------|
| API framework    | FastAPI                                          |
| Agent framework  | LangGraph + LangChain                            |
| LLM              | Groq (`llama-3.3-70b-versatile` by default)      |
| Embeddings       | HuggingFace `sentence-transformers` (local, free)|
| Vector store     | ChromaDB (persisted to disk)                     |
| Database         | MongoDB (via Motor, async)                       |
| Auth             | JWT (access + refresh tokens), bcrypt hashing    |

## Project Structure

```
backend/
├── app/
│   ├── api/            # Route definitions + router aggregation
│   ├── agent/           # LangGraph agent: state, nodes, graph, prompts, memory
│   ├── tools/            # Agent tools: calculator, word_count, pdf_reader, search, flashcard
│   ├── database/        # MongoDB connection, models, Pydantic schemas
│   ├── services/        # LLM, embeddings, vectorstore, RAG orchestration
│   ├── core/             # Config, security (JWT/hashing), logging
│   ├── utils/            # Shared constants and helper functions
│   └── main.py           # FastAPI app entrypoint
├── uploads/              # Uploaded files (PDFs, etc.)
├── chroma_db/            # Persisted Chroma vector store
├── tests/                # Pytest suite
└── requirements.txt
```

## Setup

1. **Install dependencies**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure environment**
   Copy `.env` and fill in real values, at minimum:
   ```
   GROQ_API_KEY=your_real_groq_key
   JWT_SECRET_KEY=a_long_random_secret
   MONGODB_URI=mongodb://localhost:27017
   ```

3. **Run MongoDB** locally (or point `MONGODB_URI` at a hosted instance, e.g. MongoDB Atlas).

4. **Start the server**
   ```bash
   uvicorn app.main:app --reload
   ```
   API docs available at `http://localhost:8000/docs`.

## Core Flows

### Chat (RAG-grounded agent)
`POST /api/chat` — sends a message to the LangGraph agent. The agent:
1. Retrieves relevant chunks from the user's notes (if `use_rag=true`).
2. Reasons over the message + context, optionally calling tools (calculator, word count,
   web search, flashcard generator).
3. Persists the conversation turn to MongoDB for session continuity.

### Notes
`POST /api/notes` — save a text note (auto-indexed into the vector store).
`POST /api/notes/upload` — upload a PDF/txt/md file; text is extracted and indexed.
`GET/PUT/DELETE /api/notes/{id}` — manage notes (deleting also removes its vector chunks).

### Quiz
`POST /api/quiz/generate` — generates multiple-choice questions from a specific note,
or from retrieved context across all of the user's notes if no `note_id` is given.

### Auth
`POST /api/auth/register`, `/login`, `/refresh`, `GET /api/auth/me` — standard JWT flow.
Pass the access token as `Authorization: Bearer <token>` on protected routes.

## Testing

```bash
pytest -v
```

## Notes on Scaling

- Embeddings run **locally on CPU** by default (`sentence-transformers/all-MiniLM-L6-v2`).
  Swap `EMBEDDING_MODEL` in `.env` for a larger model if you need better retrieval quality,
  or move embedding to a GPU worker for higher throughput.
- The web search tool falls back to a no-API-key DuckDuckGo scrape; set `SEARCH_API_KEY`
  (Serper.dev) in `.env` for more reliable results.
- Chroma persists to disk (`chroma_db/`) by default; swap for a hosted Chroma/Qdrant/Pinecone
  instance for multi-instance deployments.
