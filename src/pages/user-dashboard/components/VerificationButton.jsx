import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VerificationButton = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleVerifyClick = () => {
    navigate('/medicine-verification');
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
        <div className="mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medical-lg">
            <Icon name="Shield" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Verify Medicine Now</h2>
          <p className="text-muted-foreground">
            Scan or upload medicine packaging for instant authenticity verification
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleVerifyClick}
            variant="default"
            size="lg"
            className="h-14"
            iconName="Camera"
            iconPosition="left"
          >
            Scan with Camera
          </Button>
          <Button
            onClick={handleVerifyClick}
            variant="outline"
            size="lg"
            className="h-14"
            iconName="Upload"
            iconPosition="left"
          >
            Upload Photo
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={16} color="var(--color-accent)" />
            <span>Instant Results</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={16} color="var(--color-success)" />
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationButton;