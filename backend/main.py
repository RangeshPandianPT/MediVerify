"""
MediVerify FastAPI Backend
--------------------------
High-performance API for medicine authenticity verification using EfficientNetB0.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from loguru import logger
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware

from app.routes import verify
from app.model.predictor import MedicineVerifier
from app.core.rate_limit import limiter

class SecureHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:;"
        return response

# Global model instance
verifier = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup, cleanup on shutdown."""
    global verifier
    logger.info("🔄 Loading EfficientNetB0 model...")
    try:
        verifier = MedicineVerifier()
        logger.info("✅ Model loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
    yield
    logger.info("🛑 Shutting down...")


app = FastAPI(
    title="MediVerify API",
    description="AI-powered medicine authenticity verification using EfficientNetB0",
    version="1.0.0",
    lifespan=lifespan
)

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure headers middleware
app.add_middleware(SecureHeadersMiddleware)

# Include routes
app.include_router(verify.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": verifier is not None,
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "message": "MediVerify API",
        "docs": "/docs",
        "health": "/api/health",
        "verify": "POST /api/verify"
    }


def get_verifier() -> MedicineVerifier:
    """Get the global verifier instance."""
    return verifier
