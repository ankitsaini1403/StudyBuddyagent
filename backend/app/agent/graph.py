
from functools import lru_cache

from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode

from app.agent.nodes import TOOLS, agent_node, retrieve_node, should_continue
from app.agent.state import AgentState
from app.core.logging import get_logger

logger = get_logger(__name__)


@lru_cache
def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("retrieve", retrieve_node)
    graph.add_node("agent", agent_node)
    graph.add_node("tools", ToolNode(TOOLS))

    graph.set_entry_point("retrieve")
    graph.add_edge("retrieve", "agent")
    graph.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
    graph.add_edge("tools", "agent")

    compiled = graph.compile()
    logger.info("LangGraph study agent graph compiled")
    return compiled
