
from fastapi import APIRouter

from app.core.logging import get_logger
from app.database.mongodb import mongodb
from app.database.schemas import HealthResponse
from app.services.vectorstore import get_vectorstore

router = APIRouter(tags=["health"])
logger = get_logger(__name__)


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    mongo_ok = False
    try:
        await mongodb.client.admin.command("ping")
        mongo_ok = True
    except Exception as exc:  # noqa: BLE001
        logger.warning("MongoDB health check failed: %s", exc)

    vectorstore_ok = False
    try:
        get_vectorstore()
        vectorstore_ok = True
    except Exception as exc:  # noqa: BLE001
        logger.warning("Vectorstore health check failed: %s", exc)

    return HealthResponse(
        status="ok" if mongo_ok and vectorstore_ok else "degraded",
        mongodb=mongo_ok,
        vectorstore=vectorstore_ok,
    )
