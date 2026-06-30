"""
Retrieval-Augmented-Generation helpers: chunking + indexing source text,
and building grounded context blocks for the agent.
"""
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.logging import get_logger
from app.services.vectorstore import add_documents, similarity_search
from app.utils.constants import DEFAULT_RAG_TOP_K

logger = get_logger(__name__)

_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150,
    separators=["\n\n", "\n", ". ", " ", ""],
)


def index_text(text: str, user_id: str, note_id: str, source_filename: str | None = None) -> int:
    """Chunk and embed a piece of text (e.g. an uploaded PDF or saved note) into the vectorstore."""
    chunks = _splitter.split_text(text)
    if not chunks:
        return 0

    metadatas = [
        {"user_id": user_id, "note_id": note_id, "source_filename": source_filename or "", "chunk_index": i}
        for i in range(len(chunks))
    ]
    ids = [f"{note_id}_{i}" for i in range(len(chunks))]

    add_documents(texts=chunks, metadatas=metadatas, ids=ids)
    logger.info("Indexed %d chunks for note_id=%s", len(chunks), note_id)
    return len(chunks)


def retrieve_context(query: str, user_id: str, k: int = DEFAULT_RAG_TOP_K) -> str:
    """Retrieve relevant chunks for a query and format them as a single context block."""
    docs = similarity_search(query, k=k, user_id=user_id)
    if not docs:
        return ""

    parts = []
    for i, doc in enumerate(docs, start=1):
        source = doc.metadata.get("source_filename") or "note"
        parts.append(f"[Source {i}: {source}]\n{doc.page_content}")
    return "\n\n".join(parts)
