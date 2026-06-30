
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import get_current_user_id
from app.database.mongodb import get_database
from app.database.models import NoteModel
from app.database.schemas import NoteCreateRequest, NoteResponse, NoteUpdateRequest
from app.services.rag import index_text
from app.services.vectorstore import delete_by_note_id
from app.tools.pdf_reader import extract_text_from_pdf
from app.utils.constants import NOTES_COLLECTION
from app.utils.helper import is_allowed_upload, safe_filename, utc_now

router = APIRouter(prefix="/notes", tags=["notes"])
logger = get_logger(__name__)


def _to_response(doc: dict) -> NoteResponse:
    return NoteResponse(
        id=doc["_id"],
        title=doc["title"],
        content=doc["content"],
        tags=doc.get("tags", []),
        source_filename=doc.get("source_filename"),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    payload: NoteCreateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    note = NoteModel(user_id=user_id, title=payload.title, content=payload.content, tags=payload.tags)
    await db[NOTES_COLLECTION].insert_one(note.to_dict())

    index_text(text=note.content, user_id=user_id, note_id=note.id)
    return _to_response(note.to_dict())


@router.post("/upload", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def upload_note_file(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    if not is_allowed_upload(file.filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    dest_path = upload_dir / safe_filename(file.filename)

    contents = await file.read()
    dest_path.write_bytes(contents)

    if dest_path.suffix.lower() == ".pdf":
        text = extract_text_from_pdf(str(dest_path))
    else:
        text = contents.decode("utf-8", errors="ignore")

    if not text.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No extractable text found")

    note = NoteModel(
        user_id=user_id,
        title=file.filename,
        content=text,
        source_filename=file.filename,
    )
    await db[NOTES_COLLECTION].insert_one(note.to_dict())

    chunks_indexed = index_text(text=text, user_id=user_id, note_id=note.id, source_filename=file.filename)
    logger.info("Uploaded note %s indexed into %d chunks", note.id, chunks_indexed)

    return _to_response(note.to_dict())


@router.get("", response_model=list[NoteResponse])
async def list_notes(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cursor = db[NOTES_COLLECTION].find({"user_id": user_id}).sort("created_at", -1)
    return [_to_response(doc) async for doc in cursor]


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    doc = await db[NOTES_COLLECTION].find_one({"_id": note_id, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return _to_response(doc)


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    payload: NoteUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    collection = db[NOTES_COLLECTION]
    doc = await collection.find_one({"_id": note_id, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    update_fields = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if update_fields:
        update_fields["updated_at"] = utc_now().isoformat()
        await collection.update_one({"_id": note_id}, {"$set": update_fields})

    if "content" in update_fields:
        delete_by_note_id(note_id)
        index_text(text=update_fields["content"], user_id=user_id, note_id=note_id)

    updated_doc = await collection.find_one({"_id": note_id})
    return _to_response(updated_doc)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    result = await db[NOTES_COLLECTION].delete_one({"_id": note_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    delete_by_note_id(note_id)
