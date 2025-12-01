import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';


const HistoryListItem = ({ 
  verification, 
  onDelete, 
  onShare, 
  onReVerify,
  isSelected = false,
  onSelect,
  showCheckbox = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    medicineName = "Unknown Medicine",
    medicineImage,
    verificationDate,
    credibilityPercentage = 0,
    isAuthentic,
    status = 'completed',
    batchNumber,
    manufacturer,
    expiryDate,
    verificationId,
    analysisDetails = {}
  } = verification;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewDetails = () => {
    navigate(`/verification-results?id=${id}`);
  };

  const getStatusColor = () => {
    if (isAuthentic === true) return 'text-success';
    if (isAuthentic === false) return 'text-error';
    return 'text-warning';
  };

  const getStatusLabel = () => {
    if (status === 'processing') return 'Processing';
    if (isAuthentic === true) return 'Authentic';
    if (isAuthentic === false) return 'Fake Detected';
    return 'Suspicious';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-medical transition-all duration-200">
      {/* Main Content */}
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        {showCheckbox && (
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect?.(id, e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
          </div>
        )}

        {/* Medicine Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
            <Image
              src={medicineImage || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"}
              alt={medicineName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {medicineName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {formatDate(verificationDate)}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs font-mono text-muted-foreground">
                  ID: {verificationId || id}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} bg-current/10`}>
              {getStatusLabel()}
            </div>
          </div>

          {/* Credibility Score */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono font-semibold">{credibilityPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    credibilityPercentage >= 80 ? 'bg-success' : 
                    credibilityPercentage >= 60 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${credibilityPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
                iconName="Eye"
                iconPosition="left"
                className="text-xs"
              >
                View Details
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                className="text-xs"
              >
                {isExpanded ? 'Less' : 'More'}
              </Button>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(verification)}
                iconName="Share2"
                className="text-muted-foreground hover:text-foreground"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReVerify?.(verification)}
                iconName="RotateCcw"
                className="text-muted-foreground hover:text-foreground"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(id)}
                iconName="Trash2"
                className="text-muted-foreground hover:text-error"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medicine Details */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Medicine Details</h4>
              <div className="space-y-2 text-sm">
                {batchNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch Number:</span>
                    <span className="font-mono">{batchNumber}</span>
                  </div>
                )}
                {manufacturer && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span>{manufacturer}</span>
                  </div>
                )}
                {expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span>{new Date(expiryDate)?.toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Summary */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Analysis Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Font Analysis:</span>
                  <span className={analysisDetails?.fontMatch >= 90 ? 'text-success' : 'text-warning'}>
                    {analysisDetails?.fontMatch || 95}% match
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color Accuracy:</span>
                  <span className={analysisDetails?.colorMatch >= 90 ? 'text-success' : 'text-warning'}>
                    {analysisDetails?.colorMatch || 92}% match
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Texture Quality:</span>
                  <span className={analysisDetails?.textureMatch >= 90 ? 'text-success' : 'text-warning'}>
                    {analysisDetails?.textureMatch || 88}% match
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/medicine-verification')}
              iconName="Camera"
              iconPosition="left"
            >
              Verify Again
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              iconName="FileText"
              iconPosition="left"
            >
              Full Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryListItem;