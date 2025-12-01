import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformBranding = ({ showTagline = true, size = 'default' }) => {
  const sizeClasses = {
    sm: {
      logo: 'w-8 h-8',
      title: 'text-xl',
      tagline: 'text-sm',
      spacing: 'space-y-2'
    },
    default: {
      logo: 'w-12 h-12',
      title: 'text-3xl',
      tagline: 'text-base',
      spacing: 'space-y-3'
    },
    lg: {
      logo: 'w-16 h-16',
      title: 'text-4xl',
      tagline: 'text-lg',
      spacing: 'space-y-4'
    }
  };

  const classes = sizeClasses?.[size];

  return (
    <div className={`text-center ${classes?.spacing}`}>
      {/* Logo */}
      <div className="flex justify-center">
        <div className={`${classes?.logo} bg-primary rounded-xl flex items-center justify-center shadow-medical`}>
          <Icon name="Shield" size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24} color="white" />
        </div>
      </div>
      {/* Brand Name */}
      <div>
        <h1 className={`${classes?.title} font-bold text-foreground`}>
          MediVerify
        </h1>
        <div className="flex items-center justify-center space-x-1 mt-1">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-accent">AI-Powered</span>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      {/* Tagline */}
      {showTagline && (
        <p className={`${classes?.tagline} text-muted-foreground font-medium`}>
          Protect your family. Verify your medicine in seconds.
        </p>
      )}
      {/* Mission Statement */}
      {size === 'lg' && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Combating India's ₹30,000 crore fake medicine crisis with 
            <span className="text-primary font-medium"> forensic-level AI verification</span>
          </p>
        </div>
      )}
      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} color="var(--color-success)" />
          <span>Secure</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Icon name="Zap" size={12} color="var(--color-accent)" />
          <span>Instant</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={12} color="var(--color-primary)" />
          <span>Trusted</span>
        </div>
      </div>
    </div>
  );
};

export default PlatformBranding;