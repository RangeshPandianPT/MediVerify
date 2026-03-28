import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import VerificationStatusIndicator from '../../../components/ui/VerificationStatusIndicator';
import { verifyMedicine } from '../../../utils/api';
import { verificationStorage } from '../../../utils/storage';

const VerificationProcessor = ({ 
  imageFile, 
  onComplete, 
  onReset,
  className = '' 
}) => {
  const [processingStage, setProcessingStage] = useState('analyzing');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [feedbackChoice, setFeedbackChoice] = useState(null);

  const processingStages = [
    { id: 'analyzing', label: 'Analyzing Image', duration: 800 },
    { id: 'extracting', label: 'Extracting Features', duration: 600 },
    { id: 'comparing', label: 'AI Model Processing', duration: 1000 },
    { id: 'calculating', label: 'Calculating Confidence', duration: 400 },
    { id: 'complete', label: 'Verification Complete', duration: 200 }
  ];

  useEffect(() => {
    if (!imageFile) return;

    let currentStageIndex = 0;
    let isCancelled = false;

    // Start the real API verification
    const verifyImage = async () => {
      try {
        setSavedToHistory(false);
        setFeedbackChoice(null);

        // Start progress animation while API processes
        const animateProgress = () => {
          if (isCancelled) return;
          
          if (currentStageIndex >= processingStages.length - 1) return;

          const currentStage = processingStages[currentStageIndex];
          setProcessingStage(currentStage.id);

          const stageProgress = 100 / processingStages.length;
          const endProgress = (currentStageIndex + 1) * stageProgress;
          
          setProgress(Math.floor(endProgress));
          
          currentStageIndex++;
          if (currentStageIndex < processingStages.length - 1) {
            setTimeout(animateProgress, currentStage.duration);
          }
        };

        animateProgress();

        // Call the real API
        const apiResult = await verifyMedicine(imageFile);
        
        if (isCancelled) return;

        // Complete the progress
        setProgress(100);
        setProcessingStage('complete');
        setResult(apiResult);
        onComplete?.(apiResult);

      } catch (err) {
        if (isCancelled) return;
        console.error('Verification error:', err);
        setError(err.message || 'Verification failed. Please try again.');
      }
    };

    verifyImage();

    return () => {
      isCancelled = true;
    };
  }, [imageFile]);

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'analyzing': return 'Search';
      case 'extracting': return 'Scan';
      case 'comparing': return 'Cpu';
      case 'calculating': return 'Calculator';
      case 'complete': return 'CheckCircle';
      default: return 'Loader';
    }
  };

  const getCurrentStageLabel = () => {
    const stage = processingStages?.find(s => s?.id === processingStage);
    return stage?.label || 'Processing...';
  };

  const handleSaveToHistory = () => {
    if (!result || savedToHistory) return;

    const historyRecord = {
      verificationId: result?.id,
      medicineName: result?.medicineDetails?.name || 'Unknown Medicine',
      verificationDate: result?.timestamp,
      credibilityPercentage: result?.credibilityPercentage,
      isAuthentic: result?.isAuthentic,
      status: 'completed',
      batchNumber: result?.medicineDetails?.batchNumber,
      manufacturer: result?.medicineDetails?.manufacturer,
      expiryDate: result?.medicineDetails?.expDate,
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
    };

    const saved = verificationStorage.addVerification(historyRecord);
    if (saved) {
      setSavedToHistory(true);
    }
  };

  const handleFeedback = (helpful) => {
    if (!result?.id) return;
    const saved = verificationStorage.saveFeedback({
      verificationId: result.id,
      helpful,
    });

    if (saved) {
      setFeedbackChoice(helpful);
    }
  };

  // Error state
  if (error) {
    return (
      <div className={`text-center ${className}`}>
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-error/20">
          <Icon name="AlertCircle" size={48} color="var(--color-error)" />
        </div>
        <h2 className="text-2xl font-bold text-error mb-2">Verification Failed</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus-medical"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (result) {
    const isAuthentic = result?.isAuthentic === true;
    const isFake = result?.isAuthentic === false && result?.status !== 'suspicious';

    return (
      <div className={`${className}`}>
        {/* Verification Result */}
        <div className="text-center mb-8">
          <div className={`
            w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
            ${isAuthentic
              ? 'bg-success/20 glow-success'
              : isFake
              ? 'bg-error/20 glow-error'
              : 'bg-warning/20 glow-warning'
            }
          `}>
            <Icon 
              name={isAuthentic ? 'CheckCircle' : isFake ? 'XCircle' : 'AlertTriangle'} 
              size={48} 
              color={
                isAuthentic
                  ? 'var(--color-success)'
                  : isFake
                  ? 'var(--color-error)'
                  : 'var(--color-warning)'
              }
            />
          </div>
          
          <h2 className={`
            text-3xl font-bold mb-2
            ${isAuthentic ? 'text-success' : isFake ? 'text-error' : 'text-warning'}
          `}>
            {isAuthentic ? 'Medicine Verified ✅' : isFake ? 'Fake Detected ❌' : 'Review Recommended ⚠️'}
          </h2>
          
          <p className="text-muted-foreground">
            {isAuthentic
              ? 'This medicine appears to be genuine and safe to use.'
              : isFake
              ? 'This medicine shows signs of being counterfeit. Do not use.'
              : 'The scan is inconclusive. Capture a clearer image or request pharmacist confirmation.'
            }
          </p>
        </div>
        {/* Status Indicator */}
        <VerificationStatusIndicator
          credibilityPercentage={result?.credibilityPercentage}
          isAuthentic={result?.isAuthentic}
          status={result?.status}
          size="lg"
          animated={true}
          className="mb-8"
        />

        {/* Decision Quality Guidance */}
        <div className="bg-muted/40 border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Confidence Band</p>
              <p className="font-semibold text-foreground capitalize">
                {result?.confidenceBand || 'unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">OCR Quality</p>
              <p className="font-semibold text-foreground">
                {result?.ocrQualityScore ?? 0}%
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {result?.actionRecommendation || 'Follow pharmacist guidance before taking medicine.'}
          </p>
          {result?.ocrQualityReason && (
            <p className="text-xs text-muted-foreground mt-2">
              OCR note: {result.ocrQualityReason}
            </p>
          )}
        </div>
        {/* Medicine Details */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Pill" size={20} className="mr-2" />
            Medicine Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{result?.medicineDetails?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manufacturer</p>
              <p className="font-medium">{result?.medicineDetails?.manufacturer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Batch Number</p>
              <p className="font-mono text-sm">{result?.medicineDetails?.batchNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MRP</p>
              <p className="font-medium">{result?.medicineDetails?.mrp}</p>
            </div>
          </div>
        </div>
        {/* Visual Analysis */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Eye" size={20} className="mr-2" />
            Visual Fingerprint Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(result?.analysis?.visualFingerprint)?.map(([key, value]) => (
              <div key={key} className="text-center">
                <div className={`
                  w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center
                  ${value > 70 ? 'bg-success/20' : 'bg-error/20'}
                `}>
                  <span className={`
                    font-bold text-sm
                    ${value > 70 ? 'text-success' : 'text-error'}
                  `}>
                    {value}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground capitalize">
                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus-medical"
          >
            Verify Another Medicine
          </button>
          <button
            onClick={handleSaveToHistory}
            disabled={savedToHistory}
            className="flex-1 px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-medical disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {savedToHistory ? 'Saved to History' : 'Save to History'}
          </button>
        </div>

        {/* Quick feedback loop for future model quality improvements */}
        <div className="mt-6 p-4 bg-card border border-border rounded-lg">
          <p className="text-sm font-medium text-foreground mb-3">Was this verification result helpful?</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleFeedback(true)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                feedbackChoice === true
                  ? 'bg-success/20 border-success text-success'
                  : 'bg-background border-border text-foreground hover:bg-muted'
              }`}
            >
              Yes, looks correct
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                feedbackChoice === false
                  ? 'bg-error/20 border-error text-error'
                  : 'bg-background border-border text-foreground hover:bg-muted'
              }`}
            >
              No, needs review
            </button>
          </div>
        </div>
        {/* Emergency Action for Fake Medicine */}
        {result?.isAuthentic === false && result?.status !== 'suspicious' && (
          <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
              <span className="font-medium text-error">Fake Medicine Detected</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Report this immediately to protect others in your community.
            </p>
            <button className="w-full px-4 py-2 bg-error text-error-foreground rounded-lg font-medium hover:bg-error/90 transition-colors focus-medical">
              Report Fake Medicine
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {/* Processing Animation */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 transform -rotate-90" width="128" height="128">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="var(--color-primary)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon 
              name={getStageIcon(processingStage)} 
              size={32} 
              color="var(--color-primary)"
              className="animate-pulse" 
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">AI Verification in Progress</h2>
        <p className="text-muted-foreground mb-4">{getCurrentStageLabel()}</p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground">{progress}% Complete</p>
      </div>
      {/* Processing Steps */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Verification Process</h3>
        <div className="space-y-3">
          {processingStages?.slice(0, -1)?.map((stage, index) => (
            <div key={stage?.id} className="flex items-center space-x-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${processingStages?.findIndex(s => s?.id === processingStage) > index
                  ? 'bg-success text-success-foreground'
                  : processingStages?.findIndex(s => s?.id === processingStage) === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {processingStages?.findIndex(s => s?.id === processingStage) > index ? (
                  <Icon name="Check" size={12} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span className={`
                text-sm
                ${processingStages?.findIndex(s => s?.id === processingStage) >= index
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
                }
              `}>
                {stage?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Tips During Processing */}
      <div className="mt-6 bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} color="var(--color-accent)" />
          <div>
            <h4 className="text-accent text-sm font-medium mb-1">Did you know?</h4>
            <p className="text-muted-foreground text-xs">
              Our AI analyzes over 50 visual markers including fonts, colors, textures, and security features to determine medicine authenticity with 99.2% accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationProcessor;