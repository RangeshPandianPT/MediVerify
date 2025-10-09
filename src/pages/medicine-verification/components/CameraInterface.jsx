import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import CameraNavigationOverlay from '../../../components/ui/CameraNavigationOverlay';

const CameraInterface = ({ 
  onCapture, 
  onImageUpload, 
  isProcessing = false,
  className = '' 
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices?.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream?.getTracks()?.forEach(track => track?.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef?.current || !canvasRef?.current) return;

    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');

    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0);

    canvas?.toBlob((blob) => {
      const file = new File([blob], `medicine-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture?.(file);
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      onImageUpload?.(file);
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    // Note: Flash control would require additional camera API implementation
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Camera View */}
      <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden">
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Camera Guidelines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-accent rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-accent rounded-br-lg"></div>
              </div>
              
              {/* Center Focus Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border-2 border-accent rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Camera Navigation Overlay */}
            <CameraNavigationOverlay
              isActive={true}
              onCancel={stopCamera}
              onCapture={capturePhoto}
              onFlashToggle={toggleFlash}
              onSettings={() => {}}
              flashEnabled={flashEnabled}
              isProcessing={isProcessing}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            {error ? (
              <div className="text-center">
                <Icon name="AlertCircle" size={48} color="var(--color-error)" className="mb-4" />
                <p className="text-error mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={startCamera}
                  className="text-white border-white hover:bg-white/20"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Icon name="Camera" size={64} className="mb-4 opacity-60" />
                <h3 className="text-xl font-semibold mb-2">Camera Ready</h3>
                <p className="text-white/80 mb-6">Position medicine package in frame</p>
                <Button
                  onClick={startCamera}
                  className="bg-primary hover:bg-primary/90"
                  iconName="Camera"
                  iconPosition="left"
                >
                  Start Camera
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Upload Alternative */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => fileInputRef?.current?.click()}
          className="mt-4"
          iconName="Upload"
          iconPosition="left"
          disabled={isProcessing}
        >
          Upload from Gallery
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraInterface;