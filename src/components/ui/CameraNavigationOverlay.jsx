import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CameraNavigationOverlay = ({ 
  isActive = false,
  onCancel,
  onSettings,
  onCapture,
  onFlashToggle,
  flashEnabled = false,
  isProcessing = false,
  className = ''
}) => {
  if (!isActive) return null;

  return (
    <div className={`nav-overlay camera-overlay rounded-xl ${className}`}>
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Cancel Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white hover:bg-white/20 border-white/30"
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Cancel
        </Button>

        {/* Flash Toggle */}
        <button
          onClick={onFlashToggle}
          className={`
            p-2 rounded-lg transition-all duration-200 focus-medical
            ${flashEnabled 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-white/20 text-white hover:bg-white/30'
            }
          `}
          aria-label={flashEnabled ? 'Disable flash' : 'Enable flash'}
        >
          <Icon name={flashEnabled ? 'Zap' : 'ZapOff'} size={20} />
        </button>

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettings}
          className="text-white hover:bg-white/20 border-white/30"
          iconName="Settings"
        />
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Position Medicine Package</h3>
          <p className="text-white/80 text-sm">
            Ensure the medicine label is clearly visible and well-lit
          </p>
        </div>
      </div>

      {/* Capture Controls */}
      <div className="flex items-center justify-center space-x-6">
        {/* Gallery Button */}
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors focus-medical"
          aria-label="Choose from gallery"
        >
          <Icon name="Image" size={20} />
        </button>

        {/* Capture Button */}
        <button
          onClick={onCapture}
          disabled={isProcessing}
          className={`
            w-16 h-16 rounded-full border-4 border-white flex items-center justify-center
            transition-all duration-200 spring-transform focus-medical
            ${isProcessing 
              ? 'bg-white/50 cursor-not-allowed' :'bg-white hover:bg-white/90 active:scale-95'
            }
          `}
          aria-label={isProcessing ? 'Processing...' : 'Capture photo'}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="w-8 h-8 bg-primary rounded-full" />
          )}
        </button>

        {/* Help Button */}
        <button
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors focus-medical"
          aria-label="Help and tips"
        >
          <Icon name="HelpCircle" size={20} />
        </button>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="mt-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">Analyzing medicine...</span>
            </div>
            <p className="text-white/70 text-xs mt-1">
              AI verification in progress
            </p>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} color="var(--color-accent)" />
            <div>
              <h4 className="text-accent text-sm font-medium mb-1">Quick Tips</h4>
              <ul className="text-white/70 text-xs space-y-1">
                <li>• Ensure good lighting on the package</li>
                <li>• Keep the camera steady</li>
                <li>• Include the entire medicine label</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraNavigationOverlay;