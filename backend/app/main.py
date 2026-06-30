"""
FastAPI application entrypoint: app creation, middleware, lifespan, router mounting.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import get_logger, setup_logging
from app.database.mongodb import mongodb

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s (env=%s)", settings.APP_NAME, settings.ENV)
    await mongodb.connect()
    yield
    await mongodb.disconnect()
    logger.info("Shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered study assistant: chat, notes, RAG, and quiz generation.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://study-buddyagent-5hmd.*\.vercel\.app|http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


app.include_router(api_router)


@app.get("/", tags=["root"])
async def root():
    return {"app": settings.APP_NAME, "status": "running", "docs": "/docs"}
