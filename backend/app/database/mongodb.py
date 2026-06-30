"""
MongoDB connection management using Motor (async driver).
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None

    async def connect(self) -> None:
        logger.info("Connecting to MongoDB at %s", settings.MONGODB_URI)
        self.client = AsyncIOMotorClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DB_NAME]
        # Verify connection
        await self.client.admin.command("ping")
        await self._ensure_indexes()
        logger.info("MongoDB connection established (db=%s)", settings.MONGODB_DB_NAME)

    async def disconnect(self) -> None:
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    async def _ensure_indexes(self) -> None:
        from app.utils.constants import NOTES_COLLECTION, QUIZZES_COLLECTION, USERS_COLLECTION

        await self.db[USERS_COLLECTION].create_index("email", unique=True)
        await self.db[NOTES_COLLECTION].create_index("user_id")
        await self.db[QUIZZES_COLLECTION].create_index("user_id")

    def get_db(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            raise RuntimeError("MongoDB is not connected. Call connect() during app startup.")
        return self.db


mongodb = MongoDB()


def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency to fetch the active database instance."""
    return mongodb.get_db()
