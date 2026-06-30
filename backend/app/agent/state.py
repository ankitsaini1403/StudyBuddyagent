
from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """
    messages: full chat history, auto-merged via LangGraph's add_messages reducer.
    user_id: the authenticated user, used to scope RAG retrieval.
    session_id: chat session identifier for persistence.
    use_rag: whether to retrieve context from the user's notes before answering.
    rag_context: retrieved context block injected into the system prompt, if any.
    """
    messages: Annotated[list[BaseMessage], add_messages]
    user_id: str
    session_id: str
    use_rag: bool
    rag_context: str
