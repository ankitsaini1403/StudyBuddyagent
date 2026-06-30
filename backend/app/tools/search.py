"""
Lightweight web search tool. Pluggable backend -- defaults to DuckDuckGo's
free HTML endpoint so no API key is strictly required; if SEARCH_API_KEY
(Serper.dev) is configured it is used instead for higher-quality results.
"""
import httpx
from langchain_core.tools import tool

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def _search_with_serper(query: str, num_results: int = 5) -> list[dict]:
    response = httpx.post(
        "https://google.serper.dev/search",
        headers={"X-API-KEY": settings.SEARCH_API_KEY, "Content-Type": "application/json"},
        json={"q": query, "num": num_results},
        timeout=10.0,
    )
    response.raise_for_status()
    data = response.json()
    return [
        {"title": r.get("title", ""), "snippet": r.get("snippet", ""), "link": r.get("link", "")}
        for r in data.get("organic", [])[:num_results]
    ]


def _search_with_duckduckgo(query: str, num_results: int = 5) -> list[dict]:
    response = httpx.get(
        "https://html.duckduckgo.com/html/",
        params={"q": query},
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=10.0,
    )
    response.raise_for_status()
    # Minimal, dependency-free parse of DuckDuckGo's HTML result snippets.
    import re

    titles = re.findall(r'class="result__a"[^>]*>(.*?)</a>', response.text)
    snippets = re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', response.text)
    results = []
    for title, snippet in zip(titles[:num_results], snippets[:num_results]):
        clean_title = re.sub(r"<.*?>", "", title)
        clean_snippet = re.sub(r"<.*?>", "", snippet)
        results.append({"title": clean_title, "snippet": clean_snippet, "link": ""})
    return results


def run_search(query: str, num_results: int = 5) -> list[dict]:
    try:
        if settings.SEARCH_API_KEY:
            return _search_with_serper(query, num_results)
        return _search_with_duckduckgo(query, num_results)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Web search failed: %s", exc)
        return []


@tool
def web_search(query: str) -> str:
    """
    Search the web for current or external information not found in the user's
    own notes (e.g. definitions, recent facts, supplementary explanations).
    """
    results = run_search(query)
    if not results:
        return "No search results found (or search is unavailable right now)."

    formatted = "\n\n".join(f"- {r['title']}: {r['snippet']}" for r in results if r["title"])
    return formatted or "No usable search results found."
