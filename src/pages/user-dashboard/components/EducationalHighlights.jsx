import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EducationalHighlights = ({ className = '' }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const educationalTips = [
    {
      id: 1,
      title: "Check Medicine Packaging",
      content: "Look for clear printing, proper spelling, and authentic holographic seals. Fake medicines often have blurred text or missing security features.",
      icon: "Package",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      category: "Visual Inspection",
      readTime: "2 min read"
    },
    {
      id: 2,
      title: "Verify Batch Numbers",
      content: "Always check batch numbers and expiry dates. Authentic medicines have clear, embossed batch numbers that match manufacturer records.",
      icon: "Hash",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop",
      category: "Authentication",
      readTime: "3 min read"
    },
    {
      id: 3,
      title: "Buy from Licensed Pharmacies",
      content: "Purchase medicines only from licensed pharmacies and authorized dealers. Avoid street vendors and unverified online sources.",
      icon: "ShieldCheck",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=200&fit=crop",
      category: "Safe Purchasing",
      readTime: "2 min read"
    },
    {
      id: 4,
      title: "Use MediVerify AI Scanner",
      content: "Our AI-powered scanner can detect subtle differences in packaging that human eyes might miss. Scan every medicine for peace of mind.",
      icon: "Scan",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
      category: "Technology",
      readTime: "1 min read"
    }
  ];

  // Auto-rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => 
        (prevIndex + 1) % educationalTips?.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [educationalTips?.length]);

  const currentTip = educationalTips?.[currentTipIndex];

  const handlePrevious = () => {
    setCurrentTipIndex((prevIndex) => 
      prevIndex === 0 ? educationalTips?.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentTipIndex((prevIndex) => 
      (prevIndex + 1) % educationalTips?.length
    );
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Safety Tips</h3>
          <p className="text-sm text-muted-foreground">
            Learn to identify fake medicines and stay protected
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors focus-medical"
            aria-label="Previous tip"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors focus-medical"
            aria-label="Next tip"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
      {/* Main Tip Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-medical">
        <div className="relative h-48 bg-muted overflow-hidden">
          <Image
            src={currentTip?.image}
            alt={currentTip?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded-full">
                {currentTip?.category}
              </span>
              <span className="text-white/80 text-xs">
                {currentTip?.readTime}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={currentTip?.icon} size={24} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-3">
                {currentTip?.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {currentTip?.content}
              </p>
              <Button
                variant="outline"
                size="sm"
                iconName="ExternalLink"
                iconPosition="right"
                onClick={() => alert('Educational content coming soon!')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Tip Navigation Dots */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        {educationalTips?.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTipIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentTipIndex 
                ? 'bg-primary w-6' :'bg-muted hover:bg-muted-foreground/30'
            }`}
            aria-label={`Go to tip ${index + 1}`}
          />
        ))}
      </div>
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">₹30,000Cr</div>
          <div className="text-xs text-muted-foreground">Fake medicine market in India</div>
        </div>
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-error mb-1">25%</div>
          <div className="text-xs text-muted-foreground">Of medicines may be counterfeit</div>
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">98%</div>
          <div className="text-xs text-muted-foreground">MediVerify accuracy rate</div>
        </div>
      </div>
    </div>
  );
};

export default EducationalHighlights;