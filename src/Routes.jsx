import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./pages/NotFound";
import LoginPage from './pages/login';
import VerificationResults from './pages/verification-results';
import VerificationHistory from './pages/verification-history';
import UserDashboard from './pages/user-dashboard';
import UserProfile from './pages/user-profile';
import MedicineVerification from './pages/medicine-verification';
import MedicineDatabase from './pages/medicine-database';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Navigate to="/user-dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verification-results" element={<ProtectedRoute><VerificationResults /></ProtectedRoute>} />
        <Route path="/verification-history" element={<ProtectedRoute><VerificationHistory /></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/medicine-verification" element={<ProtectedRoute><MedicineVerification /></ProtectedRoute>} />
        <Route path="/medicine-database" element={<ProtectedRoute><MedicineDatabase /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
