import { verifyMedicine } from './api';
import { verificationStorage } from './storage';

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error || new Error('Unable to read image for offline queue'));
  reader.readAsDataURL(file);
});

const dataUrlToFile = async (dataUrl, fileName = 'queued-verification.jpg', mimeType = 'image/jpeg') => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: mimeType || blob.type || 'image/jpeg' });
};

const buildHistoryRecord = (result) => ({
  verificationId: result?.id,
  medicineName: result?.medicineDetails?.name || result?.medicineName || 'Unknown Medicine',
  verificationDate: result?.timestamp,
  credibilityPercentage: result?.credibilityPercentage,
  isAuthentic: result?.isAuthentic,
  status: 'completed',
  batchNumber: result?.medicineDetails?.batchNumber || result?.batchNumber,
  manufacturer: result?.medicineDetails?.manufacturer || result?.manufacturer,
  expiryDate: result?.medicineDetails?.expDate || result?.expiryDate,
  analysisDetails: {
    processingTime: result?.processingTime,
    confidenceBand: result?.confidenceBand,
    ocrQualityScore: result?.ocrQualityScore,
    ocrQualityReason: result?.ocrQualityReason,
    recommendation: result?.actionRecommendation,
    fontMatch: result?.analysis?.visualFingerprint?.fontAccuracy,
    colorMatch: result?.analysis?.visualFingerprint?.colorMatch,
    textureMatch: result?.analysis?.visualFingerprint?.textureAnalysis,
  }
});

export const queueOfflineVerification = async ({ imageFile, reason = 'Network unavailable', referenceContext = {} }) => {
  if (!imageFile) {
    throw new Error('Missing image file for offline queue');
  }

  const imageDataUrl = await fileToDataUrl(imageFile);
  const saved = verificationStorage.addPendingVerification({
    imageDataUrl,
    imageName: imageFile.name || `medicine-${Date.now()}.jpg`,
    imageType: imageFile.type || 'image/jpeg',
    reason,
    referenceContext,
  });

  if (!saved) {
    throw new Error('Unable to save verification to the offline queue');
  }

  window.dispatchEvent(new Event('mediverify:verificationQueueUpdated'));
  return saved;
};

export const syncOfflineVerificationQueue = async () => {
  const queue = verificationStorage.getPendingVerifications();
  if (queue.length === 0) {
    return { synced: 0, failed: 0, remaining: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      verificationStorage.updatePendingVerification(item.id, { status: 'syncing', lastAttemptAt: new Date().toISOString() });

      const imageFile = await dataUrlToFile(item.imageDataUrl, item.imageName, item.imageType);
      const result = await verifyMedicine(imageFile);
      const mergedResult = {
        ...result,
        ...item.referenceContext,
      };

      verificationStorage.addVerification(buildHistoryRecord(mergedResult));
      verificationStorage.removePendingVerification(item.id);
      synced += 1;
    } catch (error) {
      failed += 1;
      verificationStorage.updatePendingVerification(item.id, {
        status: 'failed',
        lastError: error?.message || 'Sync failed',
        lastAttemptAt: new Date().toISOString(),
      });
    }
  }

  const summary = {
    synced,
    failed,
    remaining: verificationStorage.getPendingVerifications().length,
  };

  window.dispatchEvent(new Event('mediverify:verificationQueueUpdated'));
  return summary;
};

export const buildOfflineQueueSummary = () => {
  const queue = verificationStorage.getPendingVerifications();
  return {
    total: queue.length,
    pending: queue.filter((item) => item.status === 'pending').length,
    syncing: queue.filter((item) => item.status === 'syncing').length,
    failed: queue.filter((item) => item.status === 'failed').length,
  };
};

export default {
  queueOfflineVerification,
  syncOfflineVerificationQueue,
  buildOfflineQueueSummary,
};