
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user_id,
    hash_password,
    verify_password,
)
from app.database.mongodb import get_database
from app.database.models import UserModel
from app.database.schemas import (
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.utils.constants import USERS_COLLECTION

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegisterRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    collection = db[USERS_COLLECTION]

    existing = await collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = UserModel(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    await collection.insert_one(user.to_dict())

    return UserResponse(id=user.id, email=user.email, full_name=user.full_name, is_active=user.is_active)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    collection = db[USERS_COLLECTION]
    user = await collection.find_one({"email": payload.email})

    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")

    return TokenResponse(
        access_token=create_access_token(user["_id"]),
        refresh_token=create_refresh_token(user["_id"]),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str):
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload["sub"]
    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    collection = db[USERS_COLLECTION]
    user = await collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(
        id=user["_id"],
        email=user["email"],
        full_name=user.get("full_name"),
        is_active=user.get("is_active", True),
    )
