from loguru import logger
from datetime import datetime

def log_audit_event(action: str, user_id: str, details: dict = None):
    """
    Log an audit event for safety-critical operations.
    This creates a structured log that can be forwarded to a SIEM or database.
    """
    if details is None:
        details = {}
        
    audit_record = {
        "timestamp": datetime.utcnow().isoformat(),
        "action": action,
        "user_id": user_id,
        "details": details,
        "type": "AUDIT_LOG"
    }
    
    # In a real-world scenario, you might save this to a database table or a dedicated audit file.
    # For now, we output it as a structured log using loguru.
    logger.bind(audit=True).info(f"AUDIT_EVENT: {audit_record}")
