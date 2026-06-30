"""
Internal data models representing MongoDB documents.
These are plain dataclass-like models used for DB <-> Python conversion,
distinct from the API-facing Pydantic schemas in schemas.py.
"""
from dataclasses import dataclass, field

from app.utils.helper import generate_uuid, utc_now


@dataclass
class UserModel:
    email: str
    hashed_password: str
    full_name: str | None = None
    id: str = field(default_factory=generate_uuid)
    is_active: bool = True
    created_at: str = field(default_factory=lambda: utc_now().isoformat())

    def to_dict(self) -> dict:
        return {
            "_id": self.id,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "full_name": self.full_name,
            "is_active": self.is_active,
            "created_at": self.created_at,
        }


@dataclass
class NoteModel:
    user_id: str
    title: str
    content: str
    id: str = field(default_factory=generate_uuid)
    source_filename: str | None = None
    tags: list[str] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: utc_now().isoformat())
    updated_at: str = field(default_factory=lambda: utc_now().isoformat())

    def to_dict(self) -> dict:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "content": self.content,
            "source_filename": self.source_filename,
            "tags": self.tags,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


@dataclass
class QuizQuestionModel:
    question: str
    options: list[str]
    correct_answer: str
    explanation: str | None = None


@dataclass
class QuizModel:
    user_id: str
    topic: str
    difficulty: str
    questions: list[QuizQuestionModel]
    id: str = field(default_factory=generate_uuid)
    note_id: str | None = None
    created_at: str = field(default_factory=lambda: utc_now().isoformat())

    def to_dict(self) -> dict:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "topic": self.topic,
            "difficulty": self.difficulty,
            "questions": [q.__dict__ for q in self.questions],
            "note_id": self.note_id,
            "created_at": self.created_at,
        }


@dataclass
class ChatMessageModel:
    role: str  # "user" | "assistant" | "system" | "tool"
    content: str
    created_at: str = field(default_factory=lambda: utc_now().isoformat())


@dataclass
class ChatSessionModel:
    user_id: str
    id: str = field(default_factory=generate_uuid)
    title: str = "New Chat"
    messages: list[ChatMessageModel] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: utc_now().isoformat())
    updated_at: str = field(default_factory=lambda: utc_now().isoformat())

    def to_dict(self) -> dict:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "messages": [m.__dict__ for m in self.messages],
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
