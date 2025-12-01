import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import VerificationResults from './pages/verification-results';
import VerificationHistory from './pages/verification-history';
import UserDashboard from './pages/user-dashboard';
import UserProfile from './pages/user-profile';
import MedicineVerification from './pages/medicine-verification';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<MedicineVerification />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verification-results" element={<VerificationResults />} />
        <Route path="/verification-history" element={<VerificationHistory />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/medicine-verification" element={<MedicineVerification />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
