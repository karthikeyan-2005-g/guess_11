import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useSocket } from './hooks/useSocket';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { SplashPage } from './pages/SplashPage';
import { WelcomePage } from './pages/WelcomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { CreateRoomPage } from './pages/CreateRoomPage';
import { JoinRoomPage } from './pages/JoinRoomPage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { RoundResultPage } from './pages/RoundResultPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HowToPlayPage } from './pages/HowToPlayPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Room Invitation Gateway - Handles Requirement 11
const RoomInviteGateway: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { isAuthenticated, setIntendedRedirectUrl } = useAuthStore();

  useEffect(() => {
    if (code) {
      const roomUrl = `/room/${code.toUpperCase()}`;
      if (!isAuthenticated) {
        // Save the intended room code URL so user automatically returns after login/registration
        setIntendedRedirectUrl(roomUrl);
      }
    }
  }, [code, isAuthenticated, setIntendedRedirectUrl]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/lobby/${code?.toUpperCase()}`} replace />;
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  // Initialize socket lifecycle hook
  useSocket();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SplashPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/how-to-play" element={<HowToPlayPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Room Invitation Route (Requirement 11) */}
            <Route path="/room/:code" element={<RoomInviteGateway />} />

            {/* Protected Game Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-room"
              element={
                <ProtectedRoute>
                  <CreateRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/join-room"
              element={
                <ProtectedRoute>
                  <JoinRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lobby/:code"
              element={
                <ProtectedRoute>
                  <LobbyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:code"
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/round-result/:code"
              element={
                <ProtectedRoute>
                  <RoundResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:code"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
