/**
 * MediVerify API Service
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Verify medicine image authenticity
 * @param {File} imageFile - Image file to verify
 * @returns {Promise<Object>} Verification result
 */
export async function verifyMedicine(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Verification failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to verification server. Please ensure the backend is running.');
    }
    throw error;
  }
}

/**
 * Check API health status
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    return { status: 'offline', model_loaded: false };
  }
}

/**
 * Check if verification service is ready
 * @returns {Promise<boolean>} True if ready
 */
export async function isServiceReady() {
  try {
    const health = await checkHealth();
    return health.status === 'healthy' && health.model_loaded;
  } catch {
    return false;
  }
}

export default {
  verifyMedicine,
  checkHealth,
  isServiceReady,
};
