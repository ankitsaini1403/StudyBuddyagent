"""
Word/character/sentence counting tool exposed to the LangGraph agent.
"""
import re

from langchain_core.tools import tool


@tool
def word_count(text: str) -> str:
    """
    Count words, characters, and sentences in the given text.
    Useful when the user asks things like "how many words are in this note?".
    """
    words = re.findall(r"\b\w+\b", text)
    sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]

    return (
        f"Words: {len(words)} | "
        f"Characters (no spaces): {len(text.replace(' ', ''))} | "
        f"Characters (with spaces): {len(text)} | "
        f"Sentences: {len(sentences)}"
    )
