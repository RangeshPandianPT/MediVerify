"""
OCR module for extracting medicine details from images.

Uses Tesseract OCR to read text from medicine packaging images.
"""

import re
import io
from typing import Dict, Optional
from PIL import Image

try:
    import pytesseract
    import cv2
    import numpy as np
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("⚠️ OCR dependencies not installed. Run: pip install pytesseract opencv-python")


def preprocess_for_ocr(image_bytes: bytes) -> 'np.ndarray':
    """
    Preprocess image for better OCR accuracy.
    
    - Convert to grayscale
    - Apply thresholding
    - Denoise
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding for better text visibility
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)
    
    return denoised


def extract_text(image_bytes: bytes) -> str:
    """
    Extract all text from image using OCR.
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        Extracted text string
    """
    if not OCR_AVAILABLE:
        return ""
    
    try:
        # Preprocess image
        processed = preprocess_for_ocr(image_bytes)
        
        # Run OCR with custom config for better accuracy
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(processed, config=custom_config)
        
        return text.strip()
    except Exception as e:
        print(f"OCR error: {e}")
        return ""


def extract_medicine_details(image_bytes: bytes) -> Dict[str, str]:
    """
    Extract structured medicine details from image.
    
    Looks for common patterns like:
    - Medicine name (usually largest text)
    - Manufacturer
    - Batch/Lot number
    - Manufacturing date
    - Expiry date
    - MRP/Price
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        Dictionary with extracted medicine details
    """
    # Default values
    details = {
        "name": "Unknown Medicine",
        "manufacturer": "Unknown Manufacturer",
        "batchNumber": "N/A",
        "mfgDate": "N/A",
        "expDate": "N/A",
        "mrp": "N/A"
    }
    
    if not OCR_AVAILABLE:
        return details
    
    try:
        text = extract_text(image_bytes)
        
        if not text:
            return details
        
        lines = text.split('\n')
        full_text = text.upper()
        
        # Extract medicine name (first substantial line or look for common patterns)
        for line in lines:
            clean_line = line.strip()
            if len(clean_line) > 3 and not any(x in clean_line.upper() for x in ['MFG', 'EXP', 'BATCH', 'MRP', 'RS', '₹', 'LTD', 'PVT']):
                details["name"] = clean_line.title()
                break
        
        # Extract manufacturer (look for Ltd, Pvt, Pharma, etc.)
        manufacturer_patterns = [
            r'(?:manufactured by|mfg by|mfd by)[:\s]*([^\n]+)',
            r'([A-Za-z\s]+(?:Ltd|Ltds|Pvt|Private|Limited|Pharma|Pharmaceuticals)[^\n]*)',
        ]
        for pattern in manufacturer_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["manufacturer"] = match.group(1).strip().title()
                break
        
        # Extract batch number
        batch_patterns = [
            r'(?:batch|lot|b\.?no|l\.?no)[:\s#]*([A-Z0-9\-]+)',
            r'(?:B\.?N\.?|L\.?N\.?)[:\s]*([A-Z0-9\-]+)',
        ]
        for pattern in batch_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["batchNumber"] = match.group(1).strip().upper()
                break
        
        # Extract manufacturing date
        mfg_patterns = [
            r'(?:mfg|mfd|manufacturing)[:\s\.]*(?:date)?[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})',
            r'(?:mfg|mfd)[:\s\.]*(\d{1,2}[\/\-]\d{2,4})',
            r'MFG[:\s]*([A-Z]{3}[\s\-]?\d{2,4})',
        ]
        for pattern in mfg_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["mfgDate"] = match.group(1).strip()
                break
        
        # Extract expiry date
        exp_patterns = [
            r'(?:exp|expiry|expires|use before|best before)[:\s\.]*(?:date)?[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})',
            r'(?:exp|expiry)[:\s\.]*(\d{1,2}[\/\-]\d{2,4})',
            r'EXP[:\s]*([A-Z]{3}[\s\-]?\d{2,4})',
        ]
        for pattern in exp_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["expDate"] = match.group(1).strip()
                break
        
        # Extract MRP/Price
        mrp_patterns = [
            r'(?:mrp|m\.r\.p|price)[:\s₹Rs\.]*(\d+[\.,]?\d*)',
            r'₹\s*(\d+[\.,]?\d*)',
            r'Rs\.?\s*(\d+[\.,]?\d*)',
        ]
        for pattern in mrp_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                price = match.group(1).replace(',', '.')
                details["mrp"] = f"₹{price}"
                break
        
        return details
        
    except Exception as e:
        print(f"Medicine extraction error: {e}")
        return details
