import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import ResultStatusCard from './components/ResultStatusCard';
import AnalysisBreakdown from './components/AnalysisBreakdown';
import VerificationMetadata from './components/VerificationMetadata';
import ActionButtonsPanel from './components/ActionButtonsPanel';
import EducationalContent from './components/EducationalContent';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VerificationResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);

  // Mock user data
  const mockUser = {
    id: 'user_001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    verificationCount: 23
  };

  // Get verification data from navigation state or create mock data
  useEffect(() => {
    const navigationData = location?.state?.verificationData;
    
    if (navigationData) {
      setVerificationData(navigationData);
    } else {
      // Create comprehensive mock verification data
      const mockData = {
        id: 'VER-2025100904432',
        medicineName: 'Paracetamol 500mg',
        manufacturer: 'Cipla Limited',
        batchNumber: 'PCM2024A1234',
        expiryDate: '2026-08-15',
        mfgDate: '2024-08-15',
        isAuthentic: Math.random() > 0.3, // 70% chance of authentic
        credibilityPercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
        verificationId: 'VER-2025100904432',
        timestamp: new Date()?.toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        analysisDetails: {
          processingTime: '2.3 seconds',
          confidenceLevel: 94.2,
          aiModel: 'MediVerify AI v3.2',
          databaseMatches: 847,
          securityFeatures: ['Hologram verified', 'Watermark detected', 'Font analysis passed']
        }
      };
      setVerificationData(mockData);
    }

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location?.state]);

  const handleDownloadReport = (data) => {
    console.log('Downloading report for:', data?.verificationId);
  };

  const handleShareResults = (data) => {
    console.log('Sharing results for:', data?.verificationId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={mockUser} verificationCount={mockUser?.verificationCount} />
        <div className="content-offset">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Processing Results</h2>
                <p className="text-muted-foreground">Analyzing verification data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationData) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={mockUser} verificationCount={mockUser?.verificationCount} />
        <div className="content-offset">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertTriangle" size={32} color="var(--color-error)" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No Results Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any verification data. Please try verifying a medicine again.
                </p>
                <Button
                  onClick={() => navigate('/medicine-verification')}
                  iconName="Camera"
                  iconPosition="left"
                >
                  Start New Verification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Verification Results - MediVerify</title>
        <meta name="description" content="View detailed medicine authenticity verification results with AI-powered analysis and forensic-level breakdown." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          user={mockUser} 
          verificationCount={mockUser?.verificationCount}
          hasUnreadResults={true}
        />
        
        <div className="content-offset">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <button 
                onClick={() => navigate('/user-dashboard')}
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={14} />
              <button 
                onClick={() => navigate('/medicine-verification')}
                className="hover:text-foreground transition-colors"
              >
                Verification
              </button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">Results</span>
            </nav>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Main Results */}
              <div className="xl:col-span-2 space-y-8">
                {/* Result Status Card */}
                <ResultStatusCard 
                  result={verificationData}
                  animated={true}
                />

                {/* Analysis Breakdown */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icon name="Search" size={16} color="var(--color-primary)" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Detailed Analysis</h2>
                  </div>
                  <AnalysisBreakdown />
                </div>

                {/* Educational Content */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                      <Icon name="BookOpen" size={16} color="var(--color-accent)" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Learn More</h2>
                  </div>
                  <EducationalContent verificationResult={verificationData} />
                </div>
              </div>

              {/* Right Column - Metadata & Actions */}
              <div className="space-y-8">
                {/* Verification Metadata */}
                <VerificationMetadata metadata={verificationData?.analysisDetails} />

                {/* Action Buttons */}
                <ActionButtonsPanel
                  verificationData={verificationData}
                  onDownloadReport={handleDownloadReport}
                  onShareResults={handleShareResults}
                />
              </div>
            </div>

            {/* Bottom Action Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 xl:hidden">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/medicine-verification')}
                  iconName="Camera"
                  iconPosition="left"
                  className="flex-1"
                >
                  Verify Another
                </Button>
                <Button
                  onClick={handleDownloadReport}
                  iconName="Download"
                  iconPosition="left"
                  className="flex-1"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationResults;