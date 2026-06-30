
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage

from app.core.logging import get_logger
from app.database.mongodb import mongodb
from app.database.models import ChatMessageModel, ChatSessionModel
from app.utils.constants import CHAT_SESSIONS_COLLECTION
from app.utils.helper import generate_uuid, utc_now

logger = get_logger(__name__)


def _to_lc_message(msg: dict) -> BaseMessage:
    role = msg.get("role")
    content = msg.get("content", "")
    if role == "user":
        return HumanMessage(content=content)
    if role == "assistant":
        return AIMessage(content=content)
    return SystemMessage(content=content)


def _from_lc_message(msg: BaseMessage) -> dict:
    role = "assistant" if isinstance(msg, AIMessage) else "user" if isinstance(msg, HumanMessage) else "system"
    return {"role": role, "content": msg.content}


async def get_or_create_session(user_id: str, session_id: str | None) -> dict:
    collection = mongodb.get_db()[CHAT_SESSIONS_COLLECTION]

    if session_id:
        existing = await collection.find_one({"_id": session_id, "user_id": user_id})
        if existing:
            return existing

    new_session = ChatSessionModel(user_id=user_id, id=session_id or generate_uuid())
    await collection.insert_one(new_session.to_dict())
    return new_session.to_dict()


async def load_history(user_id: str, session_id: str) -> list[BaseMessage]:
    collection = mongodb.get_db()[CHAT_SESSIONS_COLLECTION]
    doc = await collection.find_one({"_id": session_id, "user_id": user_id})
    if not doc:
        return []
    return [_to_lc_message(m) for m in doc.get("messages", [])]


async def append_messages(user_id: str, session_id: str, new_messages: list[BaseMessage]) -> None:
    collection = mongodb.get_db()[CHAT_SESSIONS_COLLECTION]
    docs = [ChatMessageModel(**_from_lc_message(m)).__dict__ for m in new_messages]

    await collection.update_one(
        {"_id": session_id, "user_id": user_id},
        {
            "$push": {"messages": {"$each": docs}},
            "$set": {"updated_at": utc_now().isoformat()},
        },
        upsert=True,
    )
