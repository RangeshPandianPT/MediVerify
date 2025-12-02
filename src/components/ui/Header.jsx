import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Database } from 'lucide-react';
import Icon from '../AppIcon';
import Button from './Button';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ user, verificationCount = 0, hasUnreadResults = false, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      icon: Database,
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

  return (
    <>
      <header className="nav-fixed bg-background border-b border-border shadow-medical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Icon name="Shield" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground">MediVerify</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">Protect your family</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigate(item?.path)}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    focus-medical spring-transform
                    ${isActive(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-medical'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  title={item?.tooltip}
                >
                  <div className="flex items-center space-x-2">
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                    {item?.path === '/verification-history' && hasUnreadResults && (
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </nav>

            {/* User Section & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle />
              
              {/* Verification Count Badge */}
              {verificationCount > 0 && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
                  <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                  <span className="text-sm font-mono text-muted-foreground">{verificationCount}</span>
                </div>
              )}

              {/* User Avatar */}
              {user && (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-medical spring-transform"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
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
            {user && (
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-base font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{user?.name}</div>
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