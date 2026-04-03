const FIELD_LABELS = {
  fontAccuracy: 'Font accuracy',
  colorMatch: 'Color match',
  textureAnalysis: 'Texture analysis',
  labelIntegrity: 'Label integrity',
  packagingMatch: 'Packaging match',
  hologramMatch: 'Hologram match',
  microtextMatch: 'Microtext match',
  barcodeMatch: 'Barcode match',
  sealIntegrity: 'Seal integrity',
  printQuality: 'Print quality',
};

const clampScore = (value) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
};

const getConfidenceBand = (result = {}) => {
  const band = result?.confidenceBand || result?.analysisDetails?.confidenceBand;
  if (band) {
    return String(band);
  }

  const confidence = clampScore(
    result?.credibilityPercentage ??
      result?.analysisDetails?.confidenceLevel ??
      result?.analysisDetails?.overallScore
  );

  if (confidence === null) {
    return 'unknown';
  }

  if (confidence >= 85) {
    return 'high';
  }

  if (confidence >= 70) {
    return 'medium';
  }

  return 'low';
};

const getVerdictLabel = (result = {}) => {
  if (result?.isAuthentic === true) return 'Authentic';
  if (result?.isAuthentic === false) return 'Counterfeit risk';
  if (result?.status === 'suspicious') return 'Needs review';
  return 'Inconclusive';
};

const getNextStep = (result = {}, qualityScore, confidenceBand) => {
  if (result?.isAuthentic === true) {
    return 'Safe to proceed, but keep the record for reference and batch traceability.';
  }

  if (result?.isAuthentic === false) {
    return 'Do not use this medicine. Escalate to a pharmacist or local regulator immediately.';
  }

  if (qualityScore !== null && qualityScore < 70) {
    return 'Retake the photo in brighter light with the label centered, then verify again.';
  }

  if (confidenceBand === 'medium') {
    return 'Ask a pharmacist to confirm the package details before use.';
  }

  return 'Capture a clearer image or provide a second angle for a stronger decision.';
};

const collectVisualSignals = (result = {}) => {
  const positiveSignals = [];
  const concernSignals = [];

  const pushSignal = (collection, label, score, type) => {
    if (score === null) return;

    collection.push({
      label,
      score,
      type,
      tone:
        score >= 85 ? 'strong' : score >= 70 ? 'moderate' : 'weak'
    });
  };

  const visualFingerprint = result?.analysis?.visualFingerprint || {};
  Object.entries(visualFingerprint).forEach(([key, value]) => {
    const score = clampScore(value);
    const label = FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').trim();

    if (score === null) return;

    if (score >= 75) {
      pushSignal(positiveSignals, label, score, 'visual');
    } else {
      pushSignal(concernSignals, label, score, 'visual');
    }
  });

  const historySignals = [
    ['Font match', result?.analysisDetails?.fontMatch],
    ['Color match', result?.analysisDetails?.colorMatch],
    ['Texture match', result?.analysisDetails?.textureMatch],
    ['Overall score', result?.analysisDetails?.overallScore],
  ];

  historySignals.forEach(([label, value]) => {
    const score = clampScore(value);
    if (score === null) return;

    if (score >= 75) {
      pushSignal(positiveSignals, label, score, 'history');
    } else {
      pushSignal(concernSignals, label, score, 'history');
    }
  });

  const securityFeatures = result?.analysisDetails?.securityFeatures;
  if (Array.isArray(securityFeatures)) {
    securityFeatures.forEach((feature) => {
      if (feature) {
        positiveSignals.push({
          label: feature,
          score: 100,
          type: 'security',
          tone: 'strong'
        });
      }
    });
  }

  return {
    positiveSignals: positiveSignals.slice(0, 4),
    concernSignals: concernSignals.slice(0, 4),
  };
};

export const buildVerificationInsights = (result = {}) => {
  const qualityScore = clampScore(
    result?.ocrQualityScore ?? result?.analysisDetails?.ocrQualityScore
  );
  const confidenceBand = getConfidenceBand(result);
  const verdictLabel = getVerdictLabel(result);
  const { positiveSignals, concernSignals } = collectVisualSignals(result);

  const actionRecommendation =
    result?.actionRecommendation ||
    result?.analysisDetails?.recommendation ||
    getNextStep(result, qualityScore, confidenceBand);

  const summary = `${verdictLabel} with ${confidenceBand} confidence. ${actionRecommendation}`;

  const quickFacts = [
    {
      label: 'Confidence band',
      value: confidenceBand,
    },
    {
      label: 'OCR quality',
      value: qualityScore === null ? 'Unknown' : `${qualityScore}%`,
    },
    {
      label: 'Analysis time',
      value: result?.processingTime || result?.analysisDetails?.processingTime || '2-3s',
    },
  ];

  return {
    verdictLabel,
    confidenceBand,
    qualityScore,
    actionRecommendation,
    summary,
    quickFacts,
    positiveSignals,
    concernSignals,
    nextStep: getNextStep(result, qualityScore, confidenceBand),
  };
};

export const getScanQualityGuidance = (result = {}) => {
  const qualityScore = clampScore(
    result?.ocrQualityScore ?? result?.analysisDetails?.ocrQualityScore
  );

  if (qualityScore === null) {
    return null;
  }

  if (qualityScore >= 85) {
    return {
      variant: 'success',
      title: 'Scan quality looks strong',
      description: 'The label is clear enough for reliable OCR and visual matching.',
      tips: [],
    };
  }

  return {
    variant: qualityScore >= 70 ? 'warning' : 'error',
    title: 'Retake recommended' + (qualityScore >= 70 ? ' for better accuracy' : ''),
    description:
      result?.ocrQualityReason ||
      'Move the package into brighter light, keep it flat, and center the label before scanning again.',
    tips: [
      'Use a brighter, even light source.',
      'Hold the camera steady and avoid motion blur.',
      'Keep the medicine name, batch number, and expiry date fully visible.',
    ],
  };
};

export default buildVerificationInsights;