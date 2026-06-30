
import json
import re

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.agent.prompts import QUIZ_GENERATION_PROMPT
from app.core.logging import get_logger
from app.core.security import get_current_user_id
from app.database.mongodb import get_database
from app.database.models import QuizModel, QuizQuestionModel
from app.database.schemas import QuizGenerateRequest, QuizResponse
from app.services.llm import simple_completion
from app.services.rag import retrieve_context
from app.utils.constants import NOTES_COLLECTION, QUIZ_DIFFICULTIES, QUIZZES_COLLECTION

router = APIRouter(prefix="/quiz", tags=["quiz"])
logger = get_logger(__name__)


def _parse_questions(raw: str) -> list[QuizQuestionModel]:
    cleaned = re.sub(r"^```(json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse quiz JSON: %s", raw[:300])
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The model returned an unparsable quiz. Please try again.",
        ) from exc

    return [
        QuizQuestionModel(
            question=q["question"],
            options=q["options"],
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation"),
        )
        for q in data
    ]


@router.post("/generate", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
async def generate_quiz(
    payload: QuizGenerateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    if payload.difficulty not in QUIZ_DIFFICULTIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"difficulty must be one of {QUIZ_DIFFICULTIES}",
        )

    # Prefer the specific note's content; otherwise fall back to RAG retrieval over all notes.
    if payload.note_id:
        note = await db[NOTES_COLLECTION].find_one({"_id": payload.note_id, "user_id": user_id})
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        source_text = note["content"]
    else:
        source_text = retrieve_context(query=payload.topic, user_id=user_id, k=6)
        if not source_text:
            source_text = payload.topic  # fall back to pure LLM knowledge of the topic

    prompt = QUIZ_GENERATION_PROMPT.format(
        num_questions=payload.num_questions,
        difficulty=payload.difficulty,
        topic=payload.topic,
        text=source_text[:6000],
    )
    raw_response = await simple_completion(prompt, temperature=0.4)
    questions = _parse_questions(raw_response)

    if not questions:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="No questions were generated")

    quiz = QuizModel(
        user_id=user_id,
        topic=payload.topic,
        difficulty=payload.difficulty,
        questions=questions,
        note_id=payload.note_id,
    )
    await db[QUIZZES_COLLECTION].insert_one(quiz.to_dict())

    return QuizResponse(
        id=quiz.id,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        questions=[q.__dict__ for q in quiz.questions],
        created_at=quiz.created_at,
    )


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    doc = await db[QUIZZES_COLLECTION].find_one({"_id": quiz_id, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")

    return QuizResponse(
        id=doc["_id"],
        topic=doc["topic"],
        difficulty=doc["difficulty"],
        questions=doc["questions"],
        created_at=doc["created_at"],
    )


@router.get("", response_model=list[QuizResponse])
async def list_quizzes(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cursor = db[QUIZZES_COLLECTION].find({"user_id": user_id}).sort("created_at", -1)
    return [
        QuizResponse(
            id=doc["_id"],
            topic=doc["topic"],
            difficulty=doc["difficulty"],
            questions=doc["questions"],
            created_at=doc["created_at"],
        )
        async for doc in cursor
    ]
