import os
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
from loguru import logger

# Initialize Firebase Admin
try:
    if not firebase_admin._apps:
        # We can initialize without credentials if GOOGLE_APPLICATION_CREDENTIALS is set,
        # or we just use default which works for verifying ID tokens (it fetches Google's public keys)
        logger.info("Initializing Firebase Admin SDK for auth...")
        firebase_admin.initialize_app()
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin: {e}")

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    FastAPI dependency to extract and verify the Firebase JWT token.
    Returns the decoded token (which includes user id).
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.warning(f"Invalid authentication credentials: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
