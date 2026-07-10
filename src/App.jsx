import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "context/ThemeContext";
import { AuthProvider } from "context/AuthContext";
import { TooltipProvider } from "components/ui/tooltip";
import { ProtectedRoute } from "components/ProtectedRoute";
import { DashboardLayout } from "layouts/DashboardLayout";
import LoginPage from "pages/LoginPage";
import SignUpPage from "pages/SignUpPage";
import DashboardPage from "pages/DashboardPage";
import ExpensesPage from "pages/ExpensesPage";
import IncomePage from "pages/IncomePage";
import AssetsPage from "pages/AssetsPage";
import AlertsPage from "pages/AlertsPage";
import ForecastPage from "pages/ForecastPage";
import SettingsPage from "pages/SettingsPage";

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="income" element={<IncomePage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="assets" element={<AssetsPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="forecast" element={<ForecastPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
