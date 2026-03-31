import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Icon from './AppIcon';
import { isFirebaseConfigured, subscribeToAuthState } from '../utils/firebaseAuth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isChecking: true,
    isAuthenticated: false
  });

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthState({
        isChecking: false,
        isAuthenticated: false
      });
      return () => {};
    }

    const unsubscribe = subscribeToAuthState((user) => {
      const isAuthenticated = Boolean(user);

      if (!isAuthenticated) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      }

      setAuthState({
        isChecking: false,
        isAuthenticated
      });
    });

    return unsubscribe;
  }, []);

  if (authState.isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 px-6">
        <div className="w-full max-w-md bg-background/90 backdrop-blur-sm border border-border rounded-2xl shadow-medical-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Icon name="ShieldCheck" size={26} color="var(--color-primary)" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Verifying secure session</h2>
          <p className="text-sm text-muted-foreground">Please wait while we confirm your login status.</p>
        </div>
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 px-6">
        <div className="w-full max-w-md bg-background/90 backdrop-blur-sm border border-border rounded-2xl shadow-medical-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={26} color="var(--color-warning)" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Authentication setup required</h2>
          <p className="text-sm text-muted-foreground">This page is protected. Configure Firebase credentials in your environment to enable secure login.</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;