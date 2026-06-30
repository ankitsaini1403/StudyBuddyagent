"""
Chroma vector store wrapper used for storing and retrieving note embeddings.
"""
from functools import lru_cache

from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.core.config import settings
from app.core.logging import get_logger
from app.services.embeddings import get_embedding_model
from app.utils.constants import DEFAULT_RAG_TOP_K

logger = get_logger(__name__)


@lru_cache
def get_vectorstore() -> Chroma:
    logger.info(
        "Initializing Chroma vectorstore (dir=%s, collection=%s)",
        settings.CHROMA_PERSIST_DIR,
        settings.CHROMA_COLLECTION_NAME,
    )
    return Chroma(
        collection_name=settings.CHROMA_COLLECTION_NAME,
        embedding_function=get_embedding_model(),
        persist_directory=settings.CHROMA_PERSIST_DIR,
    )


def add_documents(texts: list[str], metadatas: list[dict], ids: list[str]) -> None:
    """Embed and persist a batch of text chunks into the vectorstore."""
    store = get_vectorstore()
    documents = [Document(page_content=t, metadata=m) for t, m in zip(texts, metadatas)]
    store.add_documents(documents=documents, ids=ids)


def similarity_search(
    query: str,
    k: int = DEFAULT_RAG_TOP_K,
    user_id: str | None = None,
) -> list[Document]:
    """Retrieve the top-k most relevant chunks, optionally scoped to a single user."""
    store = get_vectorstore()
    filter_ = {"user_id": user_id} if user_id else None
    return store.similarity_search(query, k=k, filter=filter_)


def delete_by_note_id(note_id: str) -> None:
    store = get_vectorstore()
    store.delete(where={"note_id": note_id})
