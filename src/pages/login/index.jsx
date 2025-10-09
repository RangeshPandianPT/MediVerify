import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import GuestAccessCard from './components/GuestAccessCard';
import PlatformBranding from './components/PlatformBranding';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/user-dashboard');
    }

    // Check screen size for mobile optimization
    const checkScreenSize = () => {
      setShowMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store login state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userMode', 'authenticated');
    localStorage.setItem('user', JSON.stringify({
      name: 'Rajesh Kumar',
      email: formData?.email,
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      joinDate: '2024-01-15',
      verificationCount: 47
    }));
    
    setIsLoading(false);
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      <div className="relative z-10">
        {/* Mobile Layout */}
        {showMobileView ? (
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-background/80 backdrop-blur-sm border-b border-border p-6">
              <PlatformBranding size="sm" />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
              <GuestAccessCard />
              
              {/* Registration Link */}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  New to MediVerify?
                </p>
                <button
                  onClick={handleRegisterRedirect}
                  className="text-primary hover:text-primary/80 font-medium focus-medical"
                >
                  Create your account →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          (<div className="min-h-screen flex">
            {/* Left Panel - Branding & Trust */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-primary/10 via-accent/5 to-background border-r border-border">
              <div className="flex flex-col justify-center p-12 space-y-8">
                <PlatformBranding size="lg" />
                
                {/* Key Features */}
                <div className="space-y-6">
                  <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 shadow-medical">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Why Choose MediVerify?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                          <span className="text-success font-bold text-sm">AI</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Forensic-Level Analysis</p>
                          <p className="text-sm text-muted-foreground">Advanced AI detects even sophisticated fakes</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="text-accent font-bold text-sm">3s</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Instant Results</p>
                          <p className="text-sm text-muted-foreground">Get verification results in seconds</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">₹</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Protect Your Investment</p>
                          <p className="text-sm text-muted-foreground">Avoid costly fake medicine purchases</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <TrustSignals />
                </div>
              </div>
            </div>
            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-md space-y-8">
                {/* Mobile Branding (hidden on desktop) */}
                <div className="lg:hidden">
                  <PlatformBranding size="default" />
                </div>

                {/* Login Card */}
                <div className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl shadow-medical-xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                    <p className="text-muted-foreground">
                      Sign in to continue protecting your family
                    </p>
                  </div>

                  <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                </div>

                {/* Guest Access & Registration */}
                <div className="space-y-4">
                  <GuestAccessCard />
                  
                  <div className="text-center p-6 bg-background/50 backdrop-blur-sm border border-border rounded-xl">
                    <p className="text-sm text-muted-foreground mb-3">
                      Don't have an account?
                    </p>
                    <button
                      onClick={handleRegisterRedirect}
                      className="text-primary hover:text-primary/80 font-semibold focus-medical"
                    >
                      Create your MediVerify account →
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Join thousands protecting their families
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>)
        )}

        {/* Footer */}
        <div className="bg-background/80 backdrop-blur-sm border-t border-border p-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} MediVerify. Protecting Indian families from fake medicines.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-muted-foreground">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Emergency: 1800-FDA-HELP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;