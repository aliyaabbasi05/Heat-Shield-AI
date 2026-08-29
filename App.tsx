/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SitesPage from './pages/SitesPage';
import SettingsPage from './pages/SettingsPage';
import AgentPage from './pages/AgentPage';
import MonitorPage from './pages/MonitorPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/sites" element={<SitesPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/agent" element={<AgentPage />} />
        <Route path="/dashboard/monitor" element={<MonitorPage />} />
        <Route path="/dashboard/alerts" element={<AlertsPage />} />
        <Route path="/dashboard/reports" element={<ReportsPage />} />
        {/* Fallbacks for other sidebar links */}
        <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
