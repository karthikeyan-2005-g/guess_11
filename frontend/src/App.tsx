import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, useNavigate, Link } from 'react-router-dom';
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

// Room Invitation Gateway - Instant 1-tap Join for Invited Friends
const RoomInviteGateway: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, guestLogin, setIntendedRedirectUrl } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomCode = code?.toUpperCase() || '';

  useEffect(() => {
    if (roomCode && !isAuthenticated) {
      setIntendedRedirectUrl(`/room/${roomCode}`);
    }
  }, [roomCode, isAuthenticated, setIntendedRedirectUrl]);

  if (isAuthenticated) {
    return <Navigate to={`/lobby/${roomCode}`} replace />;
  }

  const handleQuickJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    setError(null);
    try {
      await guestLogin(nickname.trim() || undefined);
      navigate(`/lobby/${roomCode}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join party.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel-elevated w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 p-0.5 shadow-md mx-auto mb-4">
          <div className="w-full h-full bg-[#0c1527] rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-emerald-400">
            11
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider inline-block mb-2">
          Room {roomCode}
        </span>

        <h2 className="font-display font-black text-2xl text-white mb-1">
          YOU'RE INVITED! 🎮
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Join your friends in <strong className="text-emerald-400">Guess 11</strong> right now!
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleQuickJoin} className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Enter Your Player Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Ninja, Alex, SuperStar"
              maxLength={20}
              autoFocus
              className="w-full bg-slate-900/90 text-white placeholder-slate-500 px-4 py-3 rounded-2xl border border-slate-700 focus:border-emerald-400 focus:outline-none text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isJoining}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-sm transform active:scale-95 transition-all disabled:opacity-50"
          >
            {isJoining ? 'JOINING ROOM...' : '🚀 JOIN ROOM NOW'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Already have an account?</span>
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
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
