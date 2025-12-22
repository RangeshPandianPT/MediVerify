"""
Image preprocessing for EfficientNetB0 model.
"""

import io
import numpy as np
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
    Validate that the bytes represent a valid image.
    
    Args:
        image_bytes: Raw bytes to validate
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        return True
    except Exception:
        return False
