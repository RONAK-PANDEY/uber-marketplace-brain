"""
auth/jwt_handler.py — JWT creation and validation.

TODO:
  - Implement create_access_token(data: dict) -> str
  - Implement decode_access_token(token: str) -> dict | None
  - Add refresh token support
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends

from app.config import settings

security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload to encode (include 'sub' for subject).
        expires_delta: Token lifetime; defaults to JWT_EXPIRE_MINUTES.

    Returns:
        Signed JWT string.

    TODO: add 'role' claim for rider/driver/admin differentiation
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.jwt_expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT token.

    Raises:
        HTTPException 401 if token is invalid or expired.

    TODO: add token blacklist check for logout support
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        raise credentials_exception


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency: extracts and validates the Bearer token.

    Usage:
        async def route(user=Depends(get_current_user)):
            print(user['sub'])
    """
    return decode_access_token(credentials.credentials)


async def require_driver(user: dict = Depends(get_current_user)) -> dict:
    """
    FastAPI dependency: ensures the user has the 'driver' role.

    TODO: implement role checking once roles are added to JWT payload
    """
    # TODO: check user['role'] == 'driver'
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """
    FastAPI dependency: ensures the user has the 'admin' role.

    TODO: implement role checking
    """
    # TODO: check user['role'] == 'admin'
    return user

