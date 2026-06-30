"""
Flashcard generation tool: turns study text into Q/A flashcards using the LLM.
Exposed both as an agent tool and as a plain function for the quiz route.
"""
import json
import re

from langchain_core.tools import tool

from app.core.logging import get_logger
from app.services.llm import get_chat_model

logger = get_logger(__name__)

_FLASHCARD_PROMPT = """You are a study assistant. Generate {count} flashcards from the text below.
Return ONLY a JSON array, no preamble, no markdown fences. Each item must have exactly:
"question" (string) and "answer" (string).

TEXT:
\"\"\"{text}\"\"\"
"""


def _parse_json_array(raw: str) -> list[dict]:
    cleaned = re.sub(r"^```(json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            return data
    except json.JSONDecodeError:
        logger.warning("Failed to parse flashcard JSON, raw output: %s", raw[:300])
    return []


def generate_flashcards(text: str, count: int = 5) -> list[dict]:
    model = get_chat_model(temperature=0.4)
    prompt = _FLASHCARD_PROMPT.format(count=count, text=text[:6000])
    response = model.invoke(prompt)
    return _parse_json_array(response.content)


@tool
def flashcard_generator(text: str, count: int = 5) -> str:
    """
    Generate study flashcards (question/answer pairs) from the given text.
    Returns a JSON array of {question, answer} objects as a string.
    """
    cards = generate_flashcards(text, count=count)
    if not cards:
        return "Could not generate flashcards from the given text."
    return json.dumps(cards, ensure_ascii=False)
