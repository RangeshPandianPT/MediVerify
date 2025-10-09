import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileHeader from './components/ProfileHeader';
import VerificationStats from './components/VerificationStats';
import SettingsPanel from './components/SettingsPanel';
import SecurityPanel from './components/SecurityPanel';
import EmergencyContactsPanel from './components/EmergencyContactsPanel';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    joinDate: "2024-03-15T10:30:00Z",
    avatar: null
  });

  const [verificationStats, setVerificationStats] = useState({
    totalVerifications: 47,
    authenticCount: 41,
    fakeCount: 6,
    communityImpact: 156,
    weeklyAverage: 8,
    monthlyGrowth: 23,
    userRank: 142,
    recentActivity: [
      {
        id: 1,
        medicine: "Paracetamol 500mg",
        type: "authentic",
        confidence: 96,
        date: "2 hours ago"
      },
      {
        id: 2,
        medicine: "Amoxicillin 250mg",
        type: "fake",
        confidence: 89,
        date: "1 day ago"
      },
      {
        id: 3,
        medicine: "Crocin Advance",
        type: "authentic",
        confidence: 94,
        date: "2 days ago"
      },
      {
        id: 4,
        medicine: "Dolo 650",
        type: "suspicious",
        confidence: 67,
        date: "3 days ago"
      }
    ]
  });

  const [settings, setSettings] = useState({
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
    }
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    emergencyEmail: "rajesh.emergency@email.com",
    emergencyPhone: "+91 87654 32109"
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      relationship: "family_doctor",
      phone: "+91 98765 43210",
      email: "dr.rajesh@clinic.com",
      priority: 1
    },
    {
      id: 2,
      name: "Priya Sharma",
      relationship: "spouse",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com",
      priority: 2
    }
  ]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'statistics', label: 'Statistics', icon: 'BarChart3' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'emergency', label: 'Emergency', icon: 'Phone' }
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data from localStorage or API
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleUpdateProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleUpdateSecurity = (securityUpdate) => {
    console.log('Security update:', securityUpdate);
    // Handle security updates
  };

  const handleUpdateContacts = (contacts) => {
    setEmergencyContacts(contacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileHeader 
            user={user} 
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'statistics':
        return (
          <VerificationStats 
            stats={verificationStats}
          />
        );
      case 'settings':
        return (
          <SettingsPanel 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      case 'security':
        return (
          <SecurityPanel 
            securityData={securityData}
            onUpdateSecurity={handleUpdateSecurity}
          />
        );
      case 'emergency':
        return (
          <EmergencyContactsPanel 
            contacts={emergencyContacts}
            onUpdateContacts={handleUpdateContacts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        verificationCount={verificationStats?.totalVerifications}
        hasUnreadResults={false}
      />
      <div className="content-offset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your profile, preferences, and security settings
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/verification-history')}
                iconName="History"
                iconPosition="left"
              >
                View History
              </Button>
              <Button
                onClick={() => navigate('/medicine-verification')}
                iconName="Camera"
                iconPosition="left"
              >
                Verify Medicine
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-4 shadow-medical sticky top-24">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-medical'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium text-foreground mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => navigate('/user-dashboard')}
                      iconName="LayoutDashboard"
                      iconPosition="left"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="Download"
                      iconPosition="left"
                    >
                      Export Data
                    </Button>
                  </div>
                </div>

                {/* Account Status */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                      <span className="text-sm font-medium text-success">Account Verified</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your account is fully verified and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;