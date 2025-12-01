import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with bank-level security'
    },
    {
      icon: 'Lock',
      title: 'Privacy First',
      description: 'We never share your personal information'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by thousands of Indian families'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Medicines Verified' },
    { value: '15,000+', label: 'Active Users' },
    { value: '99.8%', label: 'Accuracy Rate' }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Secure & Trusted</h3>
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{feature?.title}</h4>
              <p className="text-xs text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Platform Stats */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 text-center">Platform Statistics</h3>
        <div className="grid grid-cols-1 gap-3">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-primary">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="bg-error/5 border border-error/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Phone" size={16} color="var(--color-error)" />
          <span className="text-sm font-medium text-error">Emergency Helpline</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Report fake medicines immediately
        </p>
        <p className="text-sm font-mono text-foreground">1800-FDA-HELP</p>
      </div>
    </div>
  );
};

export default TrustSignals;