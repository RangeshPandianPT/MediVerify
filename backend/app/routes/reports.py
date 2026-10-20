"""
Emergency Incident Reporting and Batch Recall Verification API.
---------------------------------------------------------------
Endpoints:
- POST /api/reports: Submit counterfeit/adverse drug incident report
- GET /api/reports: List recent incident reports
- GET /api/recalls/check: Check if batch number is flagged in active recall list
- GET /api/recalls/alerts: Get active national drug recall bulletins
"""

from fastapi import APIRouter, Request, HTTPException, Depends
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from loguru import logger

from app.schemas.report import (
    IncidentReportCreate,
    IncidentReportResponse,
    BatchRecallCheckResponse
)
from app.core.audit import log_audit_event
from app.core.rate_limit import limiter

router = APIRouter(prefix="/reports", tags=["regulatory-reports"])

# In-memory storage for reported incidents (in production this would connect to Postgres/MongoDB)
INCIDENT_REPORTS: List[Dict[str, Any]] = [
    {
        "report_id": "rep_init_001",
        "tracking_number": "CDSCO-2025-INC-1092",
        "medicine_name": "Paracetamol 650mg",
        "batch_number": "PCM2024X789",
        "manufacturer": "Apex Health Corp (Suspected Spurious)",
        "report_type": "fake_medicine",
        "urgency": "critical",
        "purchase_location": "Metro Health Chemist, Connaught Place",
        "city": "New Delhi",
        "state": "Delhi",
        "seller_name": "Metro Health Chemist",
        "description": "Blister packaging seal broken; pills disintegrate rapidly; lack official holographic strip.",
        "symptoms": "Severe nausea and lack of fever reduction after 4 hours.",
        "contact_email": "consumer.safety@example.com",
        "contact_phone": "+91 98765 43210",
        "share_with_authorities": True,
        "status": "FORWARDED_TO_DRUG_CONTROLLER",
        "created_at": "2025-01-09T09:15:00Z",
        "matched_recall": True
    },
    {
        "report_id": "rep_init_002",
        "tracking_number": "CDSCO-2025-INC-1093",
        "medicine_name": "Augmentin 625 Duo",
        "batch_number": "AUG2024B102",
        "manufacturer": "GSK Healthcare (Counterfeit Copy)",
        "report_type": "suspicious_seller",
        "urgency": "high",
        "purchase_location": "Bandra West Station Road Stall",
        "city": "Mumbai",
        "state": "Maharashtra",
        "seller_name": "QuickCare Medicos",
        "description": "Color inconsistency on strip logo; batch code font does not match genuine GSK font.",
        "symptoms": "None (user did not consume after MediVerify scan flagged suspicious).",
        "contact_email": "pharmacist.mumbai@example.com",
        "contact_phone": "+91 98111 22334",
        "share_with_authorities": True,
        "status": "UNDER_INVESTIGATION",
        "created_at": "2025-01-10T14:30:00Z",
        "matched_recall": True
    }
]

# Database of active national recalls and seized counterfeit batches
ACTIVE_RECALLS: Dict[str, Dict[str, Any]] = {
    "PCM2024X789": {
        "medicine_name": "Paracetamol 650mg",
        "hazard_level": "Class I (Life Threatening)",
        "status": "RECALLED",
        "manufacturer": "Apex Health Corp (Counterfeit)",
        "reason": "Substandard Active Pharmaceutical Ingredient (API) and toxic solvent residues detected.",
        "recall_date": "2025-01-08",
        "advisory_id": "CDSCO-REC-2025-004",
        "action_required": "Do NOT consume. Quarantine package and surrender to local Drug Inspector.",
        "recommended_hotline": "1800-11-0123 (National Drug Controller Helpline)"
    },
    "AUG2024B102": {
        "medicine_name": "Augmentin 625 Duo",
        "hazard_level": "Class I (Life Threatening)",
        "status": "RECALLED",
        "manufacturer": "Spurious Facility posing as GlaxoSmithKline",
        "reason": "Zero Amoxicillin content detected in laboratory assay; counterfeit packaging with forged QR code.",
        "recall_date": "2025-01-05",
        "advisory_id": "CDSCO-REC-2025-002",
        "action_required": "Stop use immediately. Report retail pharmacy where acquired.",
        "recommended_hotline": "1800-180-3024 (Maharashtra FDA Toll Free)"
    },
    "MON2024L55": {
        "medicine_name": "Montair-LC Kid",
        "hazard_level": "Class II (Severe Health Hazard)",
        "status": "RECALLED",
        "manufacturer": "Cipla Laboratories (Falsified Lot)",
        "reason": "Misprinted dosage instructions on pediatric formulation blister carton.",
        "recall_date": "2024-12-28",
        "advisory_id": "FDA-REC-2024-899",
        "action_required": "Return to dispensary for batch exchange.",
        "recommended_hotline": "1800-22-2244 (Cipla Vigilance Hotline)"
    },
    "AZI2024P09": {
        "medicine_name": "Azithral 500",
        "hazard_level": "Class I (Life Threatening)",
        "status": "RECALLED",
        "manufacturer": "Alembic Pharmaceuticals (Imitation)",
        "reason": "Seized counterfeit consignment discovered in distribution godown.",
        "recall_date": "2025-01-02",
        "advisory_id": "CDSCO-REC-2025-001",
        "action_required": "Cease dispensing. Report lot inventory to State Drug Controller.",
        "recommended_hotline": "1800-11-0123 (CDSCO Whistleblower Cell)"
    }
}


