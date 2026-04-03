import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import DarkModeToggle from './DarkModeToggle';
import { useToast } from './Toast';
import { signOutUser, subscribeToAuthState } from '../../utils/firebaseAuth';

const Header = ({ user, verificationCount = 0, hasUnreadResults = false, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authIdentity, setAuthIdentity] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const userMenuRef = useRef(null);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/user-dashboard', 
      icon: 'LayoutDashboard',
      tooltip: 'View recent activity and quick stats'
    },
    { 
      label: 'Verify', 
      path: '/medicine-verification', 
      icon: 'Shield',
      tooltip: 'Scan medicine for authenticity verification'
    },
    { 
      label: 'Database', 
      path: '/medicine-database', 
      icon: 'Database',
      tooltip: 'Browse comprehensive medicine database'
    },
    { 
      label: 'History', 
      path: '/verification-history', 
      icon: 'History',
      tooltip: 'View past verification results'
    },
    { 
      label: 'Profile', 
      path: '/user-profile', 
      icon: 'User',
      tooltip: 'Manage account settings and preferences'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsSignOutConfirmOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return undefined;
    }

    const handleDocumentClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen && !isSignOutConfirmOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (isSignOutConfirmOpen) {
        if (!isSigningOut) {
          setIsSignOutConfirmOpen(false);
        }
        return;
      }

      setIsUserMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isUserMenuOpen, isSignOutConfirmOpen, isSigningOut]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      if (!firebaseUser) {
        setAuthIdentity(null);
        return;
      }

      setAuthIdentity({
        name: firebaseUser?.displayName || '',
        email: firebaseUser?.email || '',
        photoURL: firebaseUser?.photoURL || ''
      });
    });

    return unsubscribe;
  }, []);

  const getStoredSessionUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const sessionUser = getStoredSessionUser();
  const activeUser = {
    ...user,
    name: authIdentity?.name || user?.name || sessionUser?.name || 'User',
    email: authIdentity?.email || user?.email || sessionUser?.email || ''
  };

  const handleOpenProfile = () => {
    setIsUserMenuOpen(false);
    handleNavigate('/user-profile');
  };

  const handleRequestSignOut = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsSignOutConfirmOpen(true);
  };

  const handleConfirmSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    let signOutError = null;

    try {
      await signOutUser();
    } catch (error) {
      signOutError = error;
      // Continue with local session cleanup even if Firebase sign-out is unavailable.
      console.warn('Sign-out fallback activated:', error?.message || error);
    }

    localStorage.removeItem('mediverify_user');
    sessionStorage.removeItem('mediverify_user');
    setIsSignOutConfirmOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsSigningOut(false);

    if (signOutError) {
      addToast('Signed out locally. Please close other active sessions if needed.', 'info');
    } else {
      addToast('Signed out successfully.', 'success');
    }

    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="nav-fixed bg-card border-b border-border shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <Icon name="Shield" size={24} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">MediVerify</span>
                  <span className="text-xs text-muted-foreground hidden sm:block font-medium">Protect your family</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigate(item?.path)}
                  className={`
                    relative px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                    focus-medical spring-transform flex items-center space-x-2
                    ${isActive(item?.path)
                      ? 'bg-primary/10 text-primary border border-primary/30 shadow-subtle'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                  title={item?.tooltip}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                  {item?.path === '/verification-history' && hasUnreadResults && (
                    <div className="w-2 h-2 bg-accent rounded-full ml-1"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* User Section & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle />
              
              {/* Verification Count Badge */}
              {verificationCount > 0 && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-full">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <span className="text-sm font-semibold text-success">{verificationCount}</span>
                </div>
              )}

              {/* User Avatar Dropdown */}
              {activeUser && (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center space-x-3 px-4 py-2 bg-muted rounded-lg border border-transparent hover:border-border transition-colors focus-medical"
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                    aria-label="Open account menu"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-subtle">
                      <span className="text-sm font-bold text-primary-foreground">
                        {activeUser?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{activeUser?.name}</span>
                    <Icon
                      name={isUserMenuOpen ? 'ChevronUp' : 'ChevronDown'}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-60 bg-popover border border-border rounded-xl shadow-medical-lg p-2 z-[260]"
                    >
                      <div className="px-3 py-2 border-b border-border mb-2">
                        <p className="text-sm font-semibold text-foreground truncate">{activeUser?.name || 'User'}</p>
                        {activeUser?.email && (
                          <p className="text-xs text-muted-foreground truncate">{activeUser?.email}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleOpenProfile}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Icon name="User" size={16} />
                        <span>View Profile</span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleRequestSignOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-medical spring-transform"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Navigation Panel */}
      <div className={`
        fixed inset-0 z-250 md:hidden
        ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-black transition-opacity duration-300
            ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div className={`
          absolute top-0 right-0 h-full w-80 max-w-sm bg-background border-l border-border shadow-medical-xl
          mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}
        `}>
          <div className="p-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Icon name="Shield" size={20} color="white" />
                </div>
                <span className="text-lg font-bold text-foreground">MediVerify</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-medical"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* User Info */}
            {activeUser && (
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-base font-semibold text-primary-foreground">
                    {activeUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{activeUser?.name}</div>
                  {activeUser?.email && (
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{activeUser?.email}</div>
                  )}
                  {verificationCount > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Icon name="CheckCircle" size={12} color="var(--color-success)" />
                      <span className="font-mono">{verificationCount} verified</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            <nav className="space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigate(item?.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                    transition-all duration-200 focus-medical spring-transform
                    ${isActive(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-medical'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={20} />
                  <div className="flex-1">
                    <div className="font-medium">{item?.label}</div>
                    <div className="text-xs opacity-75">{item?.tooltip}</div>
                  </div>
                  {item?.path === '/verification-history' && hasUnreadResults && (
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            {user && (
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  iconName="User"
                  iconPosition="left"
                  onClick={handleOpenProfile}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-error text-error hover:bg-error hover:text-error-foreground"
                  iconName="LogOut"
                  iconPosition="left"
                  onClick={handleRequestSignOut}
                >
                  Sign Out
                </Button>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
                <span className="text-sm font-medium text-error">Emergency</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Report fake medicines immediately
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-error text-error hover:bg-error hover:text-error-foreground"
                iconName="Phone"
                iconPosition="left"
              >
                Report Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isSignOutConfirmOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="signout-title">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close sign-out confirmation"
            disabled={isSigningOut}
            onClick={() => {
              if (!isSigningOut) {
                setIsSignOutConfirmOpen(false);
              }
            }}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-medical-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 text-warning">
                <Icon name="LogOut" size={18} />
              </div>
              <div>
                <h3 id="signout-title" className="text-lg font-semibold text-foreground">Sign out now?</h3>
                <p className="text-sm text-muted-foreground">You will need to log in again to access protected pages.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsSignOutConfirmOpen(false)}
                disabled={isSigningOut}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                iconName="LogOut"
                iconPosition="left"
                loading={isSigningOut}
                disabled={isSigningOut}
                onClick={handleConfirmSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Verify Button (Mobile) */}
      {!isActive('/medicine-verification') && (
        <button
          onClick={() => handleNavigate('/medicine-verification')}
          className="verify-float md:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-medical-lg spring-transform focus-medical"
          aria-label="Quick verify medicine"
        >
          <Icon name="Camera" size={24} />
        </button>
      )}
    </>
  );
};

export default Header;