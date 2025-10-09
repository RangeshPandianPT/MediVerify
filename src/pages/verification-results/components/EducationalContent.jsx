import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EducationalContent = ({ 
  verificationResult = {},
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState('authenticity');

  const { isAuthentic } = verificationResult;

  const educationalSections = {
    authenticity: {
      title: 'Understanding Authenticity Markers',
      icon: 'Shield',
      content: isAuthentic ? {
        title: 'Authentic Medicine Indicators',
        points: [
          'Clear, sharp printing with consistent font quality',
          'Proper color matching with manufacturer standards',
          'Correct spelling and grammar on all labels',
          'Valid batch numbers and expiry dates',
          'Appropriate packaging materials and thickness',
          'Holographic security features where applicable'
        ],
        tip: 'Always purchase medicines from licensed pharmacies and verify packaging quality before use.'
      } : {
        title: 'Common Fake Medicine Warning Signs',
        points: [
          'Blurry or poor-quality printing and text',
          'Incorrect colors or faded packaging',
          'Spelling mistakes or grammatical errors',
          'Missing or suspicious batch numbers',
          'Unusually cheap prices compared to market rates',
          'Packaging that feels thin or flimsy'
        ],
        tip: 'If you suspect a medicine is fake, do not consume it and report to authorities immediately.'
      }
    },
    safety: {
      title: 'Medicine Safety Guidelines',
      icon: 'Heart',
      content: {
        title: 'Safe Medicine Practices',
        points: [
          'Always check expiry dates before consumption',
          'Store medicines in appropriate conditions',
          'Follow prescribed dosages exactly',
          'Keep medicines in original packaging',
          'Dispose of expired medicines properly',
          'Consult healthcare providers for any concerns'
        ],
        tip: 'When in doubt about medicine authenticity or safety, always consult your healthcare provider.'
      }
    },
    reporting: {
      title: 'Reporting Fake Medicines',
      icon: 'AlertTriangle',
      content: {
        title: 'How to Report Counterfeit Medicines',
        points: [
          'Contact FDA helpline: 1800-180-3024 (24/7)',
          'Report to local drug control authorities',
          'Preserve the medicine packaging as evidence',
          'Document purchase location and date',
          'Share verification results with authorities',
          'Follow up on your report status'
        ],
        tip: 'Your report can help prevent others from consuming dangerous counterfeit medicines.'
      }
    },
    prevention: {
      title: 'Prevention & Best Practices',
      icon: 'CheckCircle',
      content: {
        title: 'Preventing Counterfeit Medicine Exposure',
        points: [
          'Buy only from licensed, reputable pharmacies',
          'Verify pharmacy credentials and licenses',
          'Be cautious of unusually low prices',
          'Use MediVerify app before consuming new medicines',
          'Check manufacturer websites for authenticity',
          'Maintain records of all medicine purchases'
        ],
        tip: 'Prevention is the best protection against counterfeit medicines. Stay vigilant and verify regularly.'
      }
    }
  };

  const sections = [
    { id: 'authenticity', label: 'Authenticity', icon: 'Shield' },
    { id: 'safety', label: 'Safety', icon: 'Heart' },
    { id: 'reporting', label: 'Reporting', icon: 'AlertTriangle' },
    { id: 'prevention', label: 'Prevention', icon: 'CheckCircle' }
  ];

  const activeContent = educationalSections?.[activeSection];

  return (
    <div className={`bg-card border border-border rounded-xl shadow-medical ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Icon name="BookOpen" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Educational Resources</h3>
            <p className="text-sm text-muted-foreground">Learn about medicine safety and authenticity</p>
          </div>
        </div>
      </div>
      {/* Section Navigation */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`
                flex items-center space-x-2 p-3 rounded-lg text-sm font-medium
                transition-all duration-200 focus-medical
                ${activeSection === section?.id
                  ? 'bg-primary text-primary-foreground shadow-medical-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name={section?.icon} size={16} />
              <span className="hidden sm:inline">{section?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        <div className="flex items-start space-x-3 mb-6">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name={activeContent?.icon} size={16} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">{activeContent?.title}</h4>
            <h5 className="text-sm font-medium text-muted-foreground">{activeContent?.content?.title}</h5>
          </div>
        </div>

        {/* Content Points */}
        <div className="space-y-3 mb-6">
          {activeContent?.content?.points?.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" size={14} color="var(--color-accent)" />
            </div>
            <div>
              <h6 className="font-medium text-accent mb-1">Pro Tip</h6>
              <p className="text-sm text-muted-foreground">{activeContent?.content?.tip}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Resources */}
      <div className="p-6 border-t border-border bg-muted/20">
        <h4 className="font-medium text-foreground mb-4">Additional Resources</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
            <Icon name="ExternalLink" size={16} color="var(--color-primary)" />
            <div>
              <div className="text-sm font-medium text-foreground">FDA Guidelines</div>
              <div className="text-xs text-muted-foreground">Official safety guidelines</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
            <Icon name="Phone" size={16} color="var(--color-success)" />
            <div>
              <div className="text-sm font-medium text-foreground">24/7 Helpline</div>
              <div className="text-xs text-muted-foreground font-mono">1800-180-3024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;