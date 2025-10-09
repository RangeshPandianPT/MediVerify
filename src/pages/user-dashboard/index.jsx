import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import VerificationButton from './components/VerificationButton';
import RecentVerifications from './components/RecentVerifications';
import StatisticsPanel from './components/StatisticsPanel';
import QuickAccessTiles from './components/QuickAccessTiles';
import EducationalHighlights from './components/EducationalHighlights';
import NewsAndAlerts from './components/NewsAndAlerts';

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  // Mock user data - in real app this would come from authentication context
  useEffect(() => {
    const mockUser = {
      id: 'user_123',
  name: 'RANGESH',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      joinedDate: '2024-03-15',
      verificationCount: 47,
      trustScore: 94
    };
    setUser(mockUser);
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard - MediVerify | Protect Your Family</title>
        <meta name="description" content="Your personal medicine verification dashboard. View recent scans, track authenticity checks, and access safety tools to protect your family from fake medicines." />
        <meta name="keywords" content="medicine verification, fake medicine detection, healthcare dashboard, medicine safety, India" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          user={user} 
          verificationCount={user?.verificationCount || 0}
          hasUnreadResults={true}
        />
        
        <main className="content-offset">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Welcome back, {user?.name?.split(' ')?.[0] || 'User'}! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Keep your family safe with instant medicine verification
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>System Online</span>
                  </div>
                  <div>
                    Last updated: {new Date()?.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Primary Actions */}
              <div className="lg:col-span-2 space-y-8">
                {/* Verification CTA */}
                <VerificationButton />

                {/* Recent Verifications */}
                <RecentVerifications />

                {/* Educational Content */}
                <EducationalHighlights />
              </div>

              {/* Right Column - Secondary Info */}
              <div className="space-y-8">
                {/* Statistics */}
                <StatisticsPanel />

                {/* Quick Access */}
                <QuickAccessTiles />

                {/* News & Alerts */}
                <NewsAndAlerts />
              </div>
            </div>

            {/* Mobile-Optimized Bottom Section */}
            <div className="mt-12 lg:hidden">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">How to verify medicines</span>
                    <button 
                      className="text-primary text-sm font-medium"
                      onClick={() => alert('Tutorial coming soon!')}
                    >
                      Watch Tutorial
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">Contact support</span>
                    <button 
                      className="text-primary text-sm font-medium"
                      onClick={() => alert('Support chat coming soon!')}
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  MediVerify is committed to protecting Indian families from fake medicines
                </p>
                <p>
                  Powered by AI • Trusted by {(47000)?.toLocaleString('en-IN')}+ users • 
                  {' '}98.5% accuracy rate
                </p>
                <p className="mt-2">
                  © {new Date()?.getFullYear()} MediVerify. Making healthcare safer for everyone.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;