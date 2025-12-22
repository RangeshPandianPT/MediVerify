"""
MediVerify FastAPI Backend
--------------------------
High-performance API for medicine authenticity verification using EfficientNetB0.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routes import verify
from app.model.predictor import MedicineVerifier

# Global model instance
verifier = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup, cleanup on shutdown."""
    global verifier
    print("🔄 Loading EfficientNetB0 model...")
    verifier = MedicineVerifier()
    print("✅ Model loaded successfully!")
    yield
    print("🛑 Shutting down...")


app = FastAPI(
    title="MediVerify API",
    description="AI-powered medicine authenticity verification using EfficientNetB0",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend (allow all origins in development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
