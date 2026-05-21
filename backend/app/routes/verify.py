"""
Verification API endpoint.

POST /api/verify - Upload medicine image for authenticity verification
"""

import time
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from loguru import logger

from app.schemas.verification import VerificationResult, ErrorResponse
from app.model.preprocessing import validate_image
from app.core.auth import get_current_user
from app.core.rate_limit import limiter


router = APIRouter(tags=["verification"])


# Maximum file size (10 MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

# Allowed image types
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.post(
    "/verify",
    response_model=VerificationResult,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid image"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        429: {"model": ErrorResponse, "description": "Too many requests"},
        500: {"model": ErrorResponse, "description": "Verification failed"}
    }
)
@limiter.limit("5/minute")
async def verify_medicine(
    request: Request,
    image: UploadFile = File(..., description="Medicine image to verify"),
    user: dict = Depends(get_current_user)
):
    """
    Verify medicine authenticity from uploaded image.
    
    - **image**: JPEG, PNG, or WebP image of medicine packaging
    
    Returns verification result with:
    - Authenticity status (authentic/fake)
    - Credibility percentage
    - Visual analysis breakdown
    - Medicine details (if detectable)
    """
    # Import here to avoid circular imports
    from main import get_verifier
    
    # Validate content type
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {image.content_type}. Allowed: {', '.join(ALLOWED_TYPES)}"
        )
    
    # Read image bytes
    try:
        image_bytes = await image.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read image: {str(e)}")
    
    # Validate file size
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)} MB"
        )
    
    # Validate image format
    if not validate_image(image_bytes):
        raise HTTPException(status_code=400, detail="Invalid or corrupted image file")
    
    # Get verifier and run prediction
    verifier = get_verifier()
    if verifier is None:
        logger.error("Model not loaded during request")
        raise HTTPException(status_code=500, detail="Model not loaded. Please try again later.")
    
    try:
        start_time = time.time()
        logger.info(f"User {user.get('uid')} is verifying an image of size {len(image_bytes)} bytes")
        result = verifier.predict(image_bytes)
        latency = (time.time() - start_time) * 1000
        logger.info(f"Verification successful for User {user.get('uid')}. Latency: {latency:.2f}ms. Result: {result.get('status') if isinstance(result, dict) else 'success'}")
        return result
    except Exception as e:
        logger.error(f"Verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")


@router.get("/verify/status")
async def verify_status():
    """Check if verification service is ready."""
    from main import get_verifier
    
    verifier = get_verifier()
    return {
        "ready": verifier is not None,
        "model_loaded": verifier.model_loaded if verifier else False
    }
