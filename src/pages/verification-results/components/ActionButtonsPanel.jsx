import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import EmergencyReportingModal from '../../../components/ui/EmergencyReportingModal';

const ActionButtonsPanel = ({ 
  verificationData = {},
  onDownloadReport,
  onShareResults,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { isAuthentic, medicineName, verificationId } = verificationData;

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onDownloadReport?.(verificationData);
      
      // Create mock download
      const reportData = {
        verificationId,
        medicineName,
        result: isAuthentic ? 'Authentic' : 'Fake Detected',
        timestamp: new Date()?.toISOString(),
        confidence: verificationData?.credibilityPercentage || 0
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MediVerify_Report_${verificationId}.json`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareResults = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: 'MediVerify Results',
        text: `Medicine verification result: ${isAuthentic ? 'Authentic ✅' : 'Fake Detected ❌'} - ${medicineName}`,
        url: window.location?.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard?.writeText(`${shareData?.text}\n${shareData?.url}`);
        alert('Results copied to clipboard!');
      }
      
      onShareResults?.(verificationData);
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleReportSubmit = async (reportData) => {
    // Simulate report submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Emergency report submitted:', reportData);
    setIsReportModalOpen(false);
  };

  const primaryActions = [
    {
      label: 'Download Report',
      icon: 'Download',
      variant: 'default',
      onClick: handleDownloadReport,
      loading: isDownloading,
      description: 'Save detailed verification report'
    },
    {
      label: 'Share Results',
      icon: 'Share2',
      variant: 'outline',
      onClick: handleShareResults,
      loading: isSharing,
      description: 'Share with family or healthcare provider'
    }
  ];

  const secondaryActions = [
    {
      label: 'Verify Another',
      icon: 'Camera',
      variant: 'secondary',
      onClick: () => navigate('/medicine-verification'),
      description: 'Start new medicine verification'
    },
    {
      label: 'View History',
      icon: 'History',
      variant: 'outline',
      onClick: () => navigate('/verification-history'),
      description: 'See past verification results'
    }
  ];

  const emergencyAction = {
    label: 'Report Fake Medicine',
    icon: 'AlertTriangle',
    variant: 'destructive',
    onClick: () => setIsReportModalOpen(true),
    description: 'Report to authorities immediately'
  };

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Primary Actions */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-medical">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Zap" size={20} className="mr-2" color="var(--color-primary)" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {primaryActions?.map((action, index) => (
              <div key={index} className="space-y-2">
                <Button
                  variant={action?.variant}
                  onClick={action?.onClick}
                  loading={action?.loading}
                  iconName={action?.icon}
                  iconPosition="left"
                  fullWidth
                  className="h-12"
                >
                  {action?.label}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {action?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-medical">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Navigation" size={20} className="mr-2" color="var(--color-primary)" />
            Next Steps
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondaryActions?.map((action, index) => (
              <div key={index} className="space-y-2">
                <Button
                  variant={action?.variant}
                  onClick={action?.onClick}
                  iconName={action?.icon}
                  iconPosition="left"
                  fullWidth
                  className="h-12"
                >
                  {action?.label}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {action?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Action (only show for fake medicines) */}
        {isAuthentic === false && (
          <div className="bg-error/5 border border-error/20 rounded-xl p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
              </div>
              <div>
                <h3 className="font-semibold text-error mb-1">Fake Medicine Detected</h3>
                <p className="text-sm text-muted-foreground">
                  Report this immediately to protect others from counterfeit medicines.
                </p>
              </div>
            </div>
            
            <Button
              variant={emergencyAction?.variant}
              onClick={emergencyAction?.onClick}
              iconName={emergencyAction?.icon}
              iconPosition="left"
              fullWidth
              className="h-12"
            >
              {emergencyAction?.label}
            </Button>
            
            <div className="mt-4 p-3 bg-background/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-2 text-sm">Emergency Contacts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Icon name="Phone" size={12} color="var(--color-error)" />
                  <span className="text-error font-mono">1800-180-3024</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Mail" size={12} color="var(--color-muted-foreground)" />
                  <span className="text-muted-foreground">FDA Helpline</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} color="var(--color-muted-foreground)" />
                  <span className="text-muted-foreground">24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">What's Next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep this verification report for your records</li>
                <li>• Share results with your healthcare provider if needed</li>
                <li>• Always verify medicines from new sources</li>
                <li>• Report suspicious medicines to authorities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Emergency Reporting Modal */}
      <EmergencyReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        verificationData={verificationData}
        onSubmit={handleReportSubmit}
      />
    </>
  );
};

export default ActionButtonsPanel;