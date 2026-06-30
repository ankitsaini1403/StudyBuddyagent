<<<<<<< HEAD
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

=======
�
� StudyBuddyAgent
StudyBuddyAgent is an AI-powered study assistant that helps students learn more effectively through
conversational tutoring, Retrieval-Augmented Generation (RAG), note management, quiz generation, and
flashcards.
Built with FastAPI, LangGraph, React, and modern AI tooling, StudyBuddyAgent enables users to upload
notes, chat with an intelligent tutor, generate quizzes, and retrieve answers grounded in their own study
materials.
✨ Features
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
�
� AI-powered tutoring assistant
📄 Upload and analyze PDF, TXT, and Markdown notes
🔍 Retrieval-Augmented Generation (RAG)
🧠 Personalized learning experience
📝 Automatic quiz generation
🎴 Flashcard generation
💬 Multi-session chat support
🔐 JWT Authentication
📚 Note management system
📊 Conversation history tracking
🏗️ Architecture
Frontend (React + Vite)
│
▼
Backend API (FastAPI)
│
▼
LangGraph Agent
│
┌──────┼─────────┐
▼      
▼         
RAG   Tools     
│
▼
ChromaDB
│
▼
Memory
1
▼
MongoDB
🛠️ Tech Stack
Layer
Frontend
Backend
Technology
React 18, Vite, Tailwind CSS
FastAPI
Agent Framework LangGraph, LangChain
LLM
Groq (Llama 3.3 70B Versatile)
Embeddings
HuggingFace Sentence Transformers
Vector Database
ChromaDB
Database
MongoDB
Authentication
JWT + Bcrypt
API Client
Axios
📂 Project Structure
StudyBuddyAgent/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── agent/
│   │   ├── tools/
│   │   ├── database/
│   │   ├── services/
│   │   ├── core/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── chroma_db/
│   ├── tests/
│   └── requirements.txt
2
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
🚀 Backend Setup
1. Create Virtual Environment
python-m venv venv
Windows
venv\Scripts\activate
Linux / Mac
source venv/bin/activate
2. Install Dependencies
pip install-r requirements.txt
3. Configure Environment Variables
Create a 
.env file:
3
GROQ_API_KEY=your_groq_api_key
JWT_SECRET_KEY=your_secret_key
MONGODB_URI=mongodb://localhost:27017
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
4. Run Backend
uvicorn app.main:app--reload
Backend API:
http://localhost:8000
Swagger Documentation:
http://localhost:8000/docs
🎨 Frontend Setup
Install Dependencies
npm install
Configure Environment
Create a 
.env file:
VITE_API_URL=http://localhost:8000/api
Run Frontend
npm run dev
4
Frontend URL:
http://localhost:5173
💬 Core Workflows
Chat Assistant
Endpoint
POST /api/chat
The LangGraph agent:
• 
• 
• 
• 
Retrieves relevant note chunks using RAG
Uses tools when required
Maintains conversational memory
Stores sessions in MongoDB
Supported Tools
• 
• 
• 
• 
• 
Calculator
Word Counter
PDF Reader
Web Search
Flashcard Generator
Notes Management
Create Note
POST /api/notes
Upload Notes
POST /api/notes/upload
5
Supported formats:
• 
• 
• 
PDF
TXT
MD
Manage Notes
GET /api/notes/{id}
PUT /api/notes/{id}
DELETE /api/notes/{id}
Quiz Generation
Endpoint
POST /api/quiz/generate
Generates:
• 
• 
• 
Multiple Choice Questions
Topic-Based Assessments
Revision Tests
🔐 Authentication
Register
POST /api/auth/register
Login
POST /api/auth/login
6
Refresh Token
POST /api/auth/refresh
Current User
GET /api/auth/me
Protected routes require:
Authorization: Bearer <access_token>
🧪 Testing
Run all tests:
pytest-v
📈 Scalability Notes
• 
• 
• 
• 
• 
• 
• 
• 
Embeddings run locally by default.
Easily switch to larger embedding models.
ChromaDB can be replaced with:
Qdrant
Pinecone
Hosted Chroma
MongoDB Atlas supported.
Serper API can be used for improved web search quality.
🎯 Future Enhancements
• 
• 
• 
• 
�
�️ Voice Tutor
📱 Mobile Application
🖼️ OCR for Images
📊 Learning Analytics Dashboard
7
• 
• 
• 
• 
�
�‍🏫 Personalized Study Plans
🌍 Multi-Language Support
🤖 Multi-Agent Collaboration
📚 Automatic Course Generation
👨‍💻 Author
Ankit Saini
B.Tech Student | Full Stack Developer | AI Enthusiast
GitHub: https://github.com/ankitsaini1403
⭐ Support
If you find this project useful, please consider giving it a star on GitHub.
Happy Learning! 🚀📚
>>>>>>> d3b38dc (frontend ready for deployment)
