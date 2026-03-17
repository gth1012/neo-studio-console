import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/auth.store';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeadletterPage from './pages/DeadletterPage';
import DevicesPage from './pages/DevicesPage';
import RateLimitPage from './pages/RateLimitPage';
import WhitelistPage from './pages/WhitelistPage';
import AuditPage from './pages/AuditPage';
import DinaSearchPage from './pages/DinaSearchPage';
import ClaimHistoryPage from './pages/ClaimHistoryPage';
import VerifyEventsPage from './pages/VerifyEventsPage';
import SeriesStatusPage from './pages/SeriesStatusPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10000,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

// 401 자동 로그아웃 처리
function AuthLogoutHandler() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      logout();
      queryClient.clear();
      navigate('/login', { replace: true });
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout, navigate]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/neo-studio-console">
        <Toast />
        <AuthLogoutHandler />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/series-status" element={<SeriesStatusPage />} />
            <Route path="/deadletter" element={<DeadletterPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/ratelimit" element={<RateLimitPage />} />
            <Route path="/whitelist" element={<WhitelistPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/dina-search" element={<DinaSearchPage />} />
            <Route path="/claim-history" element={<ClaimHistoryPage />} />
            <Route path="/verify-events" element={<VerifyEventsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
