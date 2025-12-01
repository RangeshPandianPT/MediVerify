import React from 'react';
import Icon from '../AppIcon';

const VerificationStatusIndicator = ({ 
  credibilityPercentage = 0, 
  isAuthentic = null, 
  status = 'pending',
  size = 'default',
  showDetails = true,
  animated = true,
  className = ''
}) => {
  const getStatusConfig = () => {
    if (isAuthentic === true || status === 'authentic') {
      return {
        color: 'success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        glowClass: 'glow-success',
        icon: 'CheckCircle',
        label: 'Authentic',
        description: 'Medicine verified as genuine'
      };
    }
    
    if (isAuthentic === false || status === 'fake') {
      return {
        color: 'error',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        glowClass: 'glow-error',
        icon: 'XCircle',
        label: 'Fake Detected',
        description: 'Medicine appears to be counterfeit'
      };
    }
    
    if (status === 'suspicious' || (credibilityPercentage > 0 && credibilityPercentage < 70)) {
      return {
        color: 'warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        glowClass: 'glow-warning',
        icon: 'AlertTriangle',
        label: 'Suspicious',
        description: 'Requires additional verification'
      };
    }
    
    return {
      color: 'muted',
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      glowClass: '',
      icon: 'Clock',
      label: 'Processing',
      description: 'Analyzing medicine authenticity'
    };
  };

  const config = getStatusConfig();
  
  const sizeClasses = {
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24
  };

  const progressSize = {
    sm: 'w-12 h-12',
    default: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const RadialProgress = ({ percentage, color }) => {
    const radius = size === 'sm' ? 20 : size === 'lg' ? 36 : 28;
    const strokeWidth = size === 'sm' ? 3 : 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative ${progressSize?.[size]} flex items-center justify-center`}>
        <svg 
          className={`absolute inset-0 transform -rotate-90 ${animated ? 'transition-all duration-1000' : ''}`}
          width="100%" 
          height="100%"
        >
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={`var(--color-${color})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={animated ? 'transition-all duration-1000 ease-out' : ''}
          />
        </svg>
        <div className="relative z-10 text-center">
          <div className={`font-mono font-bold ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}`}>
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`
      ${sizeClasses?.[size]} ${config?.bgColor} ${config?.borderColor} border rounded-xl
      ${animated && config?.glowClass ? config?.glowClass : ''}
      ${animated ? 'transition-all duration-300' : ''}
      ${className}
    `}>
      <div className="flex items-center space-x-4">
        {/* Status Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${config?.color === 'success' ? 'bg-success/20' : 
            config?.color === 'error' ? 'bg-error/20' : 
            config?.color === 'warning' ? 'bg-warning/20' : 'bg-muted'}
        `}>
          <Icon 
            name={config?.icon} 
            size={iconSizes?.[size]} 
            color={`var(--color-${config?.color})`} 
          />
        </div>

        {/* Status Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
              {config?.label}
            </h3>
            {credibilityPercentage > 0 && (
              <span className={`font-mono font-bold ${
                config?.color === 'success' ? 'text-success' : 
                config?.color === 'error' ? 'text-error' : 
                config?.color === 'warning' ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {credibilityPercentage}%
              </span>
            )}
          </div>
          
          {showDetails && (
            <p className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'} mt-1`}>
              {config?.description}
            </p>
          )}
        </div>

        {/* Radial Progress */}
        {credibilityPercentage > 0 && (
          <div className="flex-shrink-0">
            <RadialProgress percentage={credibilityPercentage} color={config?.color} />
          </div>
        )}
      </div>
      {/* Additional Details for Large Size */}
      {size === 'lg' && showDetails && credibilityPercentage > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Confidence</div>
              <div className="font-mono font-semibold">{credibilityPercentage}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Analysis</div>
              <div className="font-mono font-semibold">AI Verified</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className={`font-semibold text-xs ${
                config?.color === 'success' ? 'text-success' : 
                config?.color === 'error' ? 'text-error' : 
                config?.color === 'warning' ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {config?.label}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStatusIndicator;