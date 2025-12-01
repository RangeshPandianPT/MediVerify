import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const EmptyHistoryState = ({ 
  hasFilters = false, 
  onClearFilters,
  searchQuery = '',
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleStartVerification = () => {
    navigate('/medicine-verification');
  };

  if (hasFilters || searchQuery) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Results Found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? `No verification records match "${searchQuery}". Try adjusting your search terms.`
              : "No verification records match your current filters. Try adjusting your filter criteria."
            }
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Clear Filters
            </Button>
            <div className="text-sm text-muted-foreground">or</div>
            <Button
              onClick={handleStartVerification}
              iconName="Camera"
              iconPosition="left"
            >
              Verify New Medicine
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-lg mx-auto">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={48} color="var(--color-primary)" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
            <Icon name="Camera" size={20} color="var(--color-accent)" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          No Verification History Yet
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Start protecting your family by verifying your medicines. 
          Your verification history will appear here, helping you track 
          the authenticity of all your medications.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleStartVerification}
            size="lg"
            iconName="Camera"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Verify Your First Medicine
          </Button>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/user-dashboard')}
              iconName="LayoutDashboard"
              iconPosition="left"
            >
              Go to Dashboard
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/user-profile')}
              iconName="User"
              iconPosition="left"
            >
              Setup Profile
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center mb-3">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Track Authenticity</h4>
            <p className="text-xs text-muted-foreground">
              Keep records of all verified medicines
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
              <Icon name="TrendingUp" size={16} color="var(--color-primary)" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Monitor Trends</h4>
            <p className="text-xs text-muted-foreground">
              See patterns in your medicine purchases
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mb-3">
              <Icon name="Share2" size={16} color="var(--color-accent)" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Share Results</h4>
            <p className="text-xs text-muted-foreground">
              Share verification reports with family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyHistoryState;