import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AnalysisBreakdown = ({ 
  analysisData = {},
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('visual');

  const mockAnalysisData = {
    visual: {
      fontAnalysis: {
        score: 94,
        details: `Font matching shows 94% similarity to authentic packaging.\nPrimary font: Arial Bold detected correctly.\nSecondary text uses proper Helvetica variant.\nNo suspicious font substitutions found.`,
        status: 'authentic'
      },
      colorMatching: {
        score: 89,
        details: `Color profile analysis indicates 89% match.\nPrimary blue (#1E40AF) matches reference standard.\nSecondary colors within acceptable variance.\nNo significant color deviations detected.`,
        status: 'authentic'
      },
      textureVerification: {
        score: 92,
        details: `Surface texture analysis shows authentic characteristics.\nPaper quality matches pharmaceutical standards.\nEmbossing patterns correctly implemented.\nNo signs of low-quality printing detected.`,
        status: 'authentic'
      },
      labelDetails: {
        score: 96,
        details: `Label positioning and content verification successful.\nAll mandatory information present and correctly placed.\nBarcode format matches pharmaceutical standards.\nExpiry date format and positioning verified.`,
        status: 'authentic'
      }
    },
    technical: {
      imageQuality: {
        score: 88,
        details: `Image resolution: 1920x1080 (Excellent)\nLighting conditions: Optimal\nFocus quality: Sharp\nImage noise: Minimal`,
        status: 'good'
      },
      processingTime: {
        score: 95,
        details: `Total analysis time: 2.3 seconds\nAI model confidence: 94.2%\nDatabase comparison: 847 reference images\nProcessing efficiency: Excellent`,
        status: 'excellent'
      },
      securityFeatures: {
        score: 91,
        details: `Holographic elements: Detected and verified\nWatermark patterns: Present and authentic\nSecurity thread: Visible and correctly positioned\nMicrotext: Readable and matches standards`,
        status: 'authentic'
      }
    },
    regulatory: {
      complianceCheck: {
        score: 98,
        details: `FDA registration number verified\nManufacturer license validated\nBatch number format compliant\nExpiry date within valid range`,
        status: 'compliant'
      },
      batchVerification: {
        score: 93,
        details: `Batch number cross-referenced with manufacturer database\nProduction date matches batch records\nDistribution chain verified\nNo recall notices found`,
        status: 'verified'
      }
    }
  };

  const data = { ...mockAnalysisData, ...analysisData };

  const tabs = [
    { id: 'visual', label: 'Visual Analysis', icon: 'Eye' },
    { id: 'technical', label: 'Technical Details', icon: 'Settings' },
    { id: 'regulatory', label: 'Regulatory Check', icon: 'Shield' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const renderAnalysisItem = (key, item) => (
    <div key={key} className="bg-card border border-border rounded-xl p-6 shadow-medical">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground capitalize">
          {key?.replace(/([A-Z])/g, ' $1')?.trim()}
        </h4>
        <div className={`
          px-3 py-1 rounded-full text-sm font-bold
          ${getScoreBg(item?.score)} ${getScoreColor(item?.score)}
        `}>
          {item?.score}%
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              item?.score >= 90 ? 'bg-success' : 
              item?.score >= 70 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${item?.score}%` }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {item?.details}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`bg-background ${className}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md
              text-sm font-medium transition-all duration-200
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
      {/* Tab Content */}
      <div className="space-y-6">
        {Object.entries(data?.[activeTab] || {})?.map(([key, item]) => 
          renderAnalysisItem(key, item)
        )}
      </div>
      {/* Summary Card */}
      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="Info" size={16} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Analysis Summary</h4>
            <p className="text-sm text-muted-foreground">
              The comprehensive AI analysis examined multiple verification parameters including visual elements, 
              technical specifications, and regulatory compliance. All critical authenticity markers have been 
              evaluated against our extensive database of verified pharmaceutical packaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisBreakdown;