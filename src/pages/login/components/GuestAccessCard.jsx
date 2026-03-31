import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const GuestAccessCard = () => {
  const navigate = useNavigate();

  const securityHighlights = [
    'Verified access with Firebase Authentication',
    'Protected verification history and profile data',
    'Session-based security across all critical pages',
    'Google and Email/Password sign-in support'
  ];

  const handleSignUp = () => {
    navigate('/login?mode=signup');
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-primary/20 rounded-xl p-6">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Lock" size={24} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Secure Access Required</h3>
        <p className="text-sm text-muted-foreground">
          Sign in to access verification, database, history, and profile modules.
        </p>
      </div>
      <div className="space-y-2 mb-5">
        {securityHighlights?.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name="ShieldCheck" size={14} color="var(--color-primary)" />
            <span className="text-sm text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
      <div className="text-center pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">New to MediVerify?</p>
        <button
          onClick={handleSignUp}
          className="text-sm text-primary hover:text-primary/80 font-semibold focus-medical"
        >
          Create secure account
        </button>
      </div>
    </div>
  );
};

export default GuestAccessCard;