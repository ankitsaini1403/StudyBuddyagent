
from langchain_core.messages import AIMessage, HumanMessage

from app.agent.graph import build_graph
from app.agent.memory import append_messages, get_or_create_session, load_history
from app.core.logging import get_logger

logger = get_logger(__name__)


async def run_study_agent(user_id: str, message: str, session_id: str | None, use_rag: bool = True) -> dict:
    """
    Run one turn of the study agent: load history, execute the graph, persist
    the new messages, and return the assistant's reply plus full history.
    """
    session = await get_or_create_session(user_id, session_id)
    resolved_session_id = session["_id"]

    history = await load_history(user_id, resolved_session_id)
    user_message = HumanMessage(content=message)

    graph = build_graph()
    result = await graph.ainvoke(
        {
            "messages": [*history, user_message],
            "user_id": user_id,
            "session_id": resolved_session_id,
            "use_rag": use_rag,
            "rag_context": "",
        }
    )

    new_messages = result["messages"][len(history):]
    await append_messages(user_id, resolved_session_id, new_messages)

    final_ai_message = next(
        (m for m in reversed(new_messages) if isinstance(m, AIMessage) and m.content),
        None,
    )
    reply = final_ai_message.content if final_ai_message else "I couldn't generate a response."

    full_history = [*history, *new_messages]
    return {
        "session_id": resolved_session_id,
        "reply": reply,
        "history": [
            {"role": "assistant" if isinstance(m, AIMessage) else "user", "content": m.content}
            for m in full_history
            if m.content
        ],
    }
