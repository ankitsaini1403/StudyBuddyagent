"""
Generic helper functions used across the application.
"""
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

from app.utils.constants import ALLOWED_UPLOAD_EXTENSIONS


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def is_allowed_upload(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_UPLOAD_EXTENSIONS


def safe_filename(filename: str) -> str:
    """Strip path components and unsafe characters from a user-supplied filename."""
    name = Path(filename).name
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    return f"{generate_uuid()}_{name}"


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 150) -> list[str]:
    """Naive sliding-window text chunker used as a fallback to LangChain splitters."""
    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than overlap")

    chunks = []
    start = 0
    text_len = len(text)
    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def truncate(text: str, max_chars: int = 500) -> str:
    return text if len(text) <= max_chars else text[:max_chars].rstrip() + "..."
