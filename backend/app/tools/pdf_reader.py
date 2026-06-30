"""
PDF text extraction, used both as an internal utility (notes upload route)
and as an agent tool (when the user references an already-uploaded file path).
"""
from pathlib import Path

from langchain_core.tools import tool
from pypdf import PdfReader

from app.core.logging import get_logger

logger = get_logger(__name__)


def extract_text_from_pdf(file_path: str) -> str:
    """Extract and concatenate text from every page of a PDF file."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found at {file_path}")

    reader = PdfReader(str(path))
    pages_text = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages_text.append(text)
        else:
            logger.debug("Page %d of %s had no extractable text", i, file_path)

    return "\n\n".join(pages_text)


@tool
def pdf_reader(file_path: str) -> str:
    """
    Read and extract text content from a PDF file on the server given its file path.
    Use this only when the user refers to a specific uploaded PDF that needs to be re-read.
    """
    try:
        text = extract_text_from_pdf(file_path)
        return text if text else "No extractable text found in this PDF (it may be scanned/image-based)."
    except Exception as exc:  # noqa: BLE001
        return f"Error reading PDF: {exc}"
