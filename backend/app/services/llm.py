"""
Wrapper around the Groq-hosted LLM, exposed both as a raw client (for the
Groq SDK) and as a LangChain-compatible chat model (for use in the agent graph).
"""
from functools import lru_cache

from groq import Groq
from langchain_groq import ChatGroq

from app.core.config import settings
from app.core.logging import get_logger
from app.utils.constants import DEFAULT_AGENT_TEMPERATURE

logger = get_logger(__name__)


@lru_cache
def get_groq_client() -> Groq:
    """Raw Groq SDK client, useful for one-off completions outside the agent graph."""
    return Groq(api_key=settings.GROQ_API_KEY)


@lru_cache
def get_chat_model(temperature: float = DEFAULT_AGENT_TEMPERATURE) -> ChatGroq:
    """LangChain-compatible chat model backed by Groq, used by the LangGraph agent."""
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=temperature,
    )


async def simple_completion(prompt: str, system: str | None = None, temperature: float = 0.3) -> str:
    """Convenience helper for a single-shot completion (e.g. quiz generation)."""
    client = get_groq_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=messages,
        temperature=temperature,
    )
    return response.choices[0].message.content or ""
