import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SettingsPanel = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState({
    language: 'en',
    notifications: {
      verificationAlerts: true,
      platformUpdates: true,
      communityNews: false,
      emergencyAlerts: true
    },
    privacy: {
      shareHistory: false,
      publicProfile: false,
      analyticsOptIn: true
    },
    verification: {
      autoSave: true,
      highQualityMode: true,
      flashByDefault: false,
      soundEffects: true
    },
    ...settings
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
  ];

  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings?.[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleLanguageChange = (value) => {
    const newSettings = { ...localSettings, language: value };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Globe" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Language & Region</h3>
        </div>
        
        <div className="space-y-4">
          <Select
            label="Display Language"
            description="Choose your preferred language for the interface"
            options={languageOptions}
            value={localSettings?.language}
            onChange={handleLanguageChange}
          />
          
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Regional Language Support</p>
                <p className="text-muted-foreground">
                  Full Hindi support coming soon. Other regional languages in development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Bell" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Verification Alerts"
            description="Get notified when verification results are ready"
            checked={localSettings?.notifications?.verificationAlerts}
            onChange={(e) => handleSettingChange('notifications', 'verificationAlerts', e?.target?.checked)}
          />
          
          <Checkbox
            label="Platform Updates"
            description="Receive updates about new features and improvements"
            checked={localSettings?.notifications?.platformUpdates}
            onChange={(e) => handleSettingChange('notifications', 'platformUpdates', e?.target?.checked)}
          />
          
          <Checkbox
            label="Community News"
            description="Stay informed about medicine safety news and alerts"
            checked={localSettings?.notifications?.communityNews}
            onChange={(e) => handleSettingChange('notifications', 'communityNews', e?.target?.checked)}
          />
          
          <Checkbox
            label="Emergency Alerts"
            description="Critical alerts about fake medicine outbreaks"
            checked={localSettings?.notifications?.emergencyAlerts}
            onChange={(e) => handleSettingChange('notifications', 'emergencyAlerts', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Shield" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Privacy & Data</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Share Verification History"
            description="Allow anonymized data to help improve community safety"
            checked={localSettings?.privacy?.shareHistory}
            onChange={(e) => handleSettingChange('privacy', 'shareHistory', e?.target?.checked)}
          />
          
          <Checkbox
            label="Public Profile"
            description="Make your verification statistics visible to other users"
            checked={localSettings?.privacy?.publicProfile}
            onChange={(e) => handleSettingChange('privacy', 'publicProfile', e?.target?.checked)}
          />
          
          <Checkbox
            label="Analytics & Improvement"
            description="Help us improve MediVerify by sharing usage analytics"
            checked={localSettings?.privacy?.analyticsOptIn}
            onChange={(e) => handleSettingChange('privacy', 'analyticsOptIn', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Verification Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Camera" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Verification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Auto-save Results"
            description="Automatically save verification results to your history"
            checked={localSettings?.verification?.autoSave}
            onChange={(e) => handleSettingChange('verification', 'autoSave', e?.target?.checked)}
          />
          
          <Checkbox
            label="High Quality Mode"
            description="Use higher resolution for better accuracy (uses more data)"
            checked={localSettings?.verification?.highQualityMode}
            onChange={(e) => handleSettingChange('verification', 'highQualityMode', e?.target?.checked)}
          />
          
          <Checkbox
            label="Flash by Default"
            description="Enable camera flash automatically in low light"
            checked={localSettings?.verification?.flashByDefault}
            onChange={(e) => handleSettingChange('verification', 'flashByDefault', e?.target?.checked)}
          />
          
          <Checkbox
            label="Sound Effects"
            description="Play audio feedback for verification results"
            checked={localSettings?.verification?.soundEffects}
            onChange={(e) => handleSettingChange('verification', 'soundEffects', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Data Export */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Download" size={20} color="var(--color-primary)" />
          <h3 className="font-semibold text-foreground">Data Export</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Download your complete verification history and personal data
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            iconName="FileText"
            iconPosition="left"
            className="justify-start"
          >
            Export Verification History
          </Button>
          
          <Button
            variant="outline"
            iconName="User"
            iconPosition="left"
            className="justify-start"
          >
            Download Personal Data
          </Button>
        </div>
      </div>
      {/* Reset Settings */}
      <div className="bg-error/5 border border-error/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="RotateCcw" size={20} color="var(--color-error)" />
          <h3 className="font-semibold text-error">Reset Settings</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Reset all settings to default values. This action cannot be undone.
        </p>
        
        <Button
          variant="outline"
          className="border-error text-error hover:bg-error hover:text-error-foreground"
          iconName="AlertTriangle"
          iconPosition="left"
        >
          Reset All Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;