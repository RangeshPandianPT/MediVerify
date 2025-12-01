import React from 'react';
import Icon from '../../../components/AppIcon';
import VerificationStatusIndicator from '../../../components/ui/VerificationStatusIndicator';

const ResultStatusCard = ({ 
  result = {},
  animated = true,
  className = ''
}) => {
  const { 
    isAuthentic, 
    credibilityPercentage = 0, 
    medicineName = 'Unknown Medicine',
    batchNumber = 'N/A',
    verificationId = 'VER-000000'
  } = result;

  const getResultConfig = () => {
    if (isAuthentic === true) {
      return {
        status: 'authentic',
        title: 'Medicine Verified as Genuine',
        subtitle: 'This medicine appears to be authentic',
        bgGradient: 'bg-gradient-to-br from-success/10 to-success/5',
        borderColor: 'border-success/30',
        glowClass: animated ? 'glow-success' : ''
      };
    }
    
    if (isAuthentic === false) {
      return {
        status: 'fake',
        title: 'Fake Medicine Detected',
        subtitle: 'This medicine appears to be counterfeit',
        bgGradient: 'bg-gradient-to-br from-error/10 to-error/5',
        borderColor: 'border-error/30',
        glowClass: animated ? 'glow-error' : ''
      };
    }
    
    return {
      status: 'suspicious',
      title: 'Verification Inconclusive',
      subtitle: 'Additional verification recommended',
      bgGradient: 'bg-gradient-to-br from-warning/10 to-warning/5',
      borderColor: 'border-warning/30',
      glowClass: animated ? 'glow-warning' : ''
    };
  };

  const config = getResultConfig();

  return (
    <div className={`
      ${config?.bgGradient} ${config?.borderColor} ${config?.glowClass}
      border-2 rounded-2xl p-8 text-center transition-all duration-500
      ${className}
    `}>
      {/* Main Status Indicator */}
      <div className="mb-6">
        <VerificationStatusIndicator
          isAuthentic={isAuthentic}
          credibilityPercentage={credibilityPercentage}
          size="lg"
          animated={animated}
          className="bg-transparent border-0 p-0"
        />
      </div>
      {/* Result Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {config?.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {config?.subtitle}
        </p>
      </div>
      {/* Medicine Details */}
      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Medicine Name</div>
            <div className="font-semibold text-foreground">{medicineName}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Batch Number</div>
            <div className="font-mono text-foreground">{batchNumber}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Verification ID</div>
            <div className="font-mono text-primary">{verificationId}</div>
          </div>
        </div>
      </div>
      {/* Confidence Score */}
      <div className="flex items-center justify-center space-x-2">
        <Icon name="Shield" size={20} color="var(--color-primary)" />
        <span className="text-sm text-muted-foreground">
          Confidence Level: 
        </span>
        <span className="font-bold text-primary">
          {credibilityPercentage}%
        </span>
      </div>
    </div>
  );
};

export default ResultStatusCard;