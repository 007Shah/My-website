import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AccountsDashboard } from './pages/AccountsDashboard';
import { SecuritySettingsPage } from './pages/SecuritySettingsPage';
import { MyCardsPage } from './pages/MyCardsPage';
import { TransfersPage } from './pages/TransfersPage';
import { BillPaymentsPage } from './pages/BillPaymentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LoginPage />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AccountsDashboard />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/payments" element={<BillPaymentsPage />} />
          <Route path="/cards" element={<MyCardsPage />} />
          <Route path="/settings" element={<SecuritySettingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<AccessDeniedPage />} />
      </Routes>
    </AnimatePresence>
  );
}
