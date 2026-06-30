
from fastapi import APIRouter, Depends, HTTPException, status

from app.agent.study_agent import run_study_agent
from app.core.logging import get_logger
from app.core.security import get_current_user_id
from app.database.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])
logger = get_logger(__name__)


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, user_id: str = Depends(get_current_user_id)):
    try:
        result = await run_study_agent(
            user_id=user_id,
            message=payload.message,
            session_id=payload.session_id,
            use_rag=payload.use_rag,
        )
    except Exception as exc:  
        logger.exception("Agent execution failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent failed to respond: {exc}",
        ) from exc

    return ChatResponse(**result)
