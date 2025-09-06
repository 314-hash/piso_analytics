import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Existing pages
import TransactionMonitoringDashboard from "./pages/transaction-monitoring-dashboard";
import UserAnalyticsDashboard from "./pages/user-analytics-dashboard";
import TreasuryTokenomicsDashboard from "./pages/treasury-tokenomics-dashboard";
import ExecutiveOverviewDashboard from "./pages/executive-overview-dashboard";
import NotFound from "./pages/NotFound";

// New token management pages
import TokenDashboard from "./pages/token-dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<TokenDashboard />} />
          <Route path="/token-dashboard" element={<TokenDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/transaction-monitoring" element={<TransactionMonitoringDashboard />} />
          <Route path="/user-analytics" element={<UserAnalyticsDashboard />} />
          <Route path="/treasury-tokenomics" element={<TreasuryTokenomicsDashboard />} />
          <Route path="/executive-overview" element={<ExecutiveOverviewDashboard />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}