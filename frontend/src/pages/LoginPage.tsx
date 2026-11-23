import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getServerBaseUrl, setServerBaseUrl } from '../services/api';
import { Eye, EyeOff, Lock, User as UserIcon, AlertCircle, Sparkles, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import audioService from '../services/audioService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, intendedRedirectUrl, setIntendedRedirectUrl } = useAuthStore();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [serverUrl, setServerUrlState] = useState<string>(getServerBaseUrl());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEditServer = () => {
    const current = getServerBaseUrl() || 'http://10.161.180.82:3001';
    const newUrl = window.prompt('Enter Game Server URL (Wi-Fi or Tunnel):\nExample: http://10.161.180.82:3001', current);
    if (newUrl !== null) {
      setServerBaseUrl(newUrl.trim());
      setServerUrlState(newUrl.trim());
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId.trim() || !password) {
      setError('Please enter your User ID and password.');
      return;
    }

    setIsSubmitting(true);
    audioService.playButtonClick();

    try {
      await login({
        userId: userId.trim(),
        password,
        rememberMe,
      });

      audioService.playGameStart();
      setSuccessMessage('WELCOME BACK!\nPreparing your party room...');

      setTimeout(() => {
        if (intendedRedirectUrl) {
          const redirect = intendedRedirectUrl;
          setIntendedRedirectUrl(null);
          navigate(redirect);
        } else {
          navigate('/home');
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'INVALID USER ID OR PASSWORD.');
      audioService.playWrongGuess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-elevated w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative z-10"
      >
        {/* Game Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-0.5 shadow-neon-orange mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-white">
              11
            </div>
          </div>
          <h2 className="font-display font-black text-2xl text-white">PLAYER LOGIN</h2>
          <p className="text-xs text-cyan-400 font-extrabold uppercase tracking-widest mt-0.5">
            GUESS THE ELEVEN
          </p>
        </div>

        {/* Intended Room Banner */}
        {intendedRedirectUrl && (
          <div className="mb-4 p-3 rounded-2xl bg-purple-950/70 border border-purple-500/50 text-purple-200 text-xs font-semibold text-center">
            🎮 You have been invited to a game! Log in to join immediately.
          </div>
        )}

        {/* Success Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-center font-bold text-sm whitespace-pre-line shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-bounce" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID / Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              User ID or Email Address
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your User ID or Email"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <Link
                to="/forgot-password"
                onClick={() => audioService.playButtonClick()}
                className="text-[11px] text-cyan-400 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base shadow-neon-cyan disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-95 transition-all mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link
            to="/register"
            onClick={() => audioService.playButtonClick()}
            className="text-orange-400 hover:underline font-bold"
          >
            Create Account
          </Link>
        </div>

        {/* Server Connection Badge */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Server: <strong className="text-cyan-300 font-mono">{serverUrl || 'http://10.161.180.82:3001'}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleEditServer}
            className="text-orange-400 hover:text-orange-300 font-bold shrink-0 underline"
          >
            Change
          </button>
        </div>
      </motion.div>
    </div>
  );
};
