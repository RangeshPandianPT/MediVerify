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
  const [imageQualityWarning, setImageQualityWarning] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analysisCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const analysisTimeoutRef = useRef(null);

  const analyzeFrame = () => {
    if (!videoRef.current || !analysisCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = analysisCanvasRef.current;
    
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = 64;
      canvas.height = 64;
      ctx.drawImage(video, 0, 0, 64, 64);
      
      try {
        const imageData = ctx.getImageData(0, 0, 64, 64);
        const data = imageData.data;
        let totalBrightness = 0;
        let samples = 0;
        
        for (let i = 0; i < data.length; i += 16) {
          const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
          totalBrightness += brightness;
          samples++;
        }
        
        const avgBrightness = totalBrightness / samples;
        
        if (avgBrightness < 50) {
          setImageQualityWarning('Too Dark - Move to better light');
        } else if (avgBrightness > 220) {
          setImageQualityWarning('Too Bright - Avoid glare');
        } else {
          setImageQualityWarning(null);
        }
      } catch(e) {
        // Ignore cross-origin canvas errors if any
      }
    }
    
    analysisTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(analyzeFrame);
    }, 500);
  };


  const startCamera = async () => {
    const tryGetUserMedia = async (constraints) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser');
      }
      return navigator.mediaDevices.getUserMedia(constraints);
    };

    setError(null);
    try {
      // Enumerate devices first so we can pick a specific deviceId if facingMode isn't reliable
      let preferredDeviceId = null;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        // Prefer labels that hint at back/rear camera (useful on mobile)
        const rear = videoInputs.find(d => /back|rear|environment|wide|rear camera/i.test(d.label));
        preferredDeviceId = rear?.deviceId || videoInputs[0]?.deviceId || null;
        if (videoInputs.length === 0) {
          console.warn('No video input devices found');
        } else {
          console.info('Video inputs found:', videoInputs.map(d => ({ id: d.deviceId, label: d.label })));
        }
      } catch (enumErr) {
        console.warn('Could not enumerate devices:', enumErr);
      }
      // First, attempt a constrained request preferring the rear camera
      const preferredConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

  let mediaStream;

      try {
        // If we found a preferred deviceId, include it as an ideal constraint
        const req = preferredDeviceId
          ? { ...preferredConstraints, video: { ...preferredConstraints.video, deviceId: { ideal: preferredDeviceId } } }
          : preferredConstraints;

        mediaStream = await tryGetUserMedia(req);
      } catch (innerErr) {
        // If the camera is busy or constraints can't be satisfied, fall back to a simpler request
        console.warn('Preferred constraints failed, trying fallback. Error:', innerErr);

        if (innerErr && (innerErr.name === 'NotReadableError' || innerErr.name === 'OverconstrainedError')) {
          // Try a minimal constraint set
          try {
            // Try with deviceId if we have one, otherwise plain video
            const fallbackReq = preferredDeviceId ? { video: { deviceId: { ideal: preferredDeviceId } }, audio: false } : { video: true, audio: false };
            mediaStream = await tryGetUserMedia(fallbackReq);
          } catch (fallbackErr) {
            throw fallbackErr;
          }
        } else {
          // For other errors (e.g. NotAllowedError) just rethrow to be handled below
          throw innerErr;
        }
      }

      setStream(mediaStream);
      if (videoRef?.current) {
        try {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
          // Start real-time analysis once playing
          requestAnimationFrame(analyzeFrame);
        } catch (playErr) {
          console.warn('Video play() failed (may require user interaction):', playErr);
        }
      }

      setIsCameraActive(true);
    } catch (err) {
      // Provide a more specific user message depending on the error type
      console.error('Camera error:', err);
      if (err && err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err && err.name === 'NotFoundError') {
        setError('No camera device found. Please connect a camera and try again.');
      } else if (err && err.name === 'NotReadableError') {
        setError('Could not start video source. The camera may be in use by another application.');
      } else if (err && err.name === 'OverconstrainedError') {
        setError('Camera does not support the requested resolution. Try a different device or reduce constraints.');
      } else {
        setError('Unable to access camera. Please check your device settings and try again.');
      }
    }
  };

  const stopCamera = () => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    if (stream) {
      stream?.getTracks()?.forEach(track => track?.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setImageQualityWarning(null);
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
      // Compress the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = 1920;
          
          if (width > height && width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name || `upload-${Date.now()}.jpg`, { 
              type: 'image/jpeg', 
              lastModified: Date.now() 
            });
            onImageUpload?.(compressedFile);
          }, 'image/jpeg', 0.8); // 80% quality for good balance of size/quality
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
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
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
              {/* Top Warning Banner */}
              {imageQualityWarning && (
                <div className="bg-black/60 backdrop-blur-sm p-3 flex items-center justify-center space-x-2 w-full absolute top-0 z-10 transition-all duration-300">
                  <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                  <span className="text-warning font-medium text-sm">{imageQualityWarning}</span>
                </div>
              )}
              
              <div className={`absolute inset-6 border-2 rounded-lg transition-colors duration-300 ${imageQualityWarning ? 'border-warning/50' : 'border-white/40'}`}>
                {/* Corner indicators */}
                <div className={`absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg transition-colors duration-300 ${imageQualityWarning ? 'border-warning' : 'border-accent'}`}></div>
                <div className={`absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg transition-colors duration-300 ${imageQualityWarning ? 'border-warning' : 'border-accent'}`}></div>
                <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg transition-colors duration-300 ${imageQualityWarning ? 'border-warning' : 'border-accent'}`}></div>
                <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 rounded-br-lg transition-colors duration-300 ${imageQualityWarning ? 'border-warning' : 'border-accent'}`}></div>
                
                {/* Crosshairs */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
                  <div className="w-16 h-px bg-white absolute top-1/2 -translate-y-1/2 -left-8"></div>
                  <div className="w-px h-16 bg-white absolute left-1/2 -translate-x-1/2 -top-8"></div>
                </div>
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
      {/* Hidden Canvas for Capture & Analysis */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={analysisCanvasRef} className="hidden" />
    </div>
  );
};

export default CameraInterface;