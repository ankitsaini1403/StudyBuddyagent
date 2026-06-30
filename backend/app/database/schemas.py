"""
Pydantic schemas used for API request validation and response serialization.
"""
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str | None = None


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str | None = None
    is_active: bool


# ---------- Chat ----------
class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    session_id: str | None = None
    use_rag: bool = True


class ChatMessageResponse(BaseModel):
    role: str
    content: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    history: list[ChatMessageResponse]


# ---------- Notes ----------
class NoteCreateRequest(BaseModel):
    title: str
    content: str
    tags: list[str] = Field(default_factory=list)


class NoteUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    tags: list[str] | None = None


class NoteResponse(BaseModel):
    id: str
    title: str
    content: str
    tags: list[str]
    source_filename: str | None = None
    created_at: str
    updated_at: str


# ---------- Quiz ----------
class QuizGenerateRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    num_questions: int = Field(default=5, ge=1, le=20)
    note_id: str | None = None


class QuizQuestionResponse(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    explanation: str | None = None


class QuizResponse(BaseModel):
    id: str
    topic: str
    difficulty: str
    questions: list[QuizQuestionResponse]
    created_at: str


# ---------- Health ----------
class HealthResponse(BaseModel):
    status: str
    mongodb: bool
    vectorstore: bool
