import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NewsAndAlerts = ({ className = '' }) => {
  const [expandedAlert, setExpandedAlert] = useState(null);

  const newsAndAlerts = [
    {
      id: 1,
      type: 'alert',
      priority: 'high',
      title: 'Fake Paracetamol Batch Recalled',
      summary: 'Health Ministry issues urgent recall for contaminated paracetamol batch PCM2024X789 distributed in Delhi NCR.',
      content: `The Central Drugs Standard Control Organisation (CDSCO) has issued an urgent recall notice for paracetamol tablets batch number PCM2024X789 manufactured by unauthorized facilities.\n\nAffected areas: Delhi, Gurgaon, Noida, Faridabad\nBatch Numbers: PCM2024X789, PCM2024X790\nManufacturer: Fake facility posing as legitimate company\n\nIf you have purchased medicines with these batch numbers, stop using them immediately and report to your nearest pharmacy or health authority.`,
      timestamp: '2025-01-09T08:30:00Z',
      source: 'Ministry of Health & Family Welfare',
      actionRequired: true,
      batchNumbers: ['PCM2024X789', 'PCM2024X790']
    },
    {
      id: 2,
      type: 'news',
      priority: 'medium',
      title: 'MediVerify AI Accuracy Reaches 98.5%',
      summary: 'Latest AI model update improves fake medicine detection with enhanced visual analysis capabilities.',
      content: `Our latest AI model update has achieved a new milestone in medicine authenticity verification:\n\n• 98.5% accuracy in detecting counterfeit medicines\n• Enhanced detection of subtle packaging differences\n• Improved analysis of holographic security features\n• Faster processing with 2-second verification times\n\nThe update is now live for all users. Your existing verification history remains unchanged, and new scans will benefit from improved accuracy.`,
      timestamp: '2025-01-08T14:15:00Z',
      source: 'MediVerify Team',
      actionRequired: false
    },
    {
      id: 3,
      type: 'update',
      priority: 'low',
      title: 'New Regional Language Support',
      summary: 'MediVerify now supports Hindi and Tamil interfaces for better accessibility across India.',
      content: `We are excited to announce expanded language support:\n\n• Hindi interface now available\n• Tamil support added\n• Bengali coming next month\n• Voice instructions in regional languages\n\nTo change your language preference, visit Settings > Language & Region. More regional languages will be added based on user feedback.`,
      timestamp: '2025-01-07T10:00:00Z',
      source: 'Product Updates',
      actionRequired: false
    }
  ];

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'AlertTriangle'
        };
      case 'medium':
        return {
          color: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'Info'
        };
      default:
        return {
          color: 'primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          icon: 'Bell'
        };
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'alert': return 'Health Alert';
      case 'news': return 'Platform News';
      case 'update': return 'Feature Update';
      default: return 'Notification';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date?.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: date?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
  };

  const toggleExpanded = (alertId) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">News & Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Stay updated on medicine safety and platform updates
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          onClick={() => alert('Notification settings coming soon!')}
        >
          Settings
        </Button>
      </div>
      <div className="space-y-4">
        {newsAndAlerts?.map((item) => {
          const config = getPriorityConfig(item?.priority);
          const isExpanded = expandedAlert === item?.id;
          
          return (
            <div
              key={item?.id}
              className={`
                ${config?.bgColor} ${config?.borderColor} border rounded-xl p-4
                ${item?.actionRequired ? 'ring-2 ring-error/20' : ''}
                transition-all duration-200
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 bg-${config?.color}/20 rounded-lg flex items-center justify-center`}>
                  <Icon name={config?.icon} size={20} color={`var(--color-${config?.color})`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${config?.color}/20 text-${config?.color}`}>
                        {getTypeLabel(item?.type)}
                      </span>
                      {item?.actionRequired && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-error/20 text-error">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(item?.timestamp)}
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mb-2">
                    {item?.title}
                  </h4>

                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {item?.summary}
                  </p>

                  {isExpanded && (
                    <div className="mb-4 p-4 bg-card/50 rounded-lg border border-border/50">
                      <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                        {item?.content}
                      </div>
                      
                      {item?.batchNumbers && (
                        <div className="mt-4 p-3 bg-error/5 border border-error/20 rounded-lg">
                          <h5 className="font-medium text-error mb-2">Affected Batch Numbers:</h5>
                          <div className="flex flex-wrap gap-2">
                            {item?.batchNumbers?.map((batch) => (
                              <span key={batch} className="px-2 py-1 bg-error/10 text-error text-xs font-mono rounded">
                                {batch}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Source: {item?.source}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item?.actionRequired && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-error border-error hover:bg-error hover:text-error-foreground"
                          iconName="ExternalLink"
                          iconPosition="right"
                          onClick={() => alert('Reporting feature coming soon!')}
                        >
                          Report
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(item?.id)}
                        iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                        iconPosition="right"
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Emergency Contact Banner */}
      <div className="mt-6 bg-error/5 border border-error/20 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Phone" size={20} color="var(--color-error)" />
          <div className="flex-1">
            <h4 className="font-medium text-error mb-2">Emergency Contacts</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Fake Medicine Helpline:</strong> 1800-180-3024</p>
              <p><strong>Poison Control:</strong> 1066</p>
              <p><strong>Medical Emergency:</strong> 102</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-error text-error hover:bg-error hover:text-error-foreground"
            iconName="Phone"
            onClick={() => alert('Emergency calling feature coming soon!')}
          >
            Call Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsAndAlerts;