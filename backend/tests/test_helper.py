
from app.utils.helper import chunk_text, is_allowed_upload, safe_filename, truncate


def test_is_allowed_upload():
    assert is_allowed_upload("notes.pdf") is True
    assert is_allowed_upload("notes.txt") is True
    assert is_allowed_upload("notes.exe") is False


def test_safe_filename_strips_path_and_unsafe_chars():
    result = safe_filename("../../etc/passwd; rm -rf.txt")
    assert "/" not in result
    assert ";" not in result
    assert result.endswith(".txt")


def test_chunk_text_overlap():
    text = "a" * 2500
    chunks = chunk_text(text, chunk_size=1000, overlap=150)
    assert len(chunks) >= 3
    assert all(len(c) <= 1000 for c in chunks)


def test_truncate():
    assert truncate("short text") == "short text"
    long_text = "x" * 600
    truncated = truncate(long_text, max_chars=500)
    assert truncated.endswith("...")
    assert len(truncated) <= 504
