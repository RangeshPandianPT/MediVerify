"""
Image preprocessing for EfficientNetB0 model.
"""

import io
import cv2
import numpy as np
import filetype
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input


# EfficientNetB0 input size
INPUT_SIZE = (224, 224)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess image bytes for EfficientNetB0 model.
    
    Args:
        image_bytes: Raw image bytes from uploaded file
        
    Returns:
        Preprocessed numpy array ready for model inference
    """
    # Open and convert image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary (handles PNG with alpha, grayscale, etc.)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize(INPUT_SIZE, Image.Resampling.LANCZOS)
    
    # Convert to numpy array
    img_array = np.array(image, dtype=np.float32)
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    # Apply EfficientNet preprocessing (scales to [-1, 1])
    img_array = preprocess_input(img_array)
    
    return img_array


def validate_image(image_bytes: bytes) -> bool:
    """
    Validate that the bytes represent a valid image by checking magic bytes.
    
    Args:
        image_bytes: Raw bytes to validate
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        # First check strict mime type with filetype
        kind = filetype.guess(image_bytes)
        if kind is None or not kind.mime.startswith('image/'):
            return False
            
        # Then verify it can actually be opened by PIL
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        return True
    except Exception:
        return False

def check_image_quality(image_bytes: bytes) -> dict:
    """
    Check if the image is too blurry or too dark using OpenCV.
    
    Args:
        image_bytes: Raw bytes to evaluate
        
    Returns:
        dict: {"is_valid": bool, "reason": str}
    """
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            return {"is_valid": False, "reason": "Failed to decode image for quality check."}
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Blur detection using variance of Laplacian
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_score < 100.0:
            return {"is_valid": False, "reason": f"Image is too blurry (score: {blur_score:.1f}). Please hold the camera steady."}
            
        # Lighting detection using mean brightness
        brightness = np.mean(gray)
        if brightness < 40:
            return {"is_valid": False, "reason": "Image is too dark. Please ensure good lighting."}
        if brightness > 240:
            return {"is_valid": False, "reason": "Image is too bright or overexposed."}
            
        return {"is_valid": True, "reason": ""}
    except Exception as e:
        # Fallback to True if processing fails, to not block the pipeline entirely
        return {"is_valid": True, "reason": str(e)}

