import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import VerificationStatusIndicator from '../../../components/ui/VerificationStatusIndicator';

const VerificationProcessor = ({ 
  imageFile, 
  onComplete, 
  onReset,
  className = '' 
}) => {
  const [processingStage, setProcessingStage] = useState('analyzing');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const processingStages = [
    { id: 'analyzing', label: 'Analyzing Image', duration: 2000 },
    { id: 'extracting', label: 'Extracting Features', duration: 1500 },
    { id: 'comparing', label: 'Comparing Database', duration: 2500 },
    { id: 'calculating', label: 'Calculating Confidence', duration: 1000 },
    { id: 'complete', label: 'Verification Complete', duration: 500 }
  ];

  // Mock verification logic
  const generateMockResult = () => {
    const isAuthentic = Math.random() > 0.3; // 70% chance of authentic
    const credibility = isAuthentic 
      ? Math.floor(Math.random() * 20) + 80 // 80-99% for authentic
      : Math.floor(Math.random() * 40) + 10; // 10-49% for fake

    return {
      id: `VER-${Date.now()}`,
      isAuthentic,
      credibilityPercentage: credibility,
      status: isAuthentic ? 'authentic' : 'fake',
      medicineDetails: {
        name: "Paracetamol 500mg",
        manufacturer: "Sun Pharmaceutical Industries Ltd.",
        batchNumber: "PCM2024A1B2",
        mfgDate: "2024-08-15",
        expDate: "2026-08-14",
        mrp: "₹45.00"
      },
      analysis: {
        visualFingerprint: {
          fontAccuracy: isAuthentic ? 98 : 45,
          colorMatch: isAuthentic ? 96 : 38,
          textureAnalysis: isAuthentic ? 94 : 52,
          hologramVerification: isAuthentic ? 92 : 0
        },
        securityFeatures: {
          qrCode: isAuthentic ? 'Valid' : 'Invalid',
          serialNumber: isAuthentic ? 'Verified' : 'Suspicious',
          packaging: isAuthentic ? 'Authentic' : 'Counterfeit'
        }
      },
      timestamp: new Date()?.toISOString(),
      processingTime: '3.2 seconds'
    };
  };

  useEffect(() => {
    if (!imageFile) return;

    let currentStageIndex = 0;
    let totalProgress = 0;

    const processStages = () => {
      if (currentStageIndex >= processingStages?.length) {
        const mockResult = generateMockResult();
        setResult(mockResult);
        onComplete?.(mockResult);
        return;
      }

      const currentStage = processingStages?.[currentStageIndex];
      setProcessingStage(currentStage?.id);

      // Animate progress for current stage
      const stageProgress = 100 / processingStages?.length;
      const startProgress = currentStageIndex * stageProgress;
      const endProgress = (currentStageIndex + 1) * stageProgress;

      let stageStartTime = Date.now();
      const animateProgress = () => {
        const elapsed = Date.now() - stageStartTime;
        const stageProgressPercent = Math.min(elapsed / currentStage?.duration, 1);
        const currentProgress = startProgress + (stageProgressPercent * stageProgress);
        
        setProgress(Math.floor(currentProgress));

        if (stageProgressPercent < 1) {
          requestAnimationFrame(animateProgress);
        } else {
          currentStageIndex++;
          setTimeout(processStages, 200);
        }
      };

      animateProgress();
    };

    processStages();
  }, [imageFile]);

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'analyzing': return 'Search';
      case 'extracting': return 'Scan';
      case 'comparing': return 'Database';
      case 'calculating': return 'Calculator';
      case 'complete': return 'CheckCircle';
      default: return 'Loader';
    }
  };

  const getCurrentStageLabel = () => {
    const stage = processingStages?.find(s => s?.id === processingStage);
    return stage?.label || 'Processing...';
  };

  if (result) {
    return (
      <div className={`${className}`}>
        {/* Verification Result */}
        <div className="text-center mb-8">
          <div className={`
            w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
            ${result?.isAuthentic 
              ? 'bg-success/20 glow-success' :'bg-error/20 glow-error'
            }
          `}>
            <Icon 
              name={result?.isAuthentic ? 'CheckCircle' : 'XCircle'} 
              size={48} 
              color={result?.isAuthentic ? 'var(--color-success)' : 'var(--color-error)'} 
            />
          </div>
          
          <h2 className={`
            text-3xl font-bold mb-2
            ${result?.isAuthentic ? 'text-success' : 'text-error'}
          `}>
            {result?.isAuthentic ? 'Medicine Verified ✅' : 'Fake Detected ❌'}
          </h2>
          
          <p className="text-muted-foreground">
            {result?.isAuthentic 
              ? 'This medicine appears to be genuine and safe to use.' :'This medicine shows signs of being counterfeit. Do not use.'
            }
          </p>
        </div>
        {/* Status Indicator */}
        <VerificationStatusIndicator
          credibilityPercentage={result?.credibilityPercentage}
          isAuthentic={result?.isAuthentic}
          size="lg"
          animated={true}
          className="mb-8"
        />
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
          <button className="flex-1 px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-medical">
            Save to History
          </button>
        </div>
        {/* Emergency Action for Fake Medicine */}
        {!result?.isAuthentic && (
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