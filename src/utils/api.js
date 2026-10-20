/**
 * MediVerify API Service
 * Handles communication with the FastAPI backend
 */

import { getAuthToken } from './firebaseAuth';

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
    const token = await getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      method: 'POST',
      headers,
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

/**
 * Check a batch number against active recalls
 * @param {string} batchNumber
 * @returns {Promise<Object>}
 */
export async function checkBatchRecall(batchNumber) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/check-batch/${encodeURIComponent(batchNumber)}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend batch check failed, relying on local registry:', error);
    return null;
  }
}

/**
 * Submit an emergency counterfeit incident report to backend
 * @param {Object} reportData
 * @returns {Promise<Object>}
 */
export async function submitIncidentReport(reportData) {
  const token = await getAuthToken().catch(() => null);
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/reports`, {
    method: 'POST',
    headers,
    body: JSON.stringify(reportData)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Submission failed with status ${response.status}`);
  }

  return await response.json();
}

export default {
  verifyMedicine,
  checkHealth,
  isServiceReady,
  checkBatchRecall,
  submitIncidentReport
};
