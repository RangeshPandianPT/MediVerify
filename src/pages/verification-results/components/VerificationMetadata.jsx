import React from 'react';
import Icon from '../../../components/AppIcon';

const VerificationMetadata = ({ 
  metadata = {},
  className = ''
}) => {
  const mockMetadata = {
    timestamp: new Date()?.toISOString(),
    analysisTime: '2.3 seconds',
    confidenceLevel: 94.2,
    verificationId: 'VER-2025100904432',
    aiModel: 'MediVerify AI v3.2',
    databaseVersion: '2025.10.1',
    imageResolution: '1920x1080',
    processingNode: 'Mumbai-01',
    referenceImages: 847,
    securityLevel: 'High'
  };

  const data = { ...mockMetadata, ...metadata };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date?.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = formatTimestamp(data?.timestamp);

  const metadataItems = [
    {
      icon: 'Calendar',
      label: 'Verification Date',
      value: date,
      subValue: time
    },
    {
      icon: 'Clock',
      label: 'Analysis Time',
      value: data?.analysisTime,
      subValue: 'Processing Speed'
    },
    {
      icon: 'TrendingUp',
      label: 'Confidence Level',
      value: `${data?.confidenceLevel}%`,
      subValue: 'AI Certainty'
    },
    {
      icon: 'Hash',
      label: 'Verification ID',
      value: data?.verificationId,
      subValue: 'Reference Number'
    },
    {
      icon: 'Cpu',
      label: 'AI Model',
      value: data?.aiModel,
      subValue: 'Analysis Engine'
    },
    {
      icon: 'Database',
      label: 'Database Version',
      value: data?.databaseVersion,
      subValue: 'Reference Data'
    },
    {
      icon: 'Image',
      label: 'Image Quality',
      value: data?.imageResolution,
      subValue: 'Resolution'
    },
    {
      icon: 'Server',
      label: 'Processing Node',
      value: data?.processingNode,
      subValue: 'Server Location'
    },
    {
      icon: 'Search',
      label: 'References Checked',
      value: data?.referenceImages?.toLocaleString(),
      subValue: 'Database Matches'
    },
    {
      icon: 'Shield',
      label: 'Security Level',
      value: data?.securityLevel,
      subValue: 'Verification Grade'
    }
  ];

  return (
    <div className={`bg-card border border-border rounded-xl shadow-medical ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Verification Details</h3>
            <p className="text-sm text-muted-foreground">Technical metadata and processing information</p>
          </div>
        </div>
      </div>
      {/* Metadata Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {metadataItems?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={item?.icon} size={16} color="var(--color-muted-foreground)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item?.label}</span>
                  <span className="font-mono text-sm text-primary font-semibold">{item?.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item?.subValue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Verification Certificate */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Award" size={16} color="var(--color-success)" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">Verification Certificate</h4>
            <p className="text-xs text-muted-foreground mb-3">
              This verification has been processed using MediVerify's certified AI analysis system 
              and meets pharmaceutical authentication standards.
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={12} color="var(--color-success)" />
                <span className="text-success">AI Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} color="var(--color-primary)" />
                <span className="text-primary">Secure Process</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationMetadata;