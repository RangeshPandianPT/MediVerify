import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';

const EmergencyReportingModal = ({ 
  isOpen = false,
  onClose,
  verificationData = null,
  onSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    reportType: 'fake_medicine',
    urgency: 'high',
    description: '',
    contactMethod: 'phone',
    contactInfo: '',
    location: '',
    purchaseLocation: '',
    batchNumber: '',
    symptoms: '',
    consentToContact: false,
    shareWithAuthorities: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const reportTypeOptions = [
    { value: 'fake_medicine', label: 'Fake Medicine Detected' },
    { value: 'adverse_reaction', label: 'Adverse Reaction' },
    { value: 'suspicious_seller', label: 'Suspicious Seller/Pharmacy' },
    { value: 'quality_issue', label: 'Quality/Packaging Issue' },
    { value: 'other', label: 'Other Safety Concern' }
  ];

  const urgencyOptions = [
    { value: 'critical', label: 'Critical - Immediate Danger' },
    { value: 'high', label: 'High - Potential Health Risk' },
    { value: 'medium', label: 'Medium - Quality Concern' },
    { value: 'low', label: 'Low - General Report' }
  ];

  const contactMethodOptions = [
    { value: 'phone', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS/Text' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      const reportData = {
        ...formData,
        verificationId: verificationData?.id,
        medicineDetails: verificationData?.medicineDetails,
        timestamp: new Date()?.toISOString(),
        reportId: `RPT-${Date.now()}`
      };
      
      await onSubmit?.(reportData);
      setStep(3); // Success step
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      reportType: 'fake_medicine',
      urgency: 'high',
      description: '',
      contactMethod: 'phone',
      contactInfo: '',
      location: '',
      purchaseLocation: '',
      batchNumber: '',
      symptoms: '',
      consentToContact: false,
      shareWithAuthorities: true
    });
    onClose?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full max-w-2xl max-h-[90vh] bg-background border border-border rounded-xl shadow-medical-xl overflow-hidden
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-error/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Emergency Report</h2>
              <p className="text-sm text-muted-foreground">Report fake medicines or safety concerns</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 1 && (
            <form onSubmit={(e) => { e?.preventDefault(); setStep(2); }} className="p-6 space-y-6">
              {/* Verification Context */}
              {verificationData && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Related Verification</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Medicine:</strong> {verificationData?.medicineName || 'Unknown'}</p>
                    <p><strong>Batch:</strong> {verificationData?.batchNumber || 'Not specified'}</p>
                    <p><strong>Result:</strong> {verificationData?.result || 'Pending'}</p>
                  </div>
                </div>
              )}

              {/* Report Type */}
              <Select
                label="Type of Report"
                description="Select the most appropriate category"
                required
                options={reportTypeOptions}
                value={formData?.reportType}
                onChange={(value) => handleInputChange('reportType', value)}
              />

              {/* Urgency Level */}
              <Select
                label="Urgency Level"
                description="How urgent is this safety concern?"
                required
                options={urgencyOptions}
                value={formData?.urgency}
                onChange={(value) => handleInputChange('urgency', value)}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Detailed Description *
                </label>
                <textarea
                  className="w-full min-h-[120px] p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                  placeholder="Describe the issue in detail. Include any symptoms, observations, or concerns..."
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide as much detail as possible to help authorities investigate
                </p>
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Location"
                  placeholder="City, State"
                  value={formData?.location}
                  onChange={(e) => handleInputChange('location', e?.target?.value)}
                />
                <Input
                  label="Purchase Location"
                  placeholder="Pharmacy/store name and location"
                  value={formData?.purchaseLocation}
                  onChange={(e) => handleInputChange('purchaseLocation', e?.target?.value)}
                />
              </div>

              {/* Additional Details */}
              {formData?.reportType === 'fake_medicine' && (
                <Input
                  label="Batch Number"
                  placeholder="Enter batch number if available"
                  value={formData?.batchNumber}
                  onChange={(e) => handleInputChange('batchNumber', e?.target?.value)}
                />
              )}

              {formData?.reportType === 'adverse_reaction' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Symptoms Experienced
                  </label>
                  <textarea
                    className="w-full min-h-[80px] p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe symptoms, when they started, severity..."
                    value={formData?.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e?.target?.value)}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" iconName="ArrowRight" iconPosition="right">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  Authorities may need to contact you for follow-up
                </p>
              </div>

              {/* Contact Method */}
              <Select
                label="Preferred Contact Method"
                required
                options={contactMethodOptions}
                value={formData?.contactMethod}
                onChange={(value) => handleInputChange('contactMethod', value)}
              />

              {/* Contact Info */}
              <Input
                label={`${formData?.contactMethod === 'phone' ? 'Phone Number' : 
                        formData?.contactMethod === 'email' ? 'Email Address' : 
                        formData?.contactMethod === 'sms' ? 'Mobile Number' : 'WhatsApp Number'}`}
                type={formData?.contactMethod === 'email' ? 'email' : 'tel'}
                placeholder={`Enter your ${formData?.contactMethod}`}
                required
                value={formData?.contactInfo}
                onChange={(e) => handleInputChange('contactInfo', e?.target?.value)}
              />

              {/* Consent Checkboxes */}
              <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                <Checkbox
                  label="I consent to be contacted by authorities"
                  description="Allow health authorities to contact you for investigation purposes"
                  checked={formData?.consentToContact}
                  onChange={(e) => handleInputChange('consentToContact', e?.target?.checked)}
                />
                
                <Checkbox
                  label="Share with regulatory authorities"
                  description="Share this report with FDA, state health departments, and other relevant agencies"
                  checked={formData?.shareWithAuthorities}
                  onChange={(e) => handleInputChange('shareWithAuthorities', e?.target?.checked)}
                />
              </div>

              {/* Emergency Contacts */}
              <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                <h4 className="font-medium text-error mb-2 flex items-center">
                  <Icon name="Phone" size={16} className="mr-2" />
                  Emergency Contacts
                </h4>
                <div className="text-sm space-y-1">
                  <p><strong>Poison Control:</strong> 1-800-222-1222</p>
                  <p><strong>FDA Safety:</strong> 1-800-FDA-1088</p>
                  <p><strong>Emergency:</strong> 911</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!formData?.consentToContact}
                  iconName="Send"
                  iconPosition="right"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} color="var(--color-success)" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Report Submitted</h3>
              <p className="text-muted-foreground mb-6">
                Your report has been successfully submitted to the appropriate authorities. 
                You will receive a confirmation email shortly.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-foreground mb-1">Report ID</p>
                <p className="font-mono text-primary">RPT-{Date.now()}</p>
              </div>

              <div className="space-y-3">
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  iconName="Download"
                  iconPosition="left"
                >
                  Download Report Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EmergencyReportingModal;