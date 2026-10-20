"""
Pydantic schemas for Emergency Incident Reporting and Batch Recall Verification.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class IncidentReportCreate(BaseModel):
    """Payload for submitting an emergency counterfeit medicine report."""
    medicine_name: str = Field(..., min_length=2, max_length=150, description="Name of the medicine")
    batch_number: Optional[str] = Field(None, max_length=50, description="Batch / Lot number if available")
    manufacturer: Optional[str] = Field(None, max_length=150, description="Manufacturer name printed on packaging")
    report_type: str = Field("fake_medicine", description="Type of incident: fake_medicine, adverse_reaction, suspicious_seller, packaging_defect")
    urgency: str = Field("high", description="Urgency rating: critical, high, medium, low")
    purchase_location: Optional[str] = Field(None, max_length=250, description="Pharmacy name or street address")
    city: Optional[str] = Field(None, max_length=100, description="City where medicine was acquired")
    state: Optional[str] = Field(None, max_length=100, description="State or province")
    seller_name: Optional[str] = Field(None, max_length=150, description="Pharmacy or vendor business name")
    description: str = Field(..., min_length=10, max_length=2000, description="Detailed explanation of the safety concern")
    symptoms: Optional[str] = Field(None, max_length=1000, description="Any health symptoms experienced")
    contact_email: Optional[str] = Field(None, max_length=150, description="User contact email for follow-up")
    contact_phone: Optional[str] = Field(None, max_length=30, description="User contact phone for emergency callbacks")
    share_with_authorities: bool = Field(True, description="Whether to route this dossier to drug regulatory bodies")


class IncidentReportResponse(BaseModel):
    """Response returned upon filing a regulatory incident report."""
    report_id: str
    tracking_number: str
    status: str
    created_at: str
    matched_recall: bool = False
    regulatory_agency: str
    message: str
    dossier_summary: Dict[str, Any]


class BatchRecallCheckResponse(BaseModel):
    """Response returned when checking a medicine batch against active recall notices."""
    query_batch: str
    is_recalled: bool
    hazard_level: Optional[str] = None  # Class I, Class II, Class III, or None
    status: str                         # 'RECALLED', 'UNDER_INVESTIGATION', 'CLEARED'
    medicine_name: Optional[str] = None
    manufacturer: Optional[str] = None
    reason: Optional[str] = None
    recall_date: Optional[str] = None
    advisory_id: Optional[str] = None
    action_required: str
    recommended_hotline: str
