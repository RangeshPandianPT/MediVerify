import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GuestAccessCard = () => {
  const navigate = useNavigate();

  const guestFeatures = [
    'Verify up to 3 medicines',
    'Basic authenticity checking',
    'Limited verification history',
    'No account required'
  ];

  const handleGuestAccess = () => {
    // Set guest mode in localStorage
    localStorage.setItem('userMode', 'guest');
    localStorage.setItem('guestVerificationCount', '0');
    navigate('/medicine-verification');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-6">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="UserCheck" size={24} color="var(--color-accent)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Try Without Account</h3>
        <p className="text-sm text-muted-foreground">
          Experience medicine verification with limited access
        </p>
      </div>
      {/* Guest Features */}
      <div className="space-y-2 mb-6">
        {guestFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name="Check" size={14} color="var(--color-accent)" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleGuestAccess}
          variant="outline"
          fullWidth
          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          iconName="Play"
          iconPosition="left"
        >
          Try as Guest
        </Button>
        
        <div className="text-center">
          <span className="text-xs text-muted-foreground">Want full access? </span>
          <button
            onClick={handleSignUp}
            className="text-xs text-primary hover:text-primary/80 font-medium focus-medical"
          >
            Create Account
          </button>
        </div>
      </div>
      {/* Upgrade Benefits */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center mb-2">
          <strong>Full Account Benefits:</strong>
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Unlimited verifications</span>
            <Icon name="Infinity" size={12} color="var(--color-success)" />
          </div>
          <div className="flex items-center justify-between">
            <span>Complete history</span>
            <Icon name="History" size={12} color="var(--color-success)" />
          </div>
          <div className="flex items-center justify-between">
            <span>Export reports</span>
            <Icon name="Download" size={12} color="var(--color-success)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestAccessCard;