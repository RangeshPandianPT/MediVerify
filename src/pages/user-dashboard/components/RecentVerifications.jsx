import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import VerificationStatusIndicator from '../../../components/ui/VerificationStatusIndicator';

const RecentVerifications = ({ className = '' }) => {
  const navigate = useNavigate();

  const recentVerifications = [
    {
      id: "VER-2025-001",
      medicineName: "Paracetamol 500mg",
      manufacturer: "Cipla Ltd",
      batchNumber: "PCM2024A123",
      verificationDate: "2025-01-09T10:30:00Z",
      status: "completed",
      isAuthentic: true,
      credibilityPercentage: 98,
      thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
      riskLevel: "low"
    },
    {
      id: "VER-2025-002", 
      medicineName: "Azithromycin 250mg",
      manufacturer: "Sun Pharma",
      batchNumber: "AZI2024B456",
      verificationDate: "2025-01-08T15:45:00Z",
      status: "completed",
      isAuthentic: false,
      credibilityPercentage: 23,
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      riskLevel: "high"
    },
    {
      id: "VER-2025-003",
      medicineName: "Omeprazole 20mg",
      manufacturer: "Dr. Reddy\'s",
      batchNumber: "OME2024C789",
      verificationDate: "2025-01-07T09:15:00Z",
      status: "completed",
      isAuthentic: true,
      credibilityPercentage: 94,
      thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
      riskLevel: "low"
    }
  ];

  const handleViewDetails = (verificationId) => {
    navigate(`/verification-results?id=${verificationId}`);
  };

  const handleViewAll = () => {
    navigate('/verification-history');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Recent Verifications</h3>
          <p className="text-sm text-muted-foreground">Your latest medicine authenticity checks</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAll}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recentVerifications?.map((verification) => (
          <div
            key={verification?.id}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-medical transition-all duration-200 cursor-pointer"
            onClick={() => handleViewDetails(verification?.id)}
          >
            <div className="flex items-start space-x-4">
              {/* Medicine Image */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={verification?.thumbnail}
                  alt={verification?.medicineName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Verification Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground truncate">
                      {verification?.medicineName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {verification?.manufacturer}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(verification?.verificationDate)}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mb-3">
                  <VerificationStatusIndicator
                    credibilityPercentage={verification?.credibilityPercentage}
                    isAuthentic={verification?.isAuthentic}
                    status={verification?.status}
                    size="sm"
                    showDetails={false}
                    animated={false}
                  />
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">
                      Batch: {verification?.batchNumber}
                    </span>
                    <span className="text-muted-foreground">
                      ID: {verification?.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ChevronRight" size={14} color="var(--color-muted-foreground)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {recentVerifications?.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="History" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h4 className="font-medium text-foreground mb-2">No Verifications Yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Start by verifying your first medicine to see results here
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/medicine-verification')}
            iconName="Plus"
            iconPosition="left"
          >
            Verify Medicine
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentVerifications;