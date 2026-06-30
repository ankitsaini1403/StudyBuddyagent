"""
Local, free embeddings powered by a HuggingFace sentence-transformers model.
"""
from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


@lru_cache
def get_embedding_model() -> HuggingFaceEmbeddings:
    """
    Returns a cached HuggingFace embedding model instance.
    Runs locally on CPU by default -- no API key or network calls required at inference time.
    """
    logger.info("Loading embedding model: %s", settings.EMBEDDING_MODEL)
    return HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )


def embed_query(text: str) -> list[float]:
    return get_embedding_model().embed_query(text)


def embed_documents(texts: list[str]) -> list[list[float]]:
    return get_embedding_model().embed_documents(texts)
