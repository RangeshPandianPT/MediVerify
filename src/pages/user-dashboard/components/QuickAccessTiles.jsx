import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickAccessTiles = ({ className = '' }) => {
  const navigate = useNavigate();

  const tileColorClasses = {
    primary: {
      hoverBorder: 'hover:border-primary/30',
      focusRing: 'focus:ring-primary',
      iconBg: 'bg-primary/10',
      badge: 'bg-primary/10 text-primary'
    },
    accent: {
      hoverBorder: 'hover:border-accent/30',
      focusRing: 'focus:ring-accent',
      iconBg: 'bg-accent/10',
      badge: 'bg-accent/10 text-accent'
    },
    error: {
      hoverBorder: 'hover:border-error/30',
      focusRing: 'focus:ring-error',
      iconBg: 'bg-error/10',
      badge: 'bg-error/10 text-error'
    },
    secondary: {
      hoverBorder: 'hover:border-secondary/30',
      focusRing: 'focus:ring-secondary',
      iconBg: 'bg-secondary/10',
      badge: 'bg-secondary/10 text-secondary'
    }
  };

  const quickAccessItems = [
    {
      id: 'history',
      title: 'Verification History',
      description: 'View all past medicine checks',
      icon: 'History',
      color: 'primary',
      path: '/verification-history',
      badge: '47 records'
    },
    {
      id: 'education',
      title: 'Medicine Safety Guide',
      description: 'Learn to identify fake medicines',
      icon: 'BookOpen',
      color: 'accent',
      path: '/education',
      badge: 'New tips'
    },
    {
      id: 'emergency',
      title: 'Report Fake Medicine',
      description: 'Emergency reporting to authorities',
      icon: 'AlertTriangle',
      color: 'error',
      path: '/emergency-report',
      badge: 'Urgent'
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage account and preferences',
      icon: 'User',
      color: 'secondary',
      path: '/user-profile',
      badge: null
    }
  ];

  const handleTileClick = (path) => {
    if (path === '/education' || path === '/emergency-report') {
      // For demo purposes, show alert for unimplemented features
      alert(`${path?.replace('/', '')?.replace('-', ' ')} feature coming soon!`);
      return;
    }
    navigate(path);
  };

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Quick Access</h3>
        <p className="text-sm text-muted-foreground">
          Navigate to key platform features
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
        {quickAccessItems?.map((item) => (
          <div key={item?.id} className="h-full">
          <div
            onClick={() => handleTileClick(item?.path)}
            className={`
              h-full flex flex-col bg-card border border-border rounded-xl p-5 cursor-pointer
              hover:shadow-medical ${tileColorClasses?.[item?.color]?.hoverBorder || 'hover:border-primary/30'}
              transition-all duration-200 spring-transform
              focus:outline-none focus:ring-2 ${tileColorClasses?.[item?.color]?.focusRing || 'focus:ring-primary'} focus:ring-offset-2
            `}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e?.key === 'Enter' || e?.key === ' ') {
                e?.preventDefault();
                handleTileClick(item?.path);
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${tileColorClasses?.[item?.color]?.iconBg || 'bg-primary/10'} rounded-lg flex items-center justify-center`}>
                <Icon name={item?.icon} size={24} color={`var(--color-${item?.color})`} />
              </div>
              {item?.badge && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tileColorClasses?.[item?.color]?.badge || 'bg-primary/10 text-primary'}`}>
                  {item?.badge}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2">
                {item?.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item?.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/70 flex items-center text-xs text-muted-foreground">
              <span>Click to access</span>
              <Icon name="ArrowRight" size={14} className="ml-1" />
            </div>
          </div>
          </div>
        ))}
      </div>
      {/* Additional Quick Actions */}
      <div className="mt-6 bg-muted/30 rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={18} className="mr-2" color="var(--color-accent)" />
          Quick Actions
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/medicine-verification')}
            className="flex items-center space-x-2 p-3 bg-card border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors"
          >
            <Icon name="Camera" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">Quick Scan</span>
          </button>
          
          <button
            onClick={() => navigate('/verification-history')}
            className="flex items-center space-x-2 p-3 bg-card border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors"
          >
            <Icon name="Search" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">Search History</span>
          </button>
          
          <button
            onClick={() => alert('Share feature coming soon!')}
            className="flex items-center space-x-2 p-3 bg-card border border-border rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors"
          >
            <Icon name="Share2" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">Share App</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessTiles;