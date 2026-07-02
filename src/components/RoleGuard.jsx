import React from 'react';
import { Navigate } from 'react-router-dom';
import Icon from './AppIcon';

/**
 * RoleGuard restricts access to specific roles.
 * Wrap any component or route with RoleGuard to enforce RBAC.
 */
const RoleGuard = ({ children, allowedRoles, fallback }) => {
  // Mock role resolution - in production this should come from Firebase Custom Claims or a backend User model
  const userStr = localStorage.getItem('user');
  let userRole = 'user'; // 'user', 'pharmacist', 'admin'
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // For demo purposes, assign 'admin' if email contains 'admin'
      if (user.email && user.email.includes('admin')) {
        userRole = 'admin';
      } else if (user.email && user.email.includes('pharma')) {
        userRole = 'pharmacist';
      }
    } catch(e) {}
  }

  if (!allowedRoles.includes(userRole)) {
    if (fallback) return fallback;
    
    // Default fallback UI for unauthorized access
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-xl border border-border">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
          <Icon name="Lock" size={32} color="var(--color-error)" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Access Denied</h3>
        <p className="text-muted-foreground max-w-md">
          You do not have the required permissions to view this content. 
          This area is restricted to: {allowedRoles.join(', ')}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
