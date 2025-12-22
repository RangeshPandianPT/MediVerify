"""
Pydantic schemas for API request/response models.
"""

from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime


class VisualFingerprint(BaseModel):
    """Visual analysis metrics."""
    fontAccuracy: int
    colorMatch: int
    textureAnalysis: int
    hologramVerification: int


class SecurityFeatures(BaseModel):
    """Security feature verification status."""
    qrCode: str
    serialNumber: str
    packaging: str


class Analysis(BaseModel):
    """Complete analysis breakdown."""
    visualFingerprint: VisualFingerprint
    securityFeatures: SecurityFeatures


class MedicineDetails(BaseModel):
    """Medicine information extracted from image."""
    name: str
    manufacturer: str
    batchNumber: str
    mfgDate: str
    expDate: str
    mrp: str


class VerificationResult(BaseModel):
    """Complete verification response."""
    id: str
    isAuthentic: bool
    credibilityPercentage: int
    status: str  # "authentic", "suspicious", "fake"
    medicineDetails: MedicineDetails
    analysis: Analysis
    timestamp: str
    processingTime: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    model_loaded: bool
    version: str


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: Optional[str] = None
