import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CameraInterface from './components/CameraInterface';
import VerificationProcessor from './components/VerificationProcessor';
import VerificationGuide from './components/VerificationGuide';

const MedicineVerification = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('capture'); // capture, processing, result
  const [selectedImage, setSelectedImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // Mock user data
  const mockUser = {
    id: 1,
  name: "RANGESH",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    verificationCount: 23
  };

  const handleImageCapture = (imageFile) => {
    setSelectedImage(imageFile);
    setCurrentStep('processing');
  };

  const handleImageUpload = (imageFile) => {
    setSelectedImage(imageFile);
    setCurrentStep('processing');
  };

  const handleVerificationComplete = (result) => {
    setVerificationResult(result);
    setCurrentStep('result');
  };

  const handleReset = () => {
    setCurrentStep('capture');
    setSelectedImage(null);
    setVerificationResult(null);
  };

  const handleSaveToHistory = () => {
    // Mock save to history
    navigate('/verification-history');
  };

  const handleViewHistory = () => {
    navigate('/verification-history');
  };

  const handleEmergencyReport = () => {
    // This would open emergency reporting modal
    console.log('Opening emergency report modal');
  };

  return (
    <>
      <Helmet>
        <title>Medicine Verification - MediVerify</title>
        <meta name="description" content="Instantly verify medicine authenticity using AI-powered visual verification. Protect your family from fake medicines." />
        <meta name="keywords" content="medicine verification, fake medicine detection, AI verification, medicine safety, healthcare" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          user={mockUser} 
          verificationCount={mockUser?.verificationCount}
          hasUnreadResults={false}
        />

        <main className="content-offset">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} color="var(--color-primary)" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Medicine Verification</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Use AI-powered verification to instantly check if your medicine is authentic. 
                Protect your family from counterfeit medications.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`
                flex items-center space-x-2 px-4 py-2 rounded-full
                ${currentStep === 'capture' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                <Icon name="Camera" size={16} />
                <span className="text-sm font-medium">Capture</span>
              </div>
              
              <div className={`w-8 h-px ${currentStep !== 'capture' ? 'bg-primary' : 'bg-border'}`}></div>
              
              <div className={`
                flex items-center space-x-2 px-4 py-2 rounded-full
                ${currentStep === 'processing' ? 'bg-primary text-primary-foreground' : 
                  currentStep === 'result' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                <Icon name={currentStep === 'result' ? 'CheckCircle' : 'Scan'} size={16} />
                <span className="text-sm font-medium">Verify</span>
              </div>
              
              <div className={`w-8 h-px ${currentStep === 'result' ? 'bg-success' : 'bg-border'}`}></div>
              
              <div className={`
                flex items-center space-x-2 px-4 py-2 rounded-full
                ${currentStep === 'result' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                <Icon name="FileCheck" size={16} />
                <span className="text-sm font-medium">Result</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Verification Area */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-6 shadow-medical">
                  {currentStep === 'capture' && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-foreground">Capture Medicine Photo</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowGuide(!showGuide)}
                          iconName="HelpCircle"
                          className="lg:hidden"
                        >
                          Guide
                        </Button>
                      </div>

                      <CameraInterface
                        onCapture={handleImageCapture}
                        onImageUpload={handleImageUpload}
                        isProcessing={false}
                      />

                      {/* Quick Stats */}
                      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-lg font-bold text-primary">99.2%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-lg font-bold text-primary">&lt;3s</div>
                          <div className="text-xs text-muted-foreground">Verification</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-lg font-bold text-primary">24/7</div>
                          <div className="text-xs text-muted-foreground">Available</div>
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 'processing' && (
                    <VerificationProcessor
                      imageFile={selectedImage}
                      onComplete={handleVerificationComplete}
                      onReset={handleReset}
                    />
                  )}

                  {currentStep === 'result' && verificationResult && (
                    <VerificationProcessor
                      imageFile={selectedImage}
                      onComplete={handleVerificationComplete}
                      onReset={handleReset}
                    />
                  )}
                </div>

                {/* Quick Actions */}
                {currentStep === 'capture' && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={handleViewHistory}
                      className="w-full"
                      iconName="History"
                      iconPosition="left"
                    >
                      View History ({mockUser?.verificationCount})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleEmergencyReport}
                      className="w-full border-error text-error hover:bg-error hover:text-error-foreground"
                      iconName="AlertTriangle"
                      iconPosition="left"
                    >
                      Report Fake Medicine
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar - Verification Guide */}
              <div className={`lg:block ${showGuide ? 'block' : 'hidden'}`}>
                <VerificationGuide />

                {/* Recent Activity */}
                <div className="mt-6 bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="Clock" size={16} className="mr-2" />
                    Recent Verifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "Paracetamol 500mg", result: "authentic", time: "2 hours ago" },
                      { name: "Amoxicillin 250mg", result: "authentic", time: "1 day ago" },
                      { name: "Crocin Advance", result: "suspicious", time: "3 days ago" }
                    ]?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item?.name}</p>
                          <p className="text-xs text-muted-foreground">{item?.time}</p>
                        </div>
                        <div className={`
                          w-3 h-3 rounded-full
                          ${item?.result === 'authentic' ? 'bg-success' : 
                            item?.result === 'suspicious' ? 'bg-warning' : 'bg-error'}
                        `}></div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewHistory}
                    className="w-full mt-4"
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    View All History
                  </Button>
                </div>

                {/* Emergency Contacts */}
                <div className="mt-6 bg-error/5 border border-error/20 rounded-xl p-6">
                  <h3 className="font-semibold text-error mb-4 flex items-center">
                    <Icon name="Phone" size={16} className="mr-2" />
                    Emergency Contacts
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Poison Control:</span>
                      <span className="font-mono text-foreground">1800-222-1222</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">FDA Safety:</span>
                      <span className="font-mono text-foreground">1800-FDA-1088</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emergency:</span>
                      <span className="font-mono text-foreground">112</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Trusted by Millions</h2>
                <p className="text-muted-foreground">
                  Join the fight against fake medicines with AI-powered verification
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">2M+</div>
                  <div className="text-sm text-muted-foreground">Medicines Verified</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Fake Medicines Detected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">99.2%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Always Available</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MedicineVerification;