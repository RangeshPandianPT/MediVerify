import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const VerificationGuide = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('tips');

  const verificationTips = [
    {
      icon: 'Camera',
      title: 'Good Lighting',
      description: 'Ensure the medicine package is well-lit and clearly visible'
    },
    {
      icon: 'Focus',
      title: 'Sharp Focus',
      description: 'Keep the camera steady and ensure text is in sharp focus'
    },
    {
      icon: 'Maximize',
      title: 'Full Package',
      description: 'Include the entire medicine label and packaging in the frame'
    },
    {
      icon: 'Eye',
      title: 'Clear Text',
      description: 'Make sure all text, batch numbers, and dates are readable'
    }
  ];

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Holographic Elements',
      description: 'Look for holographic stickers or security seals that change color'
    },
    {
      icon: 'QrCode',
      title: 'QR Codes',
      description: 'Authentic medicines often have QR codes for verification'
    },
    {
      icon: 'Hash',
      title: 'Serial Numbers',
      description: 'Check for unique serial numbers and batch codes'
    },
    {
      icon: 'Stamp',
      title: 'Official Stamps',
      description: 'Government approval stamps and manufacturer seals'
    }
  ];

  const warningSignsData = [
    {
      icon: 'AlertTriangle',
      title: 'Poor Print Quality',
      description: 'Blurry text, uneven colors, or smudged printing',
      severity: 'high'
    },
    {
      icon: 'Spell',
      title: 'Spelling Errors',
      description: 'Misspelled medicine names or manufacturer details',
      severity: 'high'
    },
    {
      icon: 'DollarSign',
      title: 'Unusually Low Price',
      description: 'Prices significantly below market rates',
      severity: 'medium'
    },
    {
      icon: 'Package',
      title: 'Damaged Packaging',
      description: 'Torn, resealed, or tampered packaging',
      severity: 'high'
    },
    {
      icon: 'Calendar',
      title: 'Date Issues',
      description: 'Missing, unclear, or suspicious expiry dates',
      severity: 'medium'
    },
    {
      icon: 'MapPin',
      title: 'Unknown Source',
      description: 'Purchased from unverified or suspicious sellers',
      severity: 'low'
    }
  ];

  const tabs = [
    { id: 'tips', label: 'Photo Tips', icon: 'Camera' },
    { id: 'security', label: 'Security Features', icon: 'Shield' },
    { id: 'warnings', label: 'Warning Signs', icon: 'AlertTriangle' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error/10';
      case 'medium': return 'bg-warning/10';
      case 'low': return 'bg-muted/50';
      default: return 'bg-muted/50';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Verification Guide</h3>
          <p className="text-sm text-muted-foreground">Tips for accurate medicine verification</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === tab?.id
                ? 'bg-background text-foreground shadow-medical-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'tips' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {verificationTips?.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={tip?.icon} size={16} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{tip?.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{tip?.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Example Image */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Icon name="Image" size={16} className="mr-2" />
                Good vs Bad Examples
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-full h-32 bg-success/10 border-2 border-success/20 rounded-lg flex items-center justify-center mb-2">
                    <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                  </div>
                  <p className="text-sm font-medium text-success">✅ Good Photo</p>
                  <p className="text-xs text-muted-foreground">Clear, well-lit, focused</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-32 bg-error/10 border-2 border-error/20 rounded-lg flex items-center justify-center mb-2">
                    <Icon name="XCircle" size={32} color="var(--color-error)" />
                  </div>
                  <p className="text-sm font-medium text-error">❌ Poor Photo</p>
                  <p className="text-xs text-muted-foreground">Blurry, dark, partial</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            {securityFeatures?.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={feature?.icon} size={20} color="var(--color-accent)" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{feature?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{feature?.description}</p>
                </div>
              </div>
            ))}

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} color="var(--color-accent)" />
                <span className="font-medium text-accent">Pro Tip</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Authentic medicines from reputable manufacturers will have multiple security features. 
                The absence of these features doesn't always mean fake, but their presence increases authenticity confidence.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="space-y-3">
            {warningSignsData?.map((warning, index) => (
              <div key={index} className={`
                flex items-start space-x-3 p-4 rounded-lg border
                ${getSeverityBg(warning?.severity)} border-current/20
              `}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${warning?.severity === 'high' ? 'bg-error/20' : 
                    warning?.severity === 'medium' ? 'bg-warning/20' : 'bg-muted'}
                `}>
                  <Icon 
                    name={warning?.icon} 
                    size={16} 
                    color={warning?.severity === 'high' ? 'var(--color-error)' : 
                           warning?.severity === 'medium' ? 'var(--color-warning)' : 'var(--color-muted-foreground)'}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{warning?.title}</h4>
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${warning?.severity === 'high' ? 'bg-error/20 text-error' : 
                        warning?.severity === 'medium' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}
                    `}>
                      {warning?.severity?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{warning?.description}</p>
                </div>
              </div>
            ))}

            <div className="bg-error/5 border border-error/20 rounded-lg p-4 mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
                <span className="font-medium text-error">Important</span>
              </div>
              <p className="text-sm text-muted-foreground">
                If you suspect a medicine is fake, do not consume it. Report it immediately to authorities 
                and consult with a healthcare professional for alternatives.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="Phone"
          iconPosition="left"
        >
          Emergency Helpline
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="ExternalLink"
          iconPosition="left"
        >
          Report Fake Medicine
        </Button>
      </div>
    </div>
  );
};

export default VerificationGuide;