import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import ProfileHeader from './components/ProfileHeader';
import VerificationStats from './components/VerificationStats';
import SettingsPanel from './components/SettingsPanel';
import SecurityPanel from './components/SecurityPanel';
import EmergencyContactsPanel from './components/EmergencyContactsPanel';
import { signOutUser, subscribeToAuthState } from '../../utils/firebaseAuth';

const UserProfile = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const modalContainerRef = useRef(null);
  const cancelButtonRef = useRef(null);
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

  const [sessionSecurity, setSessionSecurity] = useState({
    emailVerified: false,
    providerId: 'password',
    lastSignInTime: null
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
  name: "RANGESH",
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
    const storedProfile = localStorage.getItem('userData');
    if (storedProfile) {
      setUser((prev) => ({ ...prev, ...JSON.parse(storedProfile) }));
    }

    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login', { replace: true });
        return;
      }

      setSessionSecurity({
        emailVerified: Boolean(firebaseUser?.emailVerified),
        providerId: firebaseUser?.providerData?.[0]?.providerId || 'password',
        lastSignInTime: firebaseUser?.metadata?.lastSignInTime || null
      });

      const localSessionUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser((prev) => ({
        ...prev,
        ...localSessionUser,
        email: firebaseUser?.email || localSessionUser?.email || prev.email,
        name: firebaseUser?.displayName || localSessionUser?.name || prev.name,
        phone: localSessionUser?.phone || prev.phone,
        location: localSessionUser?.location || prev.location,
        joinDate: firebaseUser?.metadata?.creationTime || prev.joinDate
      }));
    });

    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (!isSignOutModalOpen) return undefined;

    const previousActiveElement = document.activeElement;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () => {
      if (!modalContainerRef.current) return [];
      return Array.from(modalContainerRef.current.querySelectorAll(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
      );
    };

    const focusTimer = window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isSigningOut) {
          setIsSignOutModalOpen(false);
        }
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [isSignOutModalOpen, isSigningOut]);

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

  const handleSignOut = async () => {
    let isSignOutSuccessful = false;

    try {
      setIsSigningOut(true);
      await signOutUser();
      isSignOutSuccessful = true;
      addToast('Signed out securely. See you again soon.', 'success');
    } catch (error) {
      console.error('Sign out failed:', error);
      addToast('Sign out failed. Please try again.', 'error');
    } finally {
      if (isSignOutSuccessful) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userMode');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      }

      setIsSignOutModalOpen(false);
      setIsSigningOut(false);
    }
  };

  const openSignOutModal = () => {
    setIsSignOutModalOpen(true);
  };

  const closeSignOutModal = () => {
    if (isSigningOut) return;
    setIsSignOutModalOpen(false);
  };

  const confirmSignOut = async () => {
    await handleSignOut();
  };

  const activeSecurityChecks = [
    sessionSecurity?.emailVerified,
    securityData?.twoFactorEnabled,
    Boolean(securityData?.emergencyEmail || securityData?.emergencyPhone)
  ]?.filter(Boolean)?.length;

  const securityScore = Math.round((activeSecurityChecks / 3) * 100);

  const securityTone = securityScore >= 80
    ? 'text-success'
    : securityScore >= 50
      ? 'text-warning'
      : 'text-error';

  const providerLabel = sessionSecurity?.providerId === 'google.com' ? 'Google Login' : 'Email & Password';

  const formattedLastSignIn = sessionSecurity?.lastSignInTime
    ? new Date(sessionSecurity.lastSignInTime).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Active now';

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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 bg-card border border-border rounded-2xl p-5 shadow-subtle">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your profile, preferences, and account security from one place.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/verification-history')}
                iconName="History"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                View History
              </Button>
              <Button
                onClick={() => navigate('/medicine-verification')}
                iconName="Camera"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Verify Medicine
              </Button>
              <Button
                variant="danger"
                onClick={openSignOutModal}
                loading={isSigningOut}
                iconName="LogOut"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Security Summary */}
          <div className="mb-6 lg:hidden rounded-2xl border border-border bg-card p-4 shadow-subtle">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account Security</p>
                <p className={`mt-1 text-2xl font-bold ${securityTone}`}>{securityScore}%</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                {providerLabel}
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${securityScore}%` }}
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border bg-background p-2 text-center">
                <p className="text-[11px] text-muted-foreground">Email</p>
                <p className={`mt-1 text-xs font-semibold ${sessionSecurity?.emailVerified ? 'text-success' : 'text-warning'}`}>
                  {sessionSecurity?.emailVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-2 text-center">
                <p className="text-[11px] text-muted-foreground">2FA</p>
                <p className={`mt-1 text-xs font-semibold ${securityData?.twoFactorEnabled ? 'text-success' : 'text-warning'}`}>
                  {securityData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-2 text-center">
                <p className="text-[11px] text-muted-foreground">Session</p>
                <p className="mt-1 text-xs font-semibold text-foreground">{formattedLastSignIn}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-4 shadow-medical lg:sticky lg:top-24">
                <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
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
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={openSignOutModal}
                      loading={isSigningOut}
                      iconName="LogOut"
                      iconPosition="left"
                    >
                      Sign Out Securely
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

      {/* Sticky Mobile Actions */}
      <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
        <div className="bg-card/95 backdrop-blur border border-border rounded-2xl p-3 shadow-medical-xl">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => navigate('/medicine-verification')}
              iconName="Camera"
              iconPosition="left"
              className="w-full"
            >
              Verify
            </Button>
            <Button
              variant="danger"
              onClick={openSignOutModal}
              iconName="LogOut"
              iconPosition="left"
              loading={isSigningOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={closeSignOutModal}
          />
          <div
            ref={modalContainerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-modal-title"
            aria-describedby="signout-modal-description"
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-medical-xl"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-warning/10 text-warning">
              <Icon name="ShieldAlert" size={22} />
            </div>
            <h3 id="signout-modal-title" className="text-xl font-semibold text-foreground">Sign out from your account?</h3>
            <p id="signout-modal-description" className="mt-2 text-sm text-muted-foreground">
              You will need to sign in again to access Dashboard, Verification, Database, and Profile sections.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tip: Press Escape to close this dialog.</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={closeSignOutModal}
                disabled={isSigningOut}
                ref={cancelButtonRef}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmSignOut}
                loading={isSigningOut}
                iconName="LogOut"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Confirm Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;