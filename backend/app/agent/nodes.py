
from langchain_core.messages import HumanMessage, SystemMessage

from app.agent.prompts import RAG_CONTEXT_TEMPLATE, SYSTEM_PROMPT
from app.agent.state import AgentState
from app.core.logging import get_logger
from app.services.llm import get_chat_model
from app.services.rag import retrieve_context
from app.tools.calculator import calculator
from app.tools.flashcard import flashcard_generator
from app.tools.search import web_search
from app.tools.word_count import word_count

logger = get_logger(__name__)

TOOLS = [calculator, word_count, web_search, flashcard_generator]
_base_model = get_chat_model()
_model_with_tools = _base_model.bind_tools(TOOLS)


def retrieve_node(state: AgentState) -> dict:
    """Optionally pull relevant context from the user's notes via RAG."""
    if not state.get("use_rag"):
        return {"rag_context": ""}

    last_user_msg = next(
        (m.content for m in reversed(state["messages"]) if isinstance(m, HumanMessage)),
        "",
    )
    if not last_user_msg:
        return {"rag_context": ""}

    context = retrieve_context(query=last_user_msg, user_id=state["user_id"])
    return {"rag_context": context}


def agent_node(state: AgentState) -> dict:
    """Core reasoning step: build the prompt (system + RAG context + history) and call the LLM."""
    system_content = SYSTEM_PROMPT
    if state.get("rag_context"):
        system_content += "\n\n" + RAG_CONTEXT_TEMPLATE.format(context=state["rag_context"])

    messages = [SystemMessage(content=system_content), *state["messages"]]
    messages = [SystemMessage(content=system_content), *state["messages"]]

    try:
        response = _model_with_tools.invoke(messages)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Tool-enabled call failed (%s); retrying without tools", exc)
        response = _base_model.invoke(messages)

    return {"messages": [response]}


def should_continue(state: AgentState) -> str:
    """Routing function: go to the tools node if the last AI message requested tool calls."""
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"
    return "end"