@router.post("", response_model=IncidentReportResponse)
@limiter.limit("10/minute")
async def create_incident_report(request: Request, payload: IncidentReportCreate):
    """
    Submit an emergency counterfeit or adverse medicine report to regulatory channels.
    """
    clean_batch = (payload.batch_number or "").strip().upper()
    matched_recall = clean_batch in ACTIVE_RECALLS

    # Generate official tracking reference
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    unique_suffix = uuid.uuid4().hex[:6].upper()
    tracking_number = f"CDSCO-{timestamp}-INC-{unique_suffix}"
    report_id = f"rep_{uuid.uuid4().hex[:12]}"

    report_record = {
        "report_id": report_id,
        "tracking_number": tracking_number,
        "medicine_name": payload.medicine_name,
        "batch_number": payload.batch_number,
        "manufacturer": payload.manufacturer,
        "report_type": payload.report_type,
        "urgency": payload.urgency,
        "purchase_location": payload.purchase_location,
        "city": payload.city,
        "state": payload.state,
        "seller_name": payload.seller_name,
        "description": payload.description,
        "symptoms": payload.symptoms,
        "contact_email": payload.contact_email,
        "contact_phone": payload.contact_phone,
        "share_with_authorities": payload.share_with_authorities,
        "status": "PRIORITY_ESCALATED" if matched_recall or payload.urgency == "critical" else "LOGGED_FOR_REVIEW",
        "created_at": datetime.utcnow().isoformat(),
        "matched_recall": matched_recall
    }

    INCIDENT_REPORTS.insert(0, report_record)

    # Structured audit logging
    log_audit_event(
        action="INCIDENT_REPORT_SUBMITTED",
        user_id=payload.contact_email or "anonymous_reporter",
        details={
            "tracking_number": tracking_number,
            "medicine": payload.medicine_name,
            "batch": payload.batch_number,
            "urgency": payload.urgency,
            "matched_recall": matched_recall
        }
    )

    logger.warning(
        f"🚨 Regulatory Incident Filed: {tracking_number} for {payload.medicine_name} "
        f"[Batch: {payload.batch_number}, Urgency: {payload.urgency}, Matched Recall: {matched_recall}]"
    )

    return IncidentReportResponse(
        report_id=report_id,
        tracking_number=tracking_number,
        status=report_record["status"],
        created_at=report_record["created_at"],
        matched_recall=matched_recall,
        regulatory_agency="Central Drugs Standard Control Organisation (CDSCO) & State FDA",
        message="Your incident report has been registered and scheduled for regulatory triage.",
        dossier_summary={
            "tracking_number": tracking_number,
            "medicine_name": payload.medicine_name,
            "batch_number": payload.batch_number,
            "urgency": payload.urgency,
            "matched_active_recall": matched_recall,
            "routing_priority": "Immediate Rapid Response" if (matched_recall or payload.urgency == "critical") else "Standard 24h Review"
        }
    )


@router.get("", response_model=List[Dict[str, Any]])
async def list_incident_reports(
    medicine: Optional[str] = None,
    batch: Optional[str] = None,
    urgency: Optional[str] = None
):
    """
    Retrieve filed incident reports with optional filters.
    """
    results = INCIDENT_REPORTS
    if medicine:
        results = [r for r in results if medicine.lower() in r["medicine_name"].lower()]
    if batch:
        results = [r for r in results if r.get("batch_number") and batch.upper() in r["batch_number"].upper()]
    if urgency:
        results = [r for r in results if r["urgency"] == urgency]
    return results


@router.get("/check-batch/{batch_number}", response_model=BatchRecallCheckResponse)
async def check_batch_recall(batch_number: str):
    """
    Check if a batch number matches any active national recall or seized counterfeit lot.
    """
    clean_batch = batch_number.strip().upper()
    if clean_batch in ACTIVE_RECALLS:
        recall = ACTIVE_RECALLS[clean_batch]
        return BatchRecallCheckResponse(
            query_batch=clean_batch,
            is_recalled=True,
            hazard_level=recall["hazard_level"],
            status=recall["status"],
            medicine_name=recall["medicine_name"],
            manufacturer=recall["manufacturer"],
            reason=recall["reason"],
            recall_date=recall["recall_date"],
            advisory_id=recall["advisory_id"],
            action_required=recall["action_required"],
            recommended_hotline=recall["recommended_hotline"]
        )

    return BatchRecallCheckResponse(
        query_batch=clean_batch,
        is_recalled=False,
        hazard_level=None,
        status="CLEARED",
        medicine_name=None,
        manufacturer=None,
        reason=None,
        recall_date=None,
        advisory_id=None,
        action_required="No active national recalls or counterfeit seizure alerts logged for this batch.",
        recommended_hotline="1800-11-0123 (National Drug Controller Info Line)"
    )


@router.get("/active-recalls")
async def get_active_recalls():
    """
    Return all active drug recalls and safety advisories.
    """
    return {
        "total_active_recalls": len(ACTIVE_RECALLS),
        "as_of": datetime.utcnow().strftime("%Y-%m-%d"),
        "recalls": [
            {"batch_number": k, **v} for k, v in ACTIVE_RECALLS.items()
        ]
    }
